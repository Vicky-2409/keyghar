# NestLease — Fake Property Rental Demo

A simple, portfolio-ready rental listing demo inspired by 99acres, Magicbricks, and Airbnb. **No admin panel, no backend** — static site ready for [Vercel](https://vercel.com).

All listings, prices, and contact details are **fictitious**. Property photos are stored locally under `public/images/properties/` (one folder per home).

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Property Images

Real home photos are grouped per listing:

```
public/images/properties/
  kazhipathur-2bhk-1001649430/
    01.jpg
    02.jpg
    ...
  radiance-mandarin-thoraipakkam-1bhk-1001649826/
    ...
```

Metadata lives in `src/data/propertyImages.json`.

The app ships with **100 homes**, each with **2–12 real photos** scraped from [Sulekha](https://property.sulekha.com) (Chennai, Pune, Bangalore, Hyderabad, and more).

To refresh or expand the image library:

```bash
npm run discover:listings   # find listing URLs (~500+)
npm run scrape:images       # download photos (targets 100+ homes)
npm run build:manifest      # rebuild propertyImages.json
```

## Contact owner paywall (₹49/month)

Viewing owner phone numbers requires a **Razorpay recurring subscription** (₹49/month). No user accounts — access is unlocked in the browser for 30 days after payment.

### Razorpay setup

1. Create a [Razorpay](https://razorpay.com) account (test mode for development).
2. In Dashboard → **Plans**, create a monthly plan: **₹49**, currency **INR**.
3. Copy your **Key ID**, **Key Secret**, and **Plan ID** into `.env.local`:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_PLAN_ID=plan_xxxxxxxx
```

4. Restart `npm run dev`. Click **Contact Owner** on any listing to test checkout.

Use Razorpay test cards in test mode. Cancel recurring charges via Razorpay or your bank.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Framework preset: **Next.js** (default).
4. Add the three Razorpay environment variables above for contact payments.

## Disclaimer

Demo/portfolio project only. Not affiliated with Sulekha or any real estate portal. Do not use scraped images commercially without permission.
