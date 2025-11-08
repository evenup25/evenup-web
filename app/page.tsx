// app/page.tsx

function AppStoreBadge() {
  // Small inline App Store / Play Store badges to avoid extra assets
  return (
    <a
      href="#"
      aria-label="Download on the App Store"
      className="inline-flex items-center gap-3 rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="flex-none">
        <path
          d="M19.6 14.4c-.2.4-.4.8-.6 1.2-.5 1-1.2 2-2.1 2.9-1.3 1.3-3.2 2.9-5.4 2.9-.7 0-1.4-.1-2-.3-1.2-.3-2.3-.8-3.3-1.5C4.5 18.2 2 14.9 2 11c0-3 .9-5.4 2.8-7C6.1 2.1 8.9 1 11.4 1c1.3 0 2.5.2 3.6.6.7.3 1.4.7 2 1.2.5.4 1 1 1.4 1.5-.3.1-1.1.2-1.8.2-.4 0-1.7-.1-2.7-.1-.7 0-1.9.1-2.9.8-1 .8-1.6 2.1-1.6 3.7 0 2.3 1.3 3.8 2.8 4.9 1.2.9 2.4 1.6 3.3 1.6.6 0 1.6-.2 2.6-.8.5-.3 1.1-.7 1.6-1.1-.1-.2-.2-.4-.3-.6z"
          fill="white"
        />
      </svg>
      <div className="text-left">
        <div className="text-xs text-slate-200">Download on the</div>
        <div className="text-sm font-semibold">App Store</div>
      </div>
    </a>
  );
}

function PlayStoreBadge() {
  return (
    <a
      href="#"
      aria-label="Get it on Google Play"
      className="inline-flex items-center gap-3 rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" className="flex-none">
        <path d="M4.5 3.5l12.8 8.5-12.8 8.5V3.5z" fill="white" opacity="0.95" />
      </svg>
      <div className="text-left">
        <div className="text-xs text-slate-200">Get it on</div>
        <div className="text-sm font-semibold">Google Play</div>
      </div>
    </a>
  );
}

export default function Page() {
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#5b21b6] via-[#7c3aed] to-[#9f7aea] opacity-95" />
        {/* decorative wave SVG */}
        <svg
          className="absolute left-0 right-0 top-0 -z-9 pointer-events-none"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: 220 }}
        >
          <path
            fill="#ffffff11"
            d="M0,96L48,96C96,96,192,96,288,112C384,128,480,160,576,181.3C672,203,768,213,864,224C960,235,1056,245,1152,240C1248,235,1344,213,1392,202.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            opacity="0.12"
          />
        </svg>

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Beta</span>
                <span className="text-sm opacity-90">Launch special</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
                EvenUp — Split bills, keep friends, not grudges
              </h1>
              <p className="mt-6 text-lg max-w-xl text-slate-100/90">
                Track shared expenses, settle up quickly and fairly, and get back to what matters.
                Built for groups, trips and roommates — simple, transparent, and delightful.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <AppStoreBadge />
                <PlayStoreBadge />
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-200">Total Spent</div>
                  <div className="text-lg font-semibold text-white">₹53,850</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-200">You Owe</div>
                  <div className="text-lg font-semibold text-white">₹23,300</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-200">Friends Owe</div>
                  <div className="text-lg font-semibold text-white">₹30,550</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="rounded-3xl shadow-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 p-4">
                  {/* screenshot: place your screenshot in public/screens.png */}
                  <div className="w-[330px] h-[720px] relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/6 to-transparent">
                    <img
                      src="/screens.png"
                      alt="EvenUp app screenshots"
                      className="object-cover w-full h-full"
                      draggable={false}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 left-6 text-sm text-white/70">
                  <div className="mb-1">Loved by travelers & roommates</div>
                  <div className="text-xs">Join 20k+ users who use EvenUp every month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Everything you need to split bills
          </h2>
          <p className="text-slate-600 max-w-2xl mb-8">
            From one-time dinners to complicated group trips — EvenUp handles different splits,
            payments, and settle-ups with clarity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Smart Splits"
              desc="Split by equal share, percentage, or custom amounts. Add bilateral or multi-way transactions easily."
            />
            <Card
              title="Groups & Trips"
              desc="Create groups, add members, track activity and get a neat summary for the whole group."
            />
            <Card
              title="Settle With Ease"
              desc="Generate settle-up links, see who owes what, and mark debts as settled. Minimal friction."
            />
            <Card
              title="Clear History"
              desc="Activity feed, filters, and per-person summaries help you audit expenses quickly."
            />
            <Card
              title="Privacy-first"
              desc="No public sharing: just your groups, private notes, and secure data."
            />
            <Card
              title="Cross-platform"
              desc="Available on iOS and Android. Sync between devices and bring everyone into the loop."
            />
          </div>
        </div>
      </section>

      {/* Testimonials / CTA */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold">Make group money simple</h3>
              <p className="mt-4 text-slate-600">
                Install EvenUp and start splitting bills in minutes — no awkwardness, no math.
              </p>

              <div className="mt-6 flex gap-3">
                <AppStoreBadge />
                <PlayStoreBadge />
              </div>
            </div>

            <div>
              <blockquote className="p-6 bg-white rounded-xl shadow">
                <p className="text-lg font-medium">
                  "EvenUp saved our hiking trip — splitting lodges and food was painless."
                </p>
                <footer className="mt-4 text-sm text-slate-500">— Rhea, Goa Trip</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold">
              EU
            </div>
            <div>
              <div className="font-semibold">EvenUp</div>
              <div className="text-sm text-slate-500">Split expenses the friendly way</div>
            </div>
          </div>

          <nav className="flex gap-6 text-sm text-slate-600">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}
