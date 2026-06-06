/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Award, MapPin, Mail, Phone, ExternalLink, Landmark, Lock } from "lucide-react";
import { INDUSTRY_BADGES } from "../data";

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer(props: FooterProps) {
  const { onNavigate } = props;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 font-sans">
      {/* 1. Authority Trust Ribbon (Insurance & Licensing) */}
      <div className="border-b border-slate-900/80 bg-slate-900/40 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
          {INDUSTRY_BADGES.map((badge, idx) => (
            <div key={idx} className="space-y-1 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono tracking-widest text-blue-400 block uppercase font-bold">{badge.title}</span>
              <span className="text-sm font-semibold font-mono text-slate-100 block">{badge.value}</span>
              <p className="text-[11px] text-slate-300 leading-tight font-medium">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        {/* Brand identity column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-600 shadow-md">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-display font-extrabold tracking-tight text-slate-100 uppercase leading-none block">
                WATERTIGHT CONSTRUCTION
              </span>
              <span className="text-[10px] font-mono text-blue-400 tracking-wider block mt-1 font-bold">
                TAYLORVILLE, IL • EST. 1983
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Professional sub-grade engineering, structural masonry wall stabilizers, and multi-layer crystalline moisture treatments. Providing bone-dry concrete structures across Christian County, Illinois.
          </p>
          <div className="text-xs space-y-2 text-slate-200 pt-2 block font-mono">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>402 S Main St, Taylorville, IL 62568</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Office: (217) 555-0199</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Bids & Scheduling: dispatch@watertight.com</span>
            </div>
          </div>
        </div>

        {/* Guarantees & Protections */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
            ESTIMATOR PROTECTION GUARANTEE
          </h4>
          <div className="space-y-3.5">
            <div className="flex gap-3 text-xs leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-100 block uppercase font-mono text-[10px] tracking-wide">Lifetime Transferable Structural Waterproofing Guarantee</span>
                <span className="text-slate-300 block text-[11.5px] mt-0.5 font-medium">Coverage remains binding on the site, fully protecting subsequent buyers of the home.</span>
              </div>
            </div>
            <div className="flex gap-3 text-xs leading-relaxed">
              <Award className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-100 block uppercase font-mono text-[10px] tracking-wide">50-Year Lateral Wall Anchor Protection</span>
                <span className="text-slate-300 block text-[11.5px] mt-0.5 font-sans font-medium">Compacted soil stabilizers and custom-pier anchors are structured to hold building loads permanently.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subcontractor links & Dispatch desk portals links */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
            CREW CENTRAL & BACK OFFICE
          </h4>
          <ul className="space-y-2.5 text-xs font-sans font-medium">
            <li>
              <button
                onClick={() => onNavigate("login")}
                className="hover:text-blue-500 text-blue-600 font-bold flex items-center gap-1 cursor-pointer font-bold uppercase transition"
              >
                <span>🔐 Portal Sign-In / Register</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("careers")}
                className="hover:text-blue-500 text-slate-400 flex items-center gap-1 cursor-pointer animate-pulse"
              >
                <span>🚀 Apply To Joint Crew</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("admin")}
                className="hover:text-blue-500 text-slate-400 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Command Desk CRM login</span>
              </button>
            </li>
            <li>
              <a 
                href="https://buildertrend.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-blue-500 text-slate-500 flex items-center gap-1 transition"
              >
                <span>Buildertrend Daily Log Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-700" />
              </a>
            </li>
            <li>
              <a 
                href="https://www.coconstruct.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-blue-500 text-slate-500 flex items-center gap-1 transition"
              >
                <span>CoConstruct Selections Board</span>
                <ExternalLink className="w-3 h-3 text-slate-700" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom copyright and geolocation declarations for local SEO */}
      <div className="border-t border-slate-900 py-6 px-4 md:px-8 text-center text-[10px] font-mono text-slate-600 space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <span>&copy; {new Date().getFullYear()} Watertight Construction Co. All rights reserved. IL license #055-198302.</span>
          <div className="flex gap-4 items-center justify-center">
            <span>Taylorville, IL Geolocation Coordinates: 39.5492° N, 89.2940° W</span>
            <span className="text-slate-600">|</span>
            <span>Christian County Area Services Grid Local Marker</span>
          </div>
        </div>
        
        {/* Micro Schema Markup declaration directly inside the markup representing LocalBusiness */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "LocalBusiness",
            "name": "Watertight Construction Co.",
            "url": "https://ais-pre-4ckggc4ujnfiw2bqpc67zf-21006090454.us-west2.run.app",
            "telephone": "217-555-0199",
            "email": "dispatch@watertight.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "402 S Main St",
              "addressLocality": "Taylorville",
              "addressRegion": "IL",
              "postalCode": "62568",
              "addressCountry": "US"
            },
            "areaServed": {
              "@type": "City",
              "name": "Taylorville",
              "sameAs": "https://en.wikipedia.org/wiki/Taylorville,_Illinois"
            }
          })
        }} />
      </div>
    </footer>
  );
}
