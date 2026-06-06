/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ImageSlider from "./components/ImageSlider";
import LeadCaptureWizard from "./components/LeadCaptureWizard";
import SubcontractorPortal from "./components/SubcontractorPortal";
import BackOfficePortal from "./components/BackOfficePortal";
import AuthPortal from "./components/AuthPortal";
import GlassFloorPortal from "./components/GlassFloorPortal";
import IronTreadPortal from "./components/IronTreadPortal";
import { CASE_STUDIES, TESTIMONIALS, INDUSTRY_BADGES, WARRANTY_INFOS } from "./data";
import { ProjectCategory, CaseStudy } from "./types";
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  MapPin, 
  CheckCircle, 
  Flame, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  HardHat,
  Hammer,
  HelpCircle,
  ThumbsUp,
  Phone,
  Bookmark,
  Mail
} from "lucide-react";

const COMPARISON_SCENARIOS = [
  {
    title: "Severe Wet Basement Rescue",
    category: "Structural Waterproofing",
    subtitle: "Severe water intrusion during rainy seasons",
    details: "Interior perimeter channels and high-output sump pump setup with polymer reinforced sealants successfully captured and routed water, transforming a muddy cellar into clean space.",
    beforeImg: "/src/assets/images/before_basement_1780652532122.png",
    afterImg: "/src/assets/images/after_basement_1780652546044.png",
    beforeTitle: "FLOODED CELLAR",
    afterTitle: "SEALED & DRY",
    statusLabel: "Waterproofing Guard",
    statusVal: "Dual Active & Fully Dry"
  },
  {
    title: "Foundation Stabilization",
    category: "Foundation Piering / Anchors",
    subtitle: "2.5-inch lateral soil pressure bowing",
    details: "Installed heavy-duty plate anchors with deep soil tiebacks, drawing concrete bowing back to engineering specification. Wall securement backed by a 50-yr transferable warranty.",
    beforeImg: "/src/assets/images/before_foundation_1780652560428.png",
    afterImg: "/src/assets/images/after_foundation_1780652575170.png",
    beforeTitle: "WALL BOWED 2.5\"",
    afterTitle: "ANCHORED SECURE",
    statusLabel: "Wall Tension Rating",
    statusVal: "A+ Stabilized Under Load"
  },
  {
    title: "Luxury Sub-grade Den Remodel",
    category: "Residential Remodels",
    subtitle: "Dark, damp outdated masonry cellars",
    details: "Built insulated cold-rolled light-gauge steel framing, thermal underlayers, and soundproofing, resulting in an exquisite high-end entertainment area.",
    beforeImg: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    afterImg: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800",
    beforeTitle: "MESSY EXCAVATION",
    afterTitle: "LUXURY DEN",
    statusLabel: "Living Comfort Score",
    statusVal: "Premium Finished Suite"
  }
];

