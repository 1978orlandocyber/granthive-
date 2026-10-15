// netlify/functions/search-grants.js
//
// Server-side proxy for Grants.gov opportunity search.
// Keeps the browser off the third-party API and returns a stable shape.

const GRANTS_URL = 'https://api.grants.gov/v1/api/search2';
const TIMEOUT_MS = 20000;
const DETAIL_URL = "https://api.grants.gov/v1/api/fetchOpportunity";
const ALLOWED_AMOUNTS = new Set(["", "under50", "50to250", "250to1000", "over1000"]);
const MAX_ROWS = 25;
const ALLOWED_SORTS = new Set(['closeDate', 'openDate', 'awardCeiling']);
const ALLOWED_ELIG = new Set(['', '25', '12', '20', '06']);
const ALLOWED_INSTRUMENTS = new Set(['', 'G', 'CA', 'O']);
const ALLOWED_CATEGORIES = new Set(['', 'AG', 'AR', 'BC', 'CD', 'ED', 'EN', 'ENV', 'HL', 'HO', 'ISS', 'ST']);

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(body)
  };
}

function safeError(statusCode, message) {
  return jsonResponse(statusCode, { error: message, grants: [] });
}

function clampInt(value, fallback, min, max) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

async function handler(event) {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { Allow: 'GET, POST', 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: 'Method not allowed.', grants: [] })
    };
  }

  let input = {};
  if (event.httpMethod === 'GET') {
    input = event.queryStringParameters || {};
  } else {
    let raw = event.body || '{}';
    if (event.isBase64Encoded && typeof raw === 'string') {
      raw = Buffer.from(raw, 'base64').toString('utf8');
    }
    if (typeof raw !== 'string' || raw.length > 4000) {
      return safeError(400, 'Invalid request body.');
    }
    try {
      input = JSON.parse(raw || '{}');
    } catch {
      return safeError(400, 'Request body must be valid JSON.');
    }
  }

  const keyword = String(input.keyword || input.query || 'business').trim().slice(0, 120) || 'business';
  const rows = clampInt(input.rows || input.limit, 10, 1, MAX_ROWS);
  const sortBy = ALLOWED_SORTS.has(input.sortBy) ? input.sortBy : 'closeDate';
  const elig = input.eligibilities || input.eligibility || '';
  if (!ALLOWED_ELIG.has(String(elig))) {
    return safeError(400, 'Eligibility filter is invalid.');
  }
  const instrument = String(input.fundingInstruments || input.fundingType || '');
  const category = String(input.fundingCategories || input.grantType || '');
  const amount = String(input.amount || '');
  if (!ALLOWED_INSTRUMENTS.has(instrument)) return safeError(400, 'Funding type is invalid.');
  if (!ALLOWED_CATEGORIES.has(category)) return safeError(400, 'Grant type is invalid.');
  if (!ALLOWED_AMOUNTS.has(amount)) return safeError(400, 'Funding amount is invalid.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const body = {
      keyword,
      rows: amount ? MAX_ROWS : rows,
      oppStatuses: 'forecasted|posted'
    };
    if (elig) body.eligibilities = String(elig);
    if (instrument) body.fundingInstruments = instrument;
    if (category) body.fundingCategories = category;
    const res = await fetch(GRANTS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (!res.ok) {
      console.error('Grants.gov returned non-success status.');
      return safeError(502, 'Grant search is temporarily unavailable.');
    }

    const data = await res.json();
    if (data && data.errorcode && data.errorcode !== 0) {
      console.error('Grants.gov search2 returned errorcode.');
      return safeError(502, 'Grant search is temporarily unavailable.');
    }
    const raw = data?.data?.oppHits || data?.oppHits || [];
    let grants = raw.slice(0, amount ? MAX_ROWS : rows).map(g => ({
      opportunityTitle: String(g.title || g.opportunityTitle || 'Federal Grant Opportunity').slice(0, 300),
      agencyName: String(g.agency || g.agencyName || 'Federal Agency').slice(0, 200),
      synopsis: String(g.synopsis || g.description || g.title || 'See Grants.gov for details.').slice(0, 800),
      awardCeiling: Number.isFinite(Number(g.awardCeiling)) ? Number(g.awardCeiling) : null,
      closeDate: g.closeDate ? String(g.closeDate).slice(0, 40) : null,
      opportunityNumber: g.number || g.opportunityNumber ? String(g.number || g.opportunityNumber).slice(0, 80) : '',
      opportunityId: g.id ? String(g.id).slice(0, 40) : ''
    }));

    if (amount) {
      grants = await Promise.all(grants.map(async (grant) => {
        if (!grant.opportunityId) return grant;
        try {
          const detailRes = await fetch(DETAIL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ opportunityId: grant.opportunityId }),
            signal: controller.signal
          });
          if (!detailRes.ok) return grant;
          const detail = await detailRes.json();
          const ceiling = Number(detail?.data?.synopsis?.awardCeiling);
          if (Number.isFinite(ceiling) && ceiling > 0) grant.awardCeiling = ceiling;
        } catch {}
        return grant;
      }));
      const ranges = {
        under50: [0, 50000],
        '50to250': [50000, 250000],
        '250to1000': [250000, 1000000],
        over1000: [1000000, Infinity]
      };
      const [min, max] = ranges[amount];
      grants = grants.filter(g => g.awardCeiling && g.awardCeiling >= min && g.awardCeiling < max).slice(0, rows);
    }

    return jsonResponse(200, {
      source: 'grants.gov',
      count: grants.length,
      grants
    });
  } catch (error) {
    console.error(error && error.name === 'AbortError' ? 'Grants.gov request timed out.' : 'Grants.gov request failed.');
    return safeError(
      error && error.name === 'AbortError' ? 504 : 502,
      error && error.name === 'AbortError'
        ? 'Grant search took too long. Please try again.'
        : 'Could not reach Grants.gov. Please try again.'
    );
  } finally {
    clearTimeout(timer);
  }
};

export default async function (req) {
  const body = req.method === "GET" ? null : await req.text();
  const event = {
    httpMethod: req.method,
    body,
    isBase64Encoded: false,
    queryStringParameters: Object.fromEntries(new URL(req.url).searchParams),
    headers: Object.fromEntries(req.headers)
  };
  const result = await handler(event);
  return new Response(result.body, {
    status: result.statusCode,
    headers: result.headers || { "Content-Type": "application/json; charset=utf-8" }
  });
}

export const config = {
  path: "/.netlify/functions/search-grants",
  rateLimit: {
    windowLimit: 20,
    windowSize: 60,
    aggregateBy: ["ip"]
  }
};

