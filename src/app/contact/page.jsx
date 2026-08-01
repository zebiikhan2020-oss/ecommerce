export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Abstract Structural Mesh Glow */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
      <div className="absolute bottom-10 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

        {/* Left Side: Professional Information Grid */}
        <div className="bg-white border border-slate-150/80 shadow-xl shadow-slate-900/5 rounded-3xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
          
          <div>
            <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              Get In Touch
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Contact Infrastructure
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 font-medium">
              We value systemic collaboration. Feel free to initiate contact regarding account assistance, merchant updates, or administrative queries at any time.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100/70">
                <div className="text-2xl mt-0.5 bg-white p-2.5 rounded-xl shadow-xs border border-slate-100">📍</div>
                <div>
                  <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Corporate Hub</h2>
                  <p className="text-slate-600 text-sm md:text-base font-medium mt-0.5">
                    Lahore, Punjab, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100/70">
                <div className="text-2xl mt-0.5 bg-white p-2.5 rounded-xl shadow-xs border border-slate-100">📞</div>
                <div>
                  <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Direct Routing</h2>
                  <p className="text-slate-600 text-sm md:text-base font-medium mt-0.5">
                    +92 317 1324941
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100/70">
                <div className="text-2xl mt-0.5 bg-white p-2.5 rounded-xl shadow-xs border border-slate-100">📧</div>
                <div>
                  <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Digital Correspondence</h2>
                  <p className="text-slate-600 text-sm md:text-base font-medium mt-0.5">
                    support@ishop.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
            🔒 Fully Encrypted Secure Gateway Connection
          </div>
        </div>

        {/* Right Side: Secure Asynchronous Form Input Matrix */}
        <div className="bg-white border border-slate-150/80 shadow-xl shadow-slate-900/5 rounded-3xl p-8 md:p-12 relative">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Dispatch Message
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-8">
            Complete all dynamic entry fields down below
          </p>

          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-slate-200 bg-slate-50/30 text-slate-800 placeholder-slate-400 rounded-xl p-3.5 shadow-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden transition-all text-sm font-medium"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-slate-200 bg-slate-50/30 text-slate-800 placeholder-slate-400 rounded-xl p-3.5 shadow-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden transition-all text-sm font-medium"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full border border-slate-200 bg-slate-50/30 text-slate-800 placeholder-slate-400 rounded-xl p-3.5 shadow-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden transition-all text-sm font-medium"
              />
            </div>

            <div>
              <textarea
                rows="6"
                placeholder="Write your message..."
                className="w-full border border-slate-200 bg-slate-50/30 text-slate-800 placeholder-slate-400 rounded-xl p-3.5 shadow-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden transition-all text-sm font-medium resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-900/20 hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg transition-all transform active:scale-[0.98] text-xs uppercase tracking-wider cursor-pointer"
            >
              Send Message Protocol
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}