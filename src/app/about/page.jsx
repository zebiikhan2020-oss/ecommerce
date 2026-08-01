export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
      <div className="absolute bottom-20 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[90px]" />

      <div className="max-w-6xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-3xl text-white p-8 md:p-16 shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <span className="inline-block bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            Our Legacy
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Redefining Commerce At iShop
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-slate-300 max-w-3xl font-medium">
            Welcome to <strong className="text-white font-semibold">iShop</strong>—a next-generation decentralized ecosystem engineered to deliver a seamless, transparent, and ultra-secure transaction layer. We unite global buyers and independent merchants under a unified architecture built for modern convenience.
          </p>
        </div>

        {/* Who We Are & Mission Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold mb-6">
              🌐
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
              Who We Are
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
              iShop represents the convergence of high-performance e-commerce technology and minimalist design. We are built for forward-thinking consumers seeking a streamlined, reliable environment to buy or scale merchant operations globally.
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              By consolidating real-time secure databases, advanced item filtration mechanics, global logistics status sync, and specialized user nodes into a singular interface, we ensure structural ease at every turn.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold mb-6">
              🎯
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
              Our Core Mission
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Our primary imperative is to strip away the historical friction points of conventional online market grids. We endeavor to facilitate a trusted marketplace interface where institutional safety parameters coexist alongside frictionless product discovery channels. At iShop, enterprise growth parameters run alongside consumer peace of mind.
            </p>
          </div>
        </div>

        {/* Platform Features Capability Matrix */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              A Single Architecture. Built For Everyone.
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Explore specialized modules engineered for every platform role.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Buyer Feature Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs hover:shadow-xl transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                🛒
              </div>
              <h3 className="text-xl font-bold mt-6 mb-4 text-blue-600">
                Consumer Protocol
              </h3>
              <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Explore premium catalog variants.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Granular parameters search queries.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Curate encrypted wishlist data.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Dynamic live cart processing tracking.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">PCI-compliant transactional checkout.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Real-time parcel delivery statuses.</span></li>
              </ul>
            </div>

            {/* Seller Feature Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs hover:shadow-xl transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                🏪
              </div>
              <h3 className="text-xl font-bold mt-6 mb-4 text-emerald-600">
                Merchant Operations
              </h3>
              <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Scalable item listing creation matrix.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Automated asset inventory monitoring.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Asynchronous product information edits.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Instant client request push logs.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Comprehensive sales analytical metrics dashboards.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Unified merchant order control panels.</span></li>
              </ul>
            </div>

            {/* Admin Feature Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs hover:shadow-xl transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                👨‍💼
              </div>
              <h3 className="text-xl font-bold mt-6 mb-4 text-rose-600">
                System Administrator
              </h3>
              <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Total global profile privilege control.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Comprehensive product catalog auditing.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Real-time security telemetry reviews.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">System taxonomies & category management.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Dispute mitigation & order mediation dashboards.</span></li>
                <li className="flex items-start gap-2">✓ <span className="text-slate-700">Infrastructure security health metrics.</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose iShop Grid Section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-black text-center text-slate-900 tracking-tight mb-12">
            Why Capital Operations Prefer iShop
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                🔒 Secure Shield Protection
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Transact with programmatic certainty enforced through state-of-the-art framework security layouts.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                🚚 Optimized Fulfilment
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Accelerated transactional request routing translates to faster logistical delivery dispatches.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                ⭐ Premium Vetted Inventories
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Shop curated portfolios from merchant profiles evaluated rigorously for product consistency.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                ❤️ Centric Retention Focus
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our user experience interface cycles prioritize flawless operation sequences for clients globally.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                📦 Precise Event Tracing
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Never lose insight with step-by-step telemetry logs update modules from purchase confirmation to reception.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                💬 24/7 Operations Support
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Dedicated internal helpdesk representatives are accessible around the clock for technical routing assistance.
              </p>
            </div>
          </div>
        </div>

        {/* How It Operational Steps */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-black text-center text-slate-900 tracking-tight mb-12">
            The Operational Flow
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            <div className="text-center space-y-3 group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center text-lg font-black group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-base">Identity Creation</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Initialize a consumer or verified vendor workspace credential record seamlessly in seconds.
              </p>
            </div>

            <div className="text-center space-y-3 group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center text-lg font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-base">Catalog Evaluation</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Traverse category nodes, query items, inspect specifications data, and map selections.
              </p>
            </div>

            <div className="text-center space-y-3 group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-lg font-black group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-base">Commit Checkout</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Trigger transactional processing sequences safely and log instance receipt tracking data.
              </p>
            </div>

            <div className="text-center space-y-3 group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center text-lg font-black group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                4
              </div>
              <h3 className="font-bold text-slate-800 text-base">Fulfillment Sync</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Monitor status update signals sequentially until packages are handed off at your destination.
              </p>
            </div>
          </div>
        </div>

        {/* Our Vision Block */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
            Our Vision Parameters
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            We hold that digital trading models should remain accessible, protective, and frictionless for every globally distributed entity. Our foundational perspective aims to construct a highly optimized web layer where consumers freely trace premium products while micro-merchants leverage institutional scale opportunities with unmatched confidence.
          </p>
        </div>

        {/* Closing Professional CTA Panel */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl text-white p-8 md:p-12 text-center shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 blur-2xl" />
          
          <h2 className="relative z-10 text-3xl md:text-4xl font-black tracking-tight mb-4">
            Join the iShop Architecture Ecosystem
          </h2>
          <p className="relative z-10 text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Whether deploying high-volume storefront digital nodes or exploring smart modern consumer assets, iShop provides an integrated utility space built to deliver. Experience the shift today.
          </p>

          <div className="relative z-10 flex flex-wrap justify-center gap-3 text-xs font-bold uppercase tracking-wider">
            <div className="bg-white/10 border border-white/10 text-white backdrop-blur-md px-5 py-3 rounded-xl shadow-xs">
              🛍️ Efficient Intelligence
            </div>
            <div className="bg-white/10 border border-white/10 text-white backdrop-blur-md px-5 py-3 rounded-xl shadow-xs">
              🏪 Scaled Commerce
            </div>
            <div className="bg-white/10 border border-white/10 text-white backdrop-blur-md px-5 py-3 rounded-xl shadow-xs">
              ⭐ Verified Ecosystem
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}