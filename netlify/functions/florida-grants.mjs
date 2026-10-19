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
    amount: "$5,000–$20,000",
    closeDate: "November 2, 2026",
    deadline: "2026-11-02",
    verified: "2026-10-18",
    category: "Capital",
    summary: "Capital grants for small nonprofits in Charlotte, DeSoto, Manatee, and Sarasota counties. Supports facilities, equipment, and related costs. Operating expenses under $300,000.",
    url: "https://www.selbyfdn.org/"
  },
  {
    id: "fl-uacf",
    title: "Community Impact Grants",
    agency: "United Arts of Central Florida",
    audience: "nonprofit",
    amount: "Up to about $5,000–$10,000",
    closeDate: "December 6, 2026",
    deadline: "2026-12-06",
    verified: "2026-10-18",
    category: "Arts",
    summary: "Supports arts, history, or science collaborations in Lake, Orange, Osceola, and Seminole counties. Applicant must be a Florida 501(c)(3).",
    url: "https://unitedarts.cc/"
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
  }
];

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

export default async function () {
  return json(200, { source: "florida", count: GRANTS.length, grants: GRANTS });
}

export const config = { path: "/.netlify/functions/florida-grants" };
