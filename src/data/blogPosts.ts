export type BlogPostLink = { href: string; label: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readMinutes: number;
  city?: string;
  locality?: string;
  relatedLinks?: BlogPostLink[];
  content: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-find-2-bhk-rent-chennai",
    title: "How to Find a 2 BHK for Rent in Chennai (2026 Guide)",
    excerpt:
      "Budget tips, top localities, documents to check, and how to compare listings before you pay a deposit.",
    publishedAt: "2026-05-01",
    readMinutes: 8,
    city: "Chennai",
    content: `
Chennai's rental market moves quickly—especially for 2 BHK flats near OMR, Velachery, and Anna Nagar. Start by fixing your monthly budget including maintenance and parking. A practical range for many 2 BHK homes in mid-range localities is ₹18,000–₹35,000 depending on furnishing and age of the building.

Use filters for BHK count, furnishing, and "immediate move-in" when browsing listings. Shortlist five to eight properties, then schedule visits within the same weekend so you can compare natural light, water pressure, and noise levels.

Before paying any advance, verify the owner's identity, society NOC if applicable, and whether the rent includes maintenance, power backup, and cable. Ask for a written rental agreement and receipt for token money. On KeyGhar you can save favourites to your shortlist and unlock owner contact when you are ready to call.`,
  },
  {
    slug: "pg-vs-flat-rent-india",
    title: "PG vs Flat: What Renters in India Should Know",
    excerpt:
      "Compare cost, privacy, rules, and ideal situations for paying guests versus independent flats.",
    publishedAt: "2026-05-03",
    readMinutes: 6,
    content: `
Paying guest (PG) accommodation suits students and early-career professionals who want managed meals, Wi‑Fi, and shorter commitments. Independent flats offer more privacy, space for families, and freedom on guests and cooking.

PG pricing often bundles food and utilities; flats separate rent, maintenance, and power. Check curfew rules, visitor policies, and deposit refund terms in PG agreements. For flats, inspect the rental agreement clause on notice period—typically one to three months in Indian cities.

Choose PG when you prioritise convenience and community; choose a flat when you need long-term stability and control over your home setup. Browse both property types on KeyGhar using the PG filter or apartment search.`,
  },
  {
    slug: "rental-agreement-documents-india",
    title: "Documents You Need for a Rental Agreement in India",
    excerpt:
      "ID proofs, agreements, stamp duty basics, and what landlords commonly ask before handover.",
    publishedAt: "2026-05-05",
    readMinutes: 7,
    content: `
Most landlords request Aadhaar and PAN copies from tenants, plus employer ID or college letter for students. Landlords should provide proof of ownership or authorisation to let the property.

A rental agreement should state rent, deposit, maintenance, lock-in, notice period, and who pays society charges. Many states require stamp duty on agreements—check local rules; e-stamping is available in several states.

Take photos of the flat's condition at move-in and attach a simple inventory list. Keep rent receipts or bank transfer records. Do not pay large cash deposits without a signed agreement. After you shortlist homes on KeyGhar, confirm these documents before transferring token money.`,
  },
  {
    slug: "bangalore-rent-localities-it-professionals",
    title: "Best Bangalore Localities for Rent Near IT Hubs",
    excerpt:
      "Koramangala, Whitefield, Bellandur, and more—how to balance commute, rent, and lifestyle.",
    publishedAt: "2026-05-08",
    readMinutes: 7,
    city: "Bangalore",
    content: `
Bangalore renters often trade commute time against rent. Near Outer Ring Road and Whitefield, 2 BHK rents vary widely by tower age and furnishing. Koramangala and HSR appeal to those who want nightlife and cafes; expect higher rents for smaller spaces.

Use metro proximity as a filter when available. Traffic peaks mean a locality 5 km away on paper can be 40 minutes at rush hour—visit during office hours before signing. Check borewell dependency and tanker costs in newer layouts.

Compare at least three listings in the same micro-market before deciding. KeyGhar lets you filter Bangalore by locality and BHK so you can align rent with your office location.`,
  },
  {
    slug: "pune-rent-guide-students-families",
    title: "Pune Rent Guide for Students and Families",
    excerpt:
      "Hinjewadi, Kharadi, Baner, and city-centre options—budgets, connectivity, and PG vs flat.",
    publishedAt: "2026-05-10",
    readMinutes: 6,
    city: "Pune",
    content: `
Pune's rental map splits between IT corridors and traditional city neighbourhoods. Hinjewadi and Wakad serve many tech parks; Kharadi and Baner attract mixed families and professionals. Students often choose shared flats or PGs near college belts.

Families should confirm school proximity and hospital access. Ask about water supply in summer and parking for two-wheelers or cars. Semester-wise PG contracts differ from 11-month flat agreements—read lock-in carefully.

Set a realistic budget including commute costs on Pune's busy roads. Search Pune listings on KeyGhar by locality and property type to build a shortlist before weekend visits.`,
  },
  {
    slug: "mumbai-rent-tips-first-time-renters",
    title: "Mumbai Rent Tips for First-Time Renters",
    excerpt:
      "Deposits, brokerage norms, suburb choices, and how to evaluate compact apartments.",
    publishedAt: "2026-05-12",
    readMinutes: 8,
    city: "Mumbai",
    content: `
Mumbai rents are among India's highest per square foot. First-time renters should expect larger deposits—often four to six months—and clarify whether brokerage applies. Suburbs like Andheri, Malad, and Navi Mumbai offer different price points than South Mumbai.

Measure usable space, not just carpet area on paper. Check train or metro walk time, building lift maintenance, and monsoon leakage signs. Societies may restrict bachelors or pets—confirm before paying token.

Negotiate rent and deposit when the flat has been listed for several weeks. Use KeyGhar to compare similar 1 and 2 BHK listings in your target suburb, then contact owners directly when you subscribe to the contact pass.`,
  },
];
