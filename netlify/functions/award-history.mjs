// netlify/functions/award-history.mjs
//
// Server-side proxy for USAspending.gov award search ("who won").
// Free public API, no key. Complements the Grants.gov opportunity search:
// Grants.gov shows what is open, USAspending shows who got funded.
//
// USAspending request shape verified live 2026-10-18 against
// POST https://api.usaspending.gov/api/v2/search/spending_by_award/ :
// filters.award_type_codes is required; results[] keys are the requested
// field names; "Assistance Listing" may be null.

const USA_URL = 'https://api.usaspending.gov/api/v2/search/spending_by_award/';
const TIMEOUT_MS = 20000;
const MAX_ROWS = 25;
// USAspending award_type_codes for assistance: 02 block grant,
// 03 formula grant, 04 project grant, 05 cooperative agreement.
const GRANT_CODES = ['02', '03', '04', '05'];
const ALLOWED_SORTS = new Set(['amount', 'date']);
const FIELDS = [
  'Award ID',
  'Recipient Name',
  'Award Amount',
  'Awarding Agency',
  'Awarding Sub Agency',
  'Start Date',
  'End Date',
  'Description',
  'Assistance Listing'
];

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
  return jsonResponse(statusCode, { error: message, awards: [] });
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
      body: JSON.stringify({ error: 'Method not allowed.', awards: [] })
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

  const keyword = String(input.keyword || input.query || 'health').trim().slice(0, 120) || 'health';
  const rows = clampInt(input.rows || input.limit, 10, 1, MAX_ROWS);
  const sortBy = ALLOWED_SORTS.has(input.sortBy) ? input.sortBy : 'amount';
  const state = String(input.state || '').trim().toUpperCase();
  if (state && !/^[A-Z]{2}$/.test(state)) {
    return safeError(400, 'State must be a 2-letter code.');
  }

  const filters = { award_type_codes: GRANT_CODES, keywords: [keyword] };
  if (state) {
    filters.place_of_performance_locations = [{ country: 'USA', state }];
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(USA_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filters,
        fields: FIELDS,
        sort: sortBy === 'date' ? 'Start Date' : 'Award Amount',
        order: 'desc',
        limit: rows,
        page: 1
      }),
      signal: controller.signal
    });

    if (!res.ok) {
      console.error('USAspending returned non-success status.');
      return safeError(502, 'Award search is temporarily unavailable.');
    }

    const data = await res.json();
    const raw = Array.isArray(data?.results) ? data.results : [];
    const awards = raw.slice(0, rows).map(r => ({
      awardId: String(r['Award ID'] || '').slice(0, 80),
      awardKey: String(r.generated_internal_id || '').slice(0, 80),
      recipientName: String(r['Recipient Name'] || 'Unknown recipient').slice(0, 200),
      awardAmount: Number.isFinite(Number(r['Award Amount'])) ? Number(r['Award Amount']) : null,
      agencyName: String(r['Awarding Agency'] || 'Federal Agency').slice(0, 200),
      subAgency: String(r['Awarding Sub Agency'] || '').slice(0, 200),
      startDate: r['Start Date'] ? String(r['Start Date']).slice(0, 40) : null,
      endDate: r['End Date'] ? String(r['End Date']).slice(0, 40) : null,
      description: String(r['Description'] || 'See USAspending.gov for details.').slice(0, 500),
      assistanceListing: r['Assistance Listing'] ? String(r['Assistance Listing']).slice(0, 40) : null
    }));

    return jsonResponse(200, {
      source: 'usaspending',
      count: awards.length,
      awards
    });
  } catch (error) {
    console.error(error && error.name === 'AbortError' ? 'USAspending request timed out.' : 'USAspending request failed.');
    return safeError(
      error && error.name === 'AbortError' ? 504 : 502,
      error && error.name === 'AbortError'
        ? 'Award search took too long. Please try again.'
        : 'Could not reach USAspending.gov. Please try again.'
    );
  } finally {
    clearTimeout(timer);
  }
}

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
  path: "/.netlify/functions/award-history",
  rateLimit: {
    windowLimit: 20,
    windowSize: 60,
    aggregateBy: ["ip"]
  }
};