export default function App() {
  const [activeView, setActiveView] = useState<string>("home");
  
  // Active connection session profile definitions
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    const saved = localStorage.getItem("watertight_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem("watertight_role");
  });

  // Before/after home slider active index
  const [activeSliderIdx, setActiveSliderIdx] = useState<number>(0);
  
  // States to manage filterable portfolio
  const [portfolioFilter, setPortfolioFilter] = useState<string>("All");
  
  // Testimonial index tracker
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);

  // Filter case studies
  const filteredStudies = portfolioFilter === "All" 
    ? CASE_STUDIES 
    : CASE_STUDIES.filter(cs => cs.category === portfolioFilter);

  // Navigate view handler
  const handleNavigate = (view: string) => {
    const sectionElements: Record<string, string> = {
      company: "trust-anchors-section",
      philosophy: "warranty-guarantees-section",
      services: "offerings-section",
      crew: "testimonials-section",
      process: "interactive-comparisons-section",
      contact: "about-contact-section"
    };

    if (view in sectionElements) {
      if (activeView !== "home") {
        setActiveView("home");
        setTimeout(() => {
          const el = document.getElementById(sectionElements[view]);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      } else {
        const el = document.getElementById(sectionElements[view]);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else {
      setActiveView(view);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLoginSuccess = (user: any, role: string) => {
    setCurrentUser(user);
    setUserRole(role);
    localStorage.setItem("watertight_user", JSON.stringify(user));
    localStorage.setItem("watertight_role", role);
    
    // Redirect instantly based on authentication level
    if (role === "admin") {
      sessionStorage.setItem("admin_authenticated", "true");
      setActiveView("admin");
    } else if (role === "client") {
      setActiveView("client-pm");
    } else if (role === "crew") {
      setActiveView("crew-pm");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem("watertight_user");
    localStorage.removeItem("watertight_role");
    sessionStorage.removeItem("admin_authenticated");
    setActiveView("home");
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-slate-950 antialiased font-sans">
      
      {/* Dynamic Navigation Header */}
      <Header 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        currentUser={currentUser}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* Main Content Sections with Framer Motion Layouts */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* SECTION A: HOMEPAGE (The Conversion Hub) */}
          {activeView === "home" && (
            <motion.div
              key="home-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-20 pb-20"
            >
              {/* Hero Element */}
              <section id="hero-banner-section" className="relative h-[550px] md:h-[650px] overflow-hidden flex items-center">
                {/* Backing image with CSS dark grad overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/src/assets/images/hero_construction_1780652589223.png"
                    alt="Watertight professional service craftsmanship"
                    className="w-full h-full object-cover object-center scale-102"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto w-full px-4 md:px-8 z-10 relative space-y-6">
                  {/* Local SEO badge */}
                  <div className="inline-flex items-center gap-1.5 bg-blue-950/60 border border-blue-600/40 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider text-blue-600 font-bold uppercase backdrop-blur-sm animate-pulse">
                    <MapPin className="w-3.5 h-3.5" />
                    Taylorville & Christian County, IL
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-slate-150 tracking-tight leading-[1.1] max-w-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                     Construction without Compromise.
                  </h1>

                  <p className="text-sm md:text-base text-slate-300 max-w-lg leading-relaxed font-sans">
                    Built like we'd build our own.  No Leaks, No Shortcuts, No Excuses. Backed by over 125 years of combined experience, our team delivers fully certified engineered foundations, structural concrete, custom framing, and expert remodeling services. We specialize in roofingmmFrom the ground up, we handle everything from the foundation to the frame with unmatched precision. </p>

                  <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                    <button
                      id="btn-hero-order"
                      onClick={() => handleNavigate("estimator")}
                      className="group bg-blue-600 hover:bg-blue-500 text-slate-950 text-xs font-mono font-bold tracking-widest uppercase py-4 px-8 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-xl hover:shadow-blue-600/20 cursor-pointer"
                    >
                      <span>GET INSTANT ESTIMATE</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      id="btn-hero-portfolio"
                      onClick={() => handleNavigate("portfolio")}
                      className="border border-slate-700 hover:border-slate-500 bg-slate-950/40 text-slate-300 hover:text-slate-100 text-xs font-mono font-semibold tracking-wider uppercase py-4 px-8 rounded-xl transition duration-150 backdrop-blur-sm cursor-pointer"
                    >
                      VIEW RECENT FINISHES
                    </button>
                  </div>
                </div>
              </section>

              {/* Trust Anchors Badges (Licensing & Bonding) */}
              <section id="trust-anchors-section" className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center shadow-lg divide-y md:divide-y-0 md:divide-x divide-slate-800">
                  {INDUSTRY_BADGES.map((badge, idx) => (
                    <div key={idx} className="space-y-1 text-center md:px-4 pt-4 md:pt-0 first:pt-0">
                      <span className="text-[10px] font-mono tracking-widest text-[#60a5fa] block uppercase font-bold">{badge.title}</span>
                      <span className="text-base font-bold font-mono text-white block">{badge.value}</span>
                      <p className="text-[11px] text-slate-350">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Core Offerings Grid */}
              <section id="offerings-section" className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-10 space-y-3">
                  <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
                    OUR CAPABILITIES
                  </span>
                  <h2 className="text-3xl font-display font-extrabold text-slate-100 tracking-tight">Our Specialties in Christian County</h2>
                  <p className="text-sm text-slate-200 max-w-md mx-auto">
                    From wet soil excavations to structural support additions, our crew does the heavy lifting safely.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-4 hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 shadow-inner">
                    <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-600 rounded-xl w-fit">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-display font-bold text-slate-100 font-semibold">Structural Waterproofing</h3>
                      <p className="text-xs text-slate-205 leading-relaxed font-sans">
                        Applying interior drainage networks, crystalline surface sealants, egress sumps, and sub-slab pressure relievers to keep cellars totally bone-dry.
                      </p>
                    </div>
                    <button onClick={() => { setPortfolioFilter(ProjectCategory.STRUCTURAL_WATERPROOFING); handleNavigate("portfolio"); }} className="text-xs font-mono font-bold text-blue-450 hover:text-blue-300 uppercase flex items-center gap-1 group cursor-pointer">
                      Explore Projects
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-4 hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
                    <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-600 rounded-xl w-fit">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-display font-bold text-slate-100 font-semibold">Concrete Foundations</h3>
                      <p className="text-xs text-slate-205 leading-relaxed font-sans">
                        Heavy-duty retaining excavation, structural foundation repairs, footing layout pouring, floor slab restorations, and hydraulic anchor alignments.
                      </p>
                    </div>
                    <button onClick={() => { setPortfolioFilter(ProjectCategory.CONCRETE_FOUNDATIONS); handleNavigate("portfolio"); }} className="text-xs font-mono font-bold text-blue-450 hover:text-blue-300 uppercase flex items-center gap-1 group cursor-pointer">
                      Explore Projects
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-4 hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
                    <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-600 rounded-xl w-fit">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-display font-bold text-slate-100 font-semibold">Residential Remodels</h3>
                      <p className="text-xs text-slate-205 leading-relaxed font-sans">
                        Full basement remodels, wood framing, insulation, cold roll steel grid trims, sound-absorbing drywall conversions, and family crawlspace restorations.
                      </p>
                    </div>
                    <button onClick={() => { setPortfolioFilter(ProjectCategory.RESIDENTIAL_REMODELS); handleNavigate("portfolio"); }} className="text-xs font-mono font-bold text-blue-450 hover:text-blue-300 uppercase flex items-center gap-1 group cursor-pointer">
                      Explore Projects
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Before-and-After High-Impact Interactive Section */}
              <section id="interactive-comparisons-section" className="bg-slate-900 border-y border-slate-850 py-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-12 xl:col-span-5 space-y-5">
                    <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase bg-blue-950/40 border border-blue-600/20 px-3 py-1.5 rounded-full inline-block">
                      HIGH-IMPACT VISUAL PROOF
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-tight leading-snug">
                      Witness Dramatic Transformations
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Clients rarely hire foundation workers without seeing concrete proof of quality. Click through our interactive selector below to compare actual jobs.
                    </p>

                    {/* Interactive Scenario Buttons */}
                    <div className="flex flex-col gap-2.5 pt-2">
                      {COMPARISON_SCENARIOS.map((scenario, idx) => (
                        <button
                          key={idx}
                          id={`btn-slider-scenario-${idx}`}
                          onClick={() => setActiveSliderIdx(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex justify-between items-center group cursor-pointer ${
                            activeSliderIdx === idx
                              ? "bg-blue-950/20 border-blue-600/50 text-slate-100 ring-1 ring-blue-600/25"
                              : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold tracking-wider text-blue-600 uppercase block">
                              {scenario.category}
                            </span>
                            <span className="text-xs font-bold leading-tight block">
                              {scenario.title}
                            </span>
                          </div>
                          <ArrowRight className={`w-4 h-4 text-slate-600 transition-all ${
                            activeSliderIdx === idx ? "text-blue-600 translate-x-0.5" : "group-hover:text-slate-400 group-hover:translate-x-0.5"
                          }`} />
                        </button>
                      ))}
                    </div>

                    {/* Spotlight Text details */}
                    <div className="border-t border-slate-800 pt-4 space-y-4 font-sans text-xs">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-slate-550 block uppercase font-bold">Challenge Story</span>
                        <h4 className="font-bold text-slate-200 mt-1">{COMPARISON_SCENARIOS[activeSliderIdx].subtitle}</h4>
                        <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                          {COMPARISON_SCENARIOS[activeSliderIdx].details}
                        </p>
                      </div>

                      <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-850 flex items-center justify-between text-xs font-semibold leading-none">
                        <span className="text-slate-400">{COMPARISON_SCENARIOS[activeSliderIdx].statusLabel}:</span>
                        <span className="text-blue-600 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> {COMPARISON_SCENARIOS[activeSliderIdx].statusVal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Component Inserted: Before/After Slider */}
                  <div className="lg:col-span-12 xl:col-span-7">
                    <ImageSlider
                      beforeImg={COMPARISON_SCENARIOS[activeSliderIdx].beforeImg}
                      afterImg={COMPARISON_SCENARIOS[activeSliderIdx].afterImg}
                      beforeTitle={COMPARISON_SCENARIOS[activeSliderIdx].beforeTitle}
                      afterTitle={COMPARISON_SCENARIOS[activeSliderIdx].afterTitle}
                    />
                  </div>
                </div>
              </section>

              {/* Warranties protections highlight */}
              <section id="warranty-guarantees-section" className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-10 space-y-3">
                  <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
                    WARRANTY BACKING
                  </span>
                  <h2 className="text-3xl font-display font-extrabold text-slate-100 tracking-tight">Our Multi-Layered Protection Guarantees</h2>
                  <p className="text-sm text-slate-400 max-w-lg mx-auto">
                    We eliminate financial risks. All materials and structural methods are protected by industry-leading terms.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {WARRANTY_INFOS.map((war, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4 shadow-md relative overflow-hidden">
                      <div className="absolute top-4 right-4 bg-blue-950/40 border border-blue-600/25 px-2.5 py-1 rounded text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider">
                        {war.term}
                      </div>

                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-blue-600 w-fit">
                        {idx === 0 && <ShieldCheck className="w-5 h-5 text-blue-600" />}
                        {idx === 1 && <Award className="w-5 h-5 text-blue-600" />}
                        {idx === 2 && <Hammer className="w-5 h-5 text-blue-600" />}
                        {idx === 3 && <TrendingUp className="w-5 h-5 text-blue-600" />}
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-sans font-bold text-slate-200 text-[15px]">{war.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{war.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Verified glowing reviews carousel */}
              <section id="testimonials-section" className="bg-slate-950/80 border-t border-slate-900 py-16 px-4 md:px-8 relative">
                <div className="max-w-5xl mx-auto space-y-10">
                  <div className="text-center space-y-3">
                    <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
                      VERIFIED REVIEWS
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-100 tracking-tight">
                      Hear From Local Homeowners in Christian County
                    </h2>
                  </div>

                  {/* Active review showcase */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center relative shadow-xl">
                    <div className="md:col-span-2 space-y-5">
                      {/* Rating stars */}
                      <div className="flex gap-1">
                        {[...Array(TESTIMONIALS[activeTestimonialIdx].rating)].map((_, i) => (
                          <span key={i} className="text-blue-500 text-lg">★</span>
                        ))}
                      </div>

                      <p className="text-sm md:text-base text-slate-350 italic font-sans leading-relaxed">
                        &ldquo;{TESTIMONIALS[activeTestimonialIdx].content}&rdquo;
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                        <h4 className="font-sans font-bold text-slate-200 text-sm">
                          {TESTIMONIALS[activeTestimonialIdx].clientName}
                        </h4>
                        <div className="flex gap-2 items-center text-[11px] font-mono text-slate-500">
                          <span>{TESTIMONIALS[activeTestimonialIdx].location}</span>
                          <span>•</span>
                          <span className="text-blue-600">{TESTIMONIALS[activeTestimonialIdx].projectType}</span>
                          <span>•</span>
                          <span>{TESTIMONIALS[activeTestimonialIdx].date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Associated photograph proof */}
                    <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-850 h-52 md:h-64 relative group">
                      {TESTIMONIALS[activeTestimonialIdx].projectImage ? (
                        <img
                          src={TESTIMONIALS[activeTestimonialIdx].projectImage}
                          alt="Verified completed construction work"
                          className="w-full h-full object-cover transition duration-300 scale-101 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-600 font-mono">
                          Completed project visual active
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-[9px] font-mono text-blue-600 font-bold uppercase tracking-wider border border-slate-800">
                        Verified Finished Work
                      </div>
                    </div>
                  </div>

                  {/* Bullet navigators */}
                  <div className="flex justify-center gap-2">
                    {TESTIMONIALS.map((review, idx) => (
                      <button
                        key={review.id}
                        onClick={() => setActiveTestimonialIdx(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activeTestimonialIdx === idx ? "bg-blue-600 w-6" : "bg-slate-700 hover:bg-slate-550"
                        }`}
                      />
                    ))}
                  </div>

                  {/* CTA Banner to quote */}
                  <div className="bg-gradient-to-r from-blue-950/40 via-blue-950/20 to-transparent border border-blue-600/20 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
                    <div className="space-y-1.5">
                      <h4 className="font-sans font-bold text-slate-200 text-[17px]">Ready to discover your estimated cost range?</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md">
                        Use our stepped guided intake tool to snap pictures and get budget projections in less than 2 minutes.
                      </p>
                    </div>

                    <button
                      onClick={() => handleNavigate("estimator")}
                      className="group shrink-0 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition duration-150 cursor-pointer"
                    >
                      <span>Launch Estimator</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Dedicated High-Contrast Local Contact & SEO Section */}
              <section id="about-contact-section" className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-slate-900">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left Column: Local office & SEO details */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-3">
                      <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-950/60 border border-blue-500/30 px-3.5 py-1.5 rounded-full inline-block">
                        CONNECT WITH AN EXPERT
                      </span>
                      <h2 className="text-3xl font-display font-extrabold text-slate-100 tracking-tight">
                        Our Taylorville HQ
                      </h2>
                      <p className="text-sm text-slate-200 leading-relaxed font-sans">
                        Need a structural review, direct bid proposal, or emergency moisture mitigation? Reach out to our central scheduling desk directly. We render professional grade site visits within 48 hours in Christian County.
                      </p>
                    </div>

                    <div className="space-y-4 pt-1 text-xs">
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3.5 shadow-sm">
                        <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-blue-400 uppercase block font-mono text-[10.5px] tracking-wider">Headquarters Address</span>
                          <span className="text-slate-100 mt-1 block font-semibold">402 S Main St, Taylorville, IL 62568</span>
                          <span className="text-slate-300 mt-0.5 text-[11px] block">Christian County, Illinois</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3.5 shadow-sm">
                        <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-blue-400 uppercase block font-mono text-[10.5px] tracking-wider">Direct Telephone Desk</span>
                          <a href="tel:2175550199" className="text-slate-100 mt-1 block text-sm font-bold hover:text-blue-300 transition">(217) 555-0199</a>
                          <span className="text-slate-300 mt-0.5 text-[11px] block font-mono">Monday - Friday, 6:00 AM - 6:00 PM</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3.5 shadow-sm">
                        <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-blue-400 uppercase block font-mono text-[10.5px] tracking-wider">Electronic Scheduling Bids</span>
                          <a href="mailto:dispatch@watertight.com" className="text-slate-100 mt-1 block font-mono font-semibold hover:text-blue-300 transition">dispatch@watertight.com</a>
                          <span className="text-slate-300 mt-0.5 text-[11px] block">Submit blueprint dwg vectors or PDF reports files</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic micro Callback Request with high contrast feedback */}
                  <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-5">
                    <div>
                      <h3 className="text-lg font-display font-bold text-slate-100">Schedule a Callback or Site Inspection</h3>
                      <p className="text-xs text-slate-200 mt-1">Our dispatch team will coordinate a qualified engineering representative for your project.</p>
                    </div>

                    <div id="callback-mini-form" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="space-y-1.5">
                          <label className="font-bold uppercase text-[10px] text-slate-200 block tracking-wider">Your Full Name</label>
                          <input 
                            type="text" 
                            id="cb-name"
                            placeholder="e.g. Richard Evans" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-400 font-medium" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold uppercase text-[10px] text-slate-200 block tracking-wider">Contact Phone</label>
                          <input 
                            type="tel" 
                            id="cb-phone"
                            placeholder="e.g. (217) 555-1234" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono font-medium" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="font-bold uppercase text-[10px] text-slate-200 block tracking-wider">Service Needed</label>
                        <select 
                          id="cb-service"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-blue-400 appearance-none cursor-pointer font-medium"
                        >
                          <option value="waterproofing">Waterproofing & Drainage Systems</option>
                          <option value="foundation">Concrete Foundations & Slabbing</option>
                          <option value="remodel">Basement Remodels & Framing</option>
                          <option value="other">General Consultation Site Audit</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="font-bold uppercase text-[10px] text-slate-200 block tracking-wider">Brief Notes / Message</label>
                        <textarea 
                          id="cb-notes"
                          rows={3} 
                          placeholder="Tell us about your leakage, dampness, structural bowing or construction requirements..." 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-400 font-medium"
                        />
                      </div>

                      <button 
                        type="button"
                        onClick={() => {
                          const nameEl = document.getElementById("cb-name") as HTMLInputElement;
                          const phoneEl = document.getElementById("cb-phone") as HTMLInputElement;
                          if (nameEl?.value && phoneEl?.value) {
                            alert(`✓ Thank you ${nameEl.value}! Callback request submitted. Renee or our local manager will contact you shortly.`);
                            nameEl.value = "";
                            phoneEl.value = "";
                            const notesEl = document.getElementById("cb-notes") as HTMLTextAreaElement;
                            if (notesEl) notesEl.value = "";
                          } else {
                            alert("Please provide your Name and Phone number.");
                          }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:shadow-blue-600/10 active:scale-[0.99]"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Request Priority Callback
                      </button>

                      <div className="flex gap-2 items-center justify-center text-[10px] text-slate-400 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Protected by our Lifetime Structural Guarantee conditions</span>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            </motion.div>
          )}

          {/* SECTION B: PORTFOLIO & CASE STUDIES (Filterable Grid) */}
          {activeView === "portfolio" && (
            <motion.div
              key="portfolio-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-12"
            >
              {/* Heading */}
              <div className="text-center py-4 space-y-3">
                <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
                  OUR CAPABILITIES ON DISPLAY
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-tight leading-none">
                  Signature Project Galleries
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Filter by category below to examine the engineering narrative, challenges, and before/after comparisons of past jobs.
                </p>
              </div>

              {/* Categorized Project Selector Filters */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono border-b border-slate-900 pb-4">
                {["All", ...Object.values(ProjectCategory)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPortfolioFilter(cat)}
                    className={`px-4 py-2 rounded-lg transition border cursor-pointer ${
                      portfolioFilter === cat
                        ? "bg-blue-950/40 border-blue-500 text-blue-600 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Portfolio Grid list */}
              <div className="grid grid-cols-1 gap-14">
                {filteredStudies.map((study) => (
                  <div key={study.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-slate-900/10 border border-slate-900 rounded-2xl p-6 md:p-8 hover:border-slate-800 transition">
                    
                    {/* Narratives left */}
                    <div className="lg:col-span-5 space-y-5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono tracking-wider px-2 py-0.5 rounded font-bold uppercase">
                          {study.category}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{study.location} • {study.year}</span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-display font-bold text-slate-150 leading-tight tracking-tight">
                        {study.title}
                      </h3>

                      {/* Technical specifications logs */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {study.tags.map((tg, i) => (
                          <span key={i} className="text-[10px] font-mono text-blue-600 bg-blue-950/20 px-2 py-0.5 rounded border border-blue-950/25">
                            {tg}
                          </span>
                        ))}
                      </div>

                      {/* Engineering Anatomy Narratives */}
                      <div className="space-y-4 pt-2 divide-y divide-slate-900 text-xs">
                        {/* The Challenge */}
                        <div className="space-y-1 leading-relaxed">
                          <span className="font-bold text-red-400 uppercase font-mono tracking-wider text-[10px] block">THE CHALLENGE:</span>
                          <p className="text-slate-400">{study.challenge}</p>
                        </div>

                        {/* The Strategy */}
                        <div className="space-y-1 pt-3.5 leading-relaxed">
                          <span className="font-bold text-blue-600 uppercase font-mono tracking-wider text-[10px] block font-semibold">THE SOLUTION DETAILS:</span>
                          <p className="text-slate-400">{study.solution}</p>
                        </div>

                        {/* The Result */}
                        <div className="space-y-1 pt-3.5 leading-relaxed">
                          <span className="font-semibold text-blue-600 uppercase font-mono tracking-widest text-[10px] block">THE RESULT:</span>
                          <p className="text-slate-300 font-medium font-sans italic">&ldquo;{study.result}&rdquo;</p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Slider comparison right */}
                    <div className="lg:col-span-7">
                      <ImageSlider
                        beforeImg={study.beforeImage}
                        afterImg={study.afterImage}
                        beforeTitle={study.beforeTitle}
                        afterTitle={study.afterTitle}
                      />
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SECTION C: INSTANT COST ESTIMATOR (Low-Friction wizard) */}
          {activeView === "estimator" && (
            <motion.div
              key="estimator-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-12"
            >
              <div className="text-center py-4 space-y-3 max-w-xl mx-auto">
                <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
                  PRICE CALCULATION ENGINES
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-tight leading-none">
                  Instant Quote Estimator
                </h2>
                <p className="text-xs text-slate-400 leading-normal">
                  Our guided wizard evaluates project dimensions, site access clearance, and material scraping needs to construct an intelligent low-to-high budget range.
                </p>
              </div>

              {/* Mounted Lead wizard */}
              <LeadCaptureWizard onSuccess={() => {}} />
            </motion.div>
          )}

          {/* SECTION D: CAREERS & SUBCONTRACTING (Onboarding port) */}
          {activeView === "careers" && (
            <motion.div
              key="careers-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-16"
            >
              {/* Mounted subcontractor onboarding component */}
              <SubcontractorPortal />
            </motion.div>
          )}

          {/* SECTION E: BACK OFFICE DATABASE & ADMIN PORT (CRM panel) */}
          {activeView === "admin" && (
            <motion.div
              key="admin-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-16"
            >
              {/* Mounted admin console component */}
              <BackOfficePortal />
            </motion.div>
          )}

          {/* SECTION F: AUTH JUNCTION (Login & Registration) */}
          {activeView === "login" && (
            <motion.div
              key="auth-section"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-12"
            >
              <AuthPortal onLoginSuccess={handleLoginSuccess} onNavigateToHome={() => handleNavigate("home")} />
            </motion.div>
          )}

          {/* SECTION G: GLASSFLOOR CLIENT PM TIMELINE */}
          {activeView === "client-pm" && (
            <motion.div
              key="client-pm-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-12"
            >
              <GlassFloorPortal user={currentUser} onLogout={handleLogout} />
            </motion.div>
          )}

          {/* SECTION H: IRONTREAD CREW DISPATCH MODULE */}
          {activeView === "crew-pm" && (
            <motion.div
              key="crew-pm-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-12"
            >
              <IronTreadPortal user={currentUser} onLogout={handleLogout} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Trust & Authority Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
