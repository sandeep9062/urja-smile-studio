import React from 'react';

export const WhyUrja: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-stone-50 py-16 sm:py-24">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-emerald-50/50 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-amber-50/50 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Storytelling & Copy (40% width on large screens) */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 border border-emerald-100">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              The Holistic Difference
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl font-serif leading-tight">
              Your Natural Teeth <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-amber-700">
                Are Irreplaceable.
              </span>
            </h2>
            
            <p className="text-base sm:text-lg leading-relaxed text-stone-600 max-w-xl mx-auto lg:mx-0">
              Traditional dentistry often relies on aggressive drilling that removes healthy structure permanently. At <strong className="text-emerald-900 font-medium">Urja Dental</strong>, we believe every millimeter matters. We combine advanced biological dentistry with specialized acupuncture protocols to preserve your natural smile and avoid unnecessary root canals.
            </p>

            {/* Key Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">✓</div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Micro-Preservation</h4>
                  <p className="text-xs text-stone-500">Saving every millimeter of enamel.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">✓</div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Acupuncture Protocols</h4>
                  <p className="text-xs text-stone-500">Natural pain & healing management.</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <a
                href="#appointment"
                className="inline-flex items-center justify-center rounded-xl bg-stone-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
              >
                Experience Holistic Care
              </a>
            </div>
          </div>

          {/* Right Column: Premium Banner Display (70% width on large screens) */}
          <div className="lg:col-span-7">
            <div className="relative group overflow-hidden rounded-2xl bg-stone-100 shadow-xl shadow-stone-200/50 border border-stone-200/60 transition-all duration-300 hover:shadow-2xl hover:shadow-stone-300/40">
              
              {/* Aspect Ratio container optimized for your horizontal image format */}
              <div className="aspect-[21/9] sm:aspect-[16/7] lg:aspect-[16/7.2] w-full relative">
                <img
                  src="/assets/why-urja.png"
                  alt="Urja Dental - Conventional vs Holistic Dentistry Comparison Banner"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Subtle overlay border for premium gloss finish */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-inset ring-black/5" />
            </div>
            
            {/* Contextual image caption for accessibility and design depth */}
            <p className="mt-3 text-center lg:text-right text-xs text-stone-400 italic">
              *Visual representation of irreversible structure loss vs. holistic biological preservation.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyUrja;