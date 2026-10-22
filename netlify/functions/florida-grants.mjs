const GRANTS = [
  {
    id: "fl-gps",
    title: "General Program Support",
    agency: "Florida Division of Arts and Culture",
    audience: "nonprofit",
    amount: "$1,000–$150,000 typical",
    closeDate: "Annual — next cycle dates not posted",
    deadline: "",
    verified: "2026-10-18",
    category: "Arts",
    summary: "Supports general program activities of Florida arts and cultural organizations. Applicant must be a Florida nonprofit or public entity with arts and cultural programming.",
    url: "https://dos.fl.gov/cultural/grants/grant-programs/general-program-support/"
  },
  {
    id: "fl-scp",
    title: "Specific Cultural Projects",
    agency: "Florida Division of Arts and Culture",
    audience: "nonprofit",
    amount: "Project support",
    closeDate: "Annual — next cycle dates not posted",
    deadline: "",
    verified: "2026-10-18",
    category: "Arts",
    summary: "Funds a single cultural project, program, exhibition, or series. Florida nonprofits, public entities, and some individual artists may apply.",
    url: "https://dos.fl.gov/cultural/grants/grant-programs/specific-cultural-projects/"
  },
  {
    id: "fl-facilities",
    title: "Cultural Facilities",
    agency: "Florida Division of Arts and Culture",
    audience: "nonprofit",
    amount: "Facility project",
    closeDate: "Annual — next cycle dates not posted",
    deadline: "",
    verified: "2026-10-18",
    category: "Arts",
    summary: "Supports renovation, construction, or acquisition of facilities for arts and cultural organizations. Applicant must be associated with an eligible organization.",
    url: "https://dos.fl.gov/cultural/grants/grant-programs/cultural-facilities/"
  },
  {
    id: "fl-iwt",
    title: "Incumbent Worker Training",
    agency: "CareerSource Florida",
    audience: "for-profit",
    amount: "Up to $100,000 reimbursement",
    closeDate: "Rolling — apply anytime (subject to available funding)",
    deadline: "",
    verified: "2026-10-18",
    category: "Workforce",
    summary: "Reimburses approved training costs for existing employees of Florida businesses. Small firms may receive a higher reimbursement rate. Most general nonprofits are not eligible.",
    url: "https://careersourceflorida.com/business-services/training-grants/"
  },
  {
    id: "fl-qrt",
    title: "Quick Response Training",
    agency: "CareerSource Florida",
    audience: "for-profit",
    amount: "Training reimbursement. FY pool about $7.5M",
    closeDate: "Rolling — apply anytime (subject to available funding)",
    deadline: "",
    verified: "2026-10-18",
    category: "Workforce",
    summary: "State-funded training for new, full-time employees at new or expanding Florida businesses in targeted industries. Training is specialized and non-degree.",
    url: "https://careersourceflorida.com/business-services/training-grants/"
  },
  {
    id: "fl-blue",
    title: "Mental Well-Being Grants",
    agency: "Florida Blue Foundation",
    audience: "nonprofit",
    amount: "About $300,000–$400,000 over four years",
    closeDate: "Annual — next cycle dates not posted",
    deadline: "",
    verified: "2026-10-18",
    category: "Health",
    summary: "Multi-year grants for Florida nonprofits with documented work in mental well-being. Part of a larger Florida Blue Foundation health portfolio.",
    url: "https://www.floridablue.com/foundation"
  },
  {
    id: "fl-selby",
    title: "Small and Mighty Grants",
    agency: "William G. and Marie Selby Foundation",
    audience: "nonprofit",
    amount: "$5,000–$20,000 typical",
    closeDate: "November 2, 2026",
    deadline: "2026-11-02",
    verified: "2026-10-20",
    category: "Capital",
    summary: "Capital grants for small nonprofits in Charlotte, DeSoto, Manatee, and Sarasota counties. Supports facilities, equipment, and related costs. Operating budget of $300,000 or less. A pre-grant meeting with the Grants Manager is required at least two weeks before the deadline.",
    url: "https://selbyfdn.org/sam-grant-application/"
  },
  {
    id: "fl-uacf",
    title: "Community Impact Grants",
    agency: "United Arts of Central Florida",
    audience: "nonprofit",
    amount: "$5,000",
    closeDate: "December 6, 2026",
    deadline: "2026-12-06",
    verified: "2026-10-20",
    category: "Arts",
    summary: "Competitive $5,000 grants (10 projects awarded) for a collaboration between an arts organization and a NON-arts organization in Lake, Orange, Osceola, or Seminole counties. Applicant must be a 501(c)(3) in good standing; the partner does not need to be one. Two arts organizations together are not eligible.",
    url: "https://unitedartscfl.org/grants/project-grants/"
  },
  {
    id: "fl-volunteer",
    title: "Volunteer Florida Grant Opportunities",
    agency: "Volunteer Florida",
    audience: "nonprofit",
    amount: "Varies by program",
    closeDate: "Check volunteerflorida.org — dates vary",
    deadline: "",
    verified: "2026-10-18",
    category: "Community",
    summary: "State service commission funding for AmeriCorps, volunteer engagement, disaster case management, and rural community projects. Mostly nonprofits and public partners.",
    url: "https://www.volunteerflorida.org/"
  },
  {
    id: "fl-mompops",
    title: "Mom and Pop Small Business Grant",
    agency: "Miami-Dade County",
    audience: "for-profit",
    amount: "Up to $5,000. Amount varies by district.",
    closeDate: "Varies by district — no single deadline",
    deadline: "",
    verified: "2026-10-18",
    category: "Small business",
    summary: "Local grant for Miami-Dade for-profit small businesses. Funds equipment, supplies, advertising, insurance, and minor renovations. Business must be in the district that is open. Not statewide.",
    url: "https://www.miamidade.gov/mom-pop-grants/"
  },
  {
    id: "fl-export",
    title: "Export Marketing Plan Grant",
    agency: "SelectFlorida",
    audience: "for-profit",
    amount: "Up to $4,500",
    closeDate: "Rolling — apply anytime",
    deadline: "",
    verified: "2026-10-18",
    category: "Trade",
    summary: "Helps Florida manufacturers and service providers build an export marketing plan. Company pays $500. SelectFlorida covers up to $4,500. Limited to one per lifetime.",
    url: "https://selectflorida.org/export-from-florida/trade-grants/export-marketing-plans/"
  },
  {
    id: "fl-uwf",
    title: "United Way of West Florida Mini Grants",
    agency: "United Way of West Florida",
    audience: "nonprofit",
    amount: "Up to $5,000",
    closeDate: "Annual — next cycle dates not posted",
    deadline: "",
    verified: "2026-10-18",
    category: "Capacity",
    summary: "Capacity grants for grassroots nonprofits in the West Florida service area. Funds professional development, consulting, software, and non-salary operations. Not statewide.",
    url: "https://www.unitedwaywestflorida.org/"
  },
  {
    id: "fl-crop",
    title: "Specialty Crop Block Grant",
    agency: "Florida Department of Agriculture and Consumer Services",
    audience: "nonprofit",
    amount: "Competitive. Varies by project",
    closeDate: "Annual — next cycle dates not posted",
    deadline: "",
    verified: "2026-10-18",
    category: "Agriculture",
    summary: "Funds projects that improve the market for specialty crops. Typical applicants are agricultural organizations and nonprofits. Confirm the current FDACS cycle.",
    url: "https://www.fdacs.gov/Agriculture-Industry/Grants-and-Funding-Opportunities"
  },
  {
    id: "fl-library",
    title: "Library Cooperative Grants",
    agency: "Florida Division of Library and Information Services",
    audience: "nonprofit",
    amount: "Formula. Awarded annually",
    closeDate: "Annual — next cycle dates not posted",
    deadline: "",
    verified: "2026-10-18",
    category: "Libraries",
    summary: "Grants for Florida libraries and nonprofit organizations that support library services, resource sharing, digitization, and cooperative systems.",
    url: "https://dos.fl.gov/library-archives/library-development/funding/"
  },
  {
    id: "fl-commerce",
    title: "FloridaCommerce Incentives and Grants",
    agency: "FloridaCommerce",
    audience: "both",
    amount: "Varies by program",
    closeDate: "Varies by program — no single deadline",
    deadline: "",
    verified: "2026-10-18",
    category: "Economic development",
    summary: "State economic development, workforce, broadband, rural, and community programs. Some are for businesses, some for local governments or nonprofits. Confirm the specific program.",
    url: "https://floridajobs.org/"
  },
  {
    id: "fl-gulfcoast",
    title: "Community Grants — 2027 Winter Cycle",
    agency: "Gulf Coast Community Foundation",
    audience: "nonprofit",
    amount: "Up to $25,000 per year",
    closeDate: "December 31, 2026",
    deadline: "2026-12-31",
    verified: "2026-10-20",
    category: "Community",
    summary: "Program and event funding for nonprofits actively serving Sarasota, Charlotte, or DeSoto counties, Boca Grande, Lakewood Ranch, or Longboat Key. Up to $25,000 total per nonprofit per fiscal year across program and event grants combined.",
    url: "https://gulfcoastcf.org/community-impact/grants/apply"
  },
  {
    id: "fl-beaches",
    title: "Beaches Community Fund Grants",
    agency: "Community Foundation for Northeast Florida",
    audience: "nonprofit",
    amount: "Amount varies",
    closeDate: "November 30, 2026",
    deadline: "2026-11-30",
    verified: "2026-10-20",
    category: "Community",
    summary: "Grants for 501(c)(3)s (or fiscally sponsored organizations) with at least two years of work serving the Beaches area from Mayport to Guana, east of the Intracoastal Waterway. Narrow geography — Beaches organizations only.",
    url: "https://www.jaxcf.org/grants/beaches-community-fund/"
  },
  {
    id: "fl-collab-rural",
    title: "Community Impact Micro Rural Grant",
    agency: "Collaboratory (Southwest Florida Community Foundation)",
    audience: "nonprofit",
    amount: "Up to $5,000",
    closeDate: "November 13, 2026",
    deadline: "2026-11-13",
    verified: "2026-10-20",
    category: "Health",
    summary: "Micro-grants (up to 8 awards) for 501(c)(3)s in Charlotte, Glades, or Hendry counties working on health, well-being, and root-cause projects. Decisions announced by December 1, 2026.",
    url: "https://collaboratory.org/Grantmaking/"
  },
  {
    id: "fl-broward-focus",
    title: "Focus Area Grants",
    agency: "Community Foundation of Broward",
    audience: "nonprofit",
    amount: "Up to $200,000 per year",
    closeDate: "December 15, 2026",
    deadline: "2026-12-15",
    verified: "2026-10-20",
    category: "Community",
    summary: "Major grants for Broward County 501(c)(3)s operating at least three years; Candid Gold Seal of Transparency required. This window covers Arts & Culture and Healthy & Thriving Communities. Single applicants may request up to $200,000/year (max 50% of operating budget).",
    url: "https://www.cfbroward.org/receive/apply-for-grants"
  },
  {
    id: "fl-broward-idd",
    title: "Pathways to Possibility — IDD Transition Grants",
    agency: "Community Foundation of Broward",
    audience: "nonprofit",
    amount: "Up to $50,000",
    closeDate: "November 30, 2026",
    deadline: "2026-11-30",
    verified: "2026-10-20",
    category: "Community",
    summary: "Grants for Broward nonprofits improving, expanding, or launching transition services for youth and young adults ages 12–26 with intellectual and developmental disabilities. Applications open October 30, 2026.",
    url: "https://www.cfbroward.org/articles/new-grants-for-nonprofits-helping-youth-with-intellectual-and-developmental-disabilities-idd"
  },
  {
    id: "fl-pbmartin",
    title: "Community Impact Grants",
    agency: "Community Foundation for Palm Beach and Martin Counties",
    audience: "nonprofit",
    amount: "Amount varies",
    closeDate: "December 18, 2026",
    deadline: "2026-12-18",
    verified: "2026-10-20",
    category: "Community",
    summary: "Competitive grants for nonprofits serving Palm Beach and Martin counties. Letter of intent due December 18, 2026; invited full proposals follow in March 2027. One proposal per organization.",
    url: "https://yourcommunityfoundation.org/the-competitive-grantmaking-process/"
  },
  {
    id: "fl-cfsarasota-cap",
    title: "Capacity Building Grants",
    agency: "Community Foundation of Sarasota County",
    audience: "nonprofit",
    amount: "Up to $15,000",
    closeDate: "April 1, 2027",
    deadline: "2027-04-01",
    verified: "2026-10-20",
    category: "Capacity",
    summary: "Capacity-building support for 501(c)(3) public charities with a physical presence in Sarasota, Manatee, Charlotte, or DeSoto County and a current Giving Partner profile. The spring cycle opens April 1, 2027 for 30 days.",
    url: "https://www.cfsarasota.org/Capacity-Building-Grants"
  },
  {
    id: "fl-stpete-mlk",
    title: "MLK Communities in Action Mini-Grant",
    agency: "City of St. Petersburg",
    audience: "both",
    amount: "Up to $2,500",
    closeDate: "October 28, 2026",
    deadline: "2026-10-28",
    verified: "2026-10-20",
    category: "Community",
    summary: "Mini-grants (20 awards) for Florida-registered nonprofits and small businesses located in St. Petersburg and operating at least one year. Funds a service or wellness activity held January 9–24, 2027 in arts/culture, community support, environment, or health/wellness.",
    url: "https://www.stpete.org/Final_10-6%20MLK%20Grant%20Guidelines.pdf?t=202610091347210"
  },
  {
    id: "fl-broward-festival",
    title: "Arts & Cultural Festival and Special Event Sponsorship",
    agency: "Broward County Cultural Division",
    audience: "both",
    amount: "Up to $50,000",
    closeDate: "Rolling — FY27 cycle open now",
    deadline: "",
    verified: "2026-10-20",
    category: "Arts",
    summary: "Sponsorships for arts and cultural festivals and special events held in Broward County and open to the public. Up to $25,000 for new or emerging events; up to $50,000 for established events. Nonprofits and for-profit arts organizations may apply.",
    url: "https://www.broward.org/arts/Funding/Sponsorships/ArtsCulturalFestivalSpecialEventSponsorship"
  },
  {
    id: "fl-pbc-bright",
    title: "Bright Ideas Sponsorships",
    agency: "Cultural Council for Palm Beach County",
    audience: "nonprofit",
    amount: "Up to $100,000",
    closeDate: "January 25, 2027",
    deadline: "2027-01-25",
    verified: "2026-10-20",
    category: "Arts",
    summary: "Sponsorships for nonprofits in the Palm Beaches: up to $100,000 for new marketing activations, up to $50,000 for special events/festivals, up to $30,000 for MOSAIC programming. Cycle opens December 14, 2026; funded projects must be new (three years old or less).",
    url: "https://www.palmbeachculture.com/cultural-organizations/sponsorships/"
  },
  {
    id: "fl-orange-sustainable",
    title: "Sustainable Communities Grant",
    agency: "Orange County Government",
    audience: "nonprofit",
    amount: "Up to $5,000",
    closeDate: "Rolling — September to April, first-come",
    deadline: "",
    verified: "2026-10-20",
    category: "Community",
    summary: "For registered neighborhood organizations and HOAs ONLY (not general nonprofits or businesses). Funds projects on neighborhood common areas that cut energy or water use, restore ponds, or build community gardens. Accepted first-come during the fiscal year window.",
    url: "https://www.ocfl.net/Portals/0/Library/Neighbors-Housing/docs/Sustainable%20Communities%20Grant%20Guidelines%20(rev.%20April%202025)-CMcert.pdf"
  },
  {
    id: "fl-jax-psg",
    title: "Public Service Grant Program",
    agency: "City of Jacksonville",
    audience: "nonprofit",
    amount: "Amount varies",
    closeDate: "Annual — opens May 2027",
    deadline: "",
    verified: "2026-10-20",
    category: "Community",
    summary: "Annual city grants for nonprofits serving Jacksonville's most vulnerable residents. The application cycle opens each May, and attending the mandatory applicant workshop is required to apply.",
    url: "http://www.coj.net/departments/finance/grants-and-compliance/public-service-grants"
  },
  {
    id: "fl-hills-cdg",
    title: "Cultural Development Grant Program",
    agency: "Arts Council of Hillsborough County",
    audience: "nonprofit",
    amount: "Amount varies",
    closeDate: "Annual — January window",
    deadline: "",
    verified: "2026-10-20",
    category: "Arts",
    summary: "Operating support for organizations whose primary mission is delivering cultural programs in Hillsborough County. Applications open in a short January window each year.",
    url: "https://www.hillsborougharts.org/organizational-grants/"
  },
  {
    id: "fl-hills-caig",
    title: "Community Arts Impact Grant",
    agency: "Arts Council of Hillsborough County",
    audience: "nonprofit",
    amount: "Up to $5,000",
    closeDate: "Annual — March–April window",
    deadline: "",
    verified: "2026-10-20",
    category: "Arts",
    summary: "Small grants for community-based arts organizations serving underserved populations in Hillsborough County. Designed partly as a first-grant opportunity for smaller organizations. (A separate track offers colleges up to $12,500.)",
    url: "https://www.hillsborougharts.org/organizational-grants/"
  },
  {
    id: "fl-hills-sepg",
    title: "Special Events Partnership Grant",
    agency: "Hillsborough County",
    audience: "nonprofit",
    amount: "Amount varies",
    closeDate: "Annual — two cycles per year",
    deadline: "",
    verified: "2026-10-20",
    category: "Arts",
    summary: "Support for new or significantly expanding public arts and cultural events in Hillsborough County. Two cycles per fiscal year. Applicants must be 501(c)(3), (c)(4), or (c)(6); charitable fundraising events are not eligible.",
    url: "https://hcfl.gov/businesses/business-community/business-grants/apply-for-a-cultural-assets-program-special-events-partnership-grant"
  },
  {
    id: "fl-hills-historic",
    title: "Historic Preservation Challenge Grant",
    agency: "Hillsborough County",
    audience: "both",
    amount: "Up to $250,000 (50% match)",
    closeDate: "Annual — August–September window",
    deadline: "",
    verified: "2026-10-20",
    category: "Capital",
    summary: "Reimbursement grants (1:1 match required) for rehabilitation or restoration of historic structures and heritage-tourism projects in Hillsborough County. Nonprofits and private owners may apply for construction projects; no government applicants and no private residences.",
    url: "https://www.hillsboroughcounty.org/en/businesses/business-community/grants/action-folder/apply-for-a-historic-preservation-challenge-grant"
  },
  {
    id: "fl-pbc-catci",
    title: "Category C-I — Cultural Development Fund",
    agency: "Cultural Council for Palm Beach County",
    audience: "nonprofit",
    amount: "Amount varies",
    closeDate: "Annual — expected Summer 2027",
    deadline: "",
    verified: "2026-10-20",
    category: "Arts",
    summary: "County-funded support for small or emerging nonprofit cultural organizations in Palm Beach County with operating revenues of at least $25,000. Applications are expected to open in Summer 2027.",
    url: "https://www.palmbeachculture.com/cultural-organizations/grants-for-cultural-organizations/category-c-i-grant/"
  },
  {
    id: "fl-pinellas-social",
    title: "Social Action Funding Grant Program",
    agency: "Pinellas County Human Services",
    audience: "nonprofit",
    amount: "$10,000–$150,000",
    closeDate: "Annual — spring window",
    deadline: "",
    verified: "2026-10-20",
    category: "Community",
    summary: "Grants for 501(c)(3)s incorporated in Florida for at least one year and serving low-income Pinellas County residents, in food, homeless and housing, healthcare, human services, and aging priorities.",
    url: "https://pinellas.gov/news/social-action-funding-grant-applications-sought-3/"
  },
  {
    id: "fl-pinellas-mstu",
    title: "MSTU Special Projects Funding",
    agency: "Pinellas County",
    audience: "nonprofit",
    amount: "Up to $25,000",
    closeDate: "Annual — winter/spring window",
    deadline: "",
    verified: "2026-10-20",
    category: "Capital",
    summary: "One-time capital and community-asset project funding for nonprofits, for projects located in unincorporated Pinellas County only. Operating expenses are not eligible.",
    url: "https://pinellas.gov/mstu-special-projects-funding-application-instructions/"
  },
  {
    id: "fl-sarasota-tdca",
    title: "Tourist Development Cultural/Arts Program",
    agency: "Sarasota County",
    audience: "nonprofit",
    amount: "Up to $125,000 (tiered, 1:1 match)",
    closeDate: "Annual — January–March window",
    deadline: "",
    verified: "2026-10-20",
    category: "Arts",
    summary: "Tourist Development Tax funding for Florida 501(c)(3)s running arts or cultural events in Sarasota County designed to attract tourists. Awards are tiered by organization size; at least 50% of funds must go to marketing. Applications open each January.",
    url: "https://sarasotaarts.org/wp-content/uploads/sites/sarasotaarts.org/images/2025/12/FY27-TDCA-Guidelines-1.pdf"
  },
  {
    id: "fl-fltalks",
    title: "Florida Talks Speakers' Program",
    agency: "Florida Humanities",
    audience: "nonprofit",
    amount: "$300 honorarium + up to $250 travel",
    closeDate: "Rolling — apply 6+ weeks ahead",
    deadline: "",
    verified: "2026-10-20",
    category: "Arts",
    summary: "Brings a Florida Talks speaker to your community: Florida Humanities pays the $300 speaker honorarium directly and reimburses up to $250 in travel for hosts with budgets of $250,000 or less. Programs must be free and open to the public. Nonprofits, municipalities, and civic or educational hosts may apply.",
    url: "https://floridahumanities.org/funding-opportunities/florida-talks-program/"
  },
  {
    id: "fl-dep-cpi",
    title: "Coastal Partnership Initiative",
    agency: "Florida Department of Environmental Protection",
    audience: "both",
    amount: "$10,000–$60,000 (1:1 match)",
    closeDate: "October 31, 2026",
    deadline: "2026-10-31",
    verified: "2026-10-20",
    category: "Environment",
    summary: "Coastal resilience, public access, working waterfront, and stewardship projects in Florida's 35 coastal counties. A local government must lead or partner — nonprofits may apply only with an eligible local-government partner, and may not lead construction or restoration.",
    url: "https://floridadep.gov/rcp/fcmp/content/grants"
  },
  {
    id: "fl-vfa",
    title: "Volunteer Fire Assistance Grants",
    agency: "Florida Forest Service (FDACS)",
    audience: "both",
    amount: "Amount varies (50% match)",
    closeDate: "Rolling — while funding lasts",
    deadline: "",
    verified: "2026-10-20",
    category: "Community",
    summary: "Cost-share grants for rural volunteer fire departments serving communities of 10,000 or fewer. Nonprofit departments that are at least 80% volunteer and NIMS-compliant may apply. Approved on a rolling basis until funding is exhausted.",
    url: "https://www.fdacs.gov/Forest-Wildfire/For-Communities/Grants/Volunteer-Fire-Assistance-Grants"
  },
  {
    id: "fl-big",
    title: "Boating Infrastructure Grant Program",
    agency: "Florida Fish and Wildlife Conservation Commission",
    audience: "both",
    amount: "Up to $300,000 (Tier I)",
    closeDate: "July 1, 2027",
    deadline: "2027-07-01",
    verified: "2026-10-20",
    category: "Environment",
    summary: "Federal funding for transient recreational boater tie-up facilities (for boats 26 feet and longer). Local governments, nonprofits, and private organizations may apply. Tier I projects may request up to $300,000; larger Tier II projects more.",
    url: "https://myfwc.com/boating/grants-programs/bigp/"
  },
  {
    id: "fl-springs",
    title: "Protect Florida Springs Grants",
    agency: "Fish & Wildlife Foundation of Florida",
    audience: "both",
    amount: "$5,000–$50,000 typical",
    closeDate: "Annual — March window",
    deadline: "",
    verified: "2026-10-20",
    category: "Environment",
    summary: "License-plate funded grants for community-based springs research and outreach. Open to 501(c)(3)s, government agencies, and universities; applications open each March.",
    url: "https://wildlifeflorida.org/conservation-grants/"
  },
  {
    id: "fl-wildlife-tag",
    title: "Wildlife Foundation of Florida Grants",
    agency: "Fish & Wildlife Foundation of Florida",
    audience: "both",
    amount: "Up to $75,000 (most $1,000–$25,000)",
    closeDate: "Annual — June window",
    deadline: "",
    verified: "2026-10-20",
    category: "Environment",
    summary: "License-plate funded grants for conservation, habitat, hunting and shooting sports, and public open space projects. Open to 501(c)(3)s, government agencies, and colleges; applications open each June.",
    url: "https://wildlifeflorida.org/wildlife-foundation-of-florida-tag-grants/"
  },
  {
    id: "fl-oceans-tag",
    title: "Discover Florida's Oceans Grants",
    agency: "Fish & Wildlife Foundation of Florida",
    audience: "nonprofit",
    amount: "Up to $50,000 (most $1,000–$25,000)",
    closeDate: "Annual — September window",
    deadline: "",
    verified: "2026-10-20",
    category: "Environment",
    summary: "License-plate funded grants for ocean, estuarine, and coastal research and conservation. General education or outreach-only projects are not considered. Applications run September 1–30 each year.",
    url: "http://wildlifeflorida.org/discover-floridas-oceans-tag-grants/"
  }
];

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

// Freshness rules (founder directive, 2026-10-22): nothing sits on this list
// without a date attached. Dated entries roll off automatically the day after
// their deadline. Every entry also carries a reviewBy date — 45 days after it
// was last verified, or its deadline if that comes first — which the weekly
// sentinel enforces so rolling entries get re-checked instead of going stale
// silently.
function reviewByFor(g) {
  const v = Date.parse(g.verified);
  let review = Number.isNaN(v) ? Date.now() + 45 * 864e5 : v + 45 * 864e5;
  if (g.deadline) {
    const d = Date.parse(g.deadline);
    if (!Number.isNaN(d)) review = Math.min(review, d);
  }
  return new Date(review).toISOString().slice(0, 10);
}

export default async function () {
  const today = new Date().toISOString().slice(0, 10);
  const open = GRANTS.filter(g => !g.deadline || g.deadline >= today);
  const grants = open.map(g => ({ ...g, reviewBy: reviewByFor(g) }));
  return json(200, { source: "florida", count: grants.length, closedCount: GRANTS.length - grants.length, grants });
}

export const config = { path: "/.netlify/functions/florida-grants" };
