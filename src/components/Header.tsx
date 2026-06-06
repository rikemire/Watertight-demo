/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Menu, X, Landmark, ShieldCheck, Mail, Phone, Lock, LogOut, ChevronDown } from "lucide-react";

const brandLogo = "/src/assets/images/watertight_roofing_logo_1780786098336.png";

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentUser?: any;
  userRole?: string | null;
  onLogout?: () => void;
}

export default function Header(props: HeaderProps) {
  const { activeView, onNavigate, currentUser, userRole, onLogout } = props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState<boolean>(false);

  // Dynamic Context-Aware Nav items - Simplified & Redefined
  const navItems = [
    { id: "portfolio", label: "Job Portfolio" },
    { id: "estimator", label: "Project Calculator" },
    
    // Portal additions based on actual login
    ...(currentUser && userRole === "client" ? [{ id: "client-pm", label: "Job Site Portal" }] : []),
    ...(currentUser && userRole === "crew" ? [{ id: "crew-pm", label: "Job Site Portal" }] : []),
    ...(currentUser && userRole === "admin" ? [{ id: "admin", label: "Command Desk" }] : []),
    
    // Guest entries
    ...(!currentUser ? [
      { id: "login", label: "Job Site Portal" }
    ] : [])
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top micro contact ribbon */}
      <div className="bg-slate-900 text-slate-100 py-1.5 px-4 md:px-8 text-[11px] font-mono tracking-wide flex flex-col md:flex-row justify-between items-center gap-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block animate-pulse" />
          <span>Christian County's Premier Roofing & Drainage Construction Specialists</span>
        </div>
        <div className="flex gap-4 items-center">
          <a href="tel:2175550199" className="hover:text-blue-400 flex items-center gap-1 transition">
            <Phone className="w-3.5 h-3.5 text-blue-500" />
            (217) 555-0199
          </a>
          <span className="text-slate-700">|</span>
          <a href="mailto:dispatch@watertight.com" className="hover:text-blue-400 flex items-center gap-1 transition">
            <Mail className="w-3.5 h-3.5 text-blue-500" />
            dispatch@watertight.com
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Brand logo */}
        <button
          onClick={() => onNavigate("home")}
          id="btn-nav-logo"
          className="flex items-center text-left group cursor-pointer focus:outline-none"
        >
          <img
            src={brandLogo}
            alt="Watertight Construction"
            className="h-20 md:h-24 w-auto object-contain mix-blend-multiply transition-all duration-200 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2 text-sm">
          {/* About Dropdown */}
          <div className="relative group">
            <button
              id="btn-nav-desk-about"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 font-sans cursor-pointer text-slate-700 hover:text-slate-950 hover:bg-slate-100/75 font-semibold"
            >
              About
              <ChevronDown className="w-3.5 h-3.5 mt-0.5 text-slate-500 group-hover:text-slate-950 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            
            {/* Expanding absolute position submenu on hover */}
            <div className="absolute left-0 mt-1 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100">
              <button
                onClick={() => onNavigate("company")}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Our company
              </button>
              <button
                onClick={() => onNavigate("philosophy")}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Our Philosophy
              </button>
              <button
                onClick={() => onNavigate("services")}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition cursor-pointer"
              >
                What We Do
              </button>
              <button
                onClick={() => onNavigate("crew")}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Meet the Crew
              </button>
            </div>
          </div>

          {navItems.map((item) => {
            const isSelected = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-desk-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 font-sans cursor-pointer ${
                  isSelected 
                    ? "bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-xs" 
                    : item.id === "admin"
                    ? "text-slate-700 hover:text-slate-950 border border-slate-200 hover:bg-slate-50 font-semibold"
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-100/70 font-semibold"
                }`}
              >
                {item.id === "admin" && (
                  <Lock className="w-3.5 h-3.5 inline-block mr-1 text-blue-600" />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Log out / Estimate Trigger Area */}
        <div className="hidden lg:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs leading-none">
              <span className="text-slate-600 font-mono">Hi, {currentUser.name.split(" ")[0]}</span>
              <button
                onClick={onLogout}
                id="btn-desk-header-logout"
                className="p-1 hover:text-red-600 text-slate-550 transition cursor-pointer"
                title="Log out connection"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate("estimator")}
              id="btn-action-quote"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold tracking-wider uppercase py-2.5 px-5 rounded hover:shadow-blue-600/15 transition duration-200 cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Project Calculator
            </button>
          )}
        </div>

        {/* Mobile menu trigger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          id="btn-nav-mobile-hamburger"
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav panel popup */}
      {mobileMenuOpen && (
        <div id="mobile-nav-panel" className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 text-sm font-sans text-slate-800">
          
          {/* Mobile Accordion for About */}
          <div className="space-y-1">
            <button
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition font-semibold"
            >
              <span>About</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {mobileAboutOpen && (
              <div className="pl-6 border-l border-slate-150 space-y-1 my-1">
                <button
                  onClick={() => {
                    onNavigate("company");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition"
                >
                  Our company
                </button>
                <button
                  onClick={() => {
                    onNavigate("philosophy");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition"
                >
                  Our Philosophy
                </button>
                <button
                  onClick={() => {
                    onNavigate("services");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition"
                >
                  What We Do
                </button>
                <button
                  onClick={() => {
                    onNavigate("crew");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition"
                >
                  Meet the Crew
                </button>
              </div>
            )}
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              id={`btn-nav-mob-${item.id}`}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition ${
                activeView === item.id 
                  ? "bg-slate-100 border border-slate-200 text-blue-600 font-bold" 
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              {item.id === "admin" && <span className="mr-2">🔒</span>}
              {item.id === "client-pm" && <span className="mr-2">🏡</span>}
              {item.id === "crew-pm" && <span className="mr-2">🛠️</span>}
              {item.label}
            </button>
          ))}
          
          {currentUser ? (
            <button
              onClick={() => {
                if (onLogout) onLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded text-center block mt-4 font-mono text-xs uppercase hover:bg-red-100 transition"
            >
              Sign Out Connection
            </button>
          ) : (
            <button
              onClick={() => {
                onNavigate("estimator");
                setMobileMenuOpen(false);
              }}
              id="btn-mob-estimator"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold uppercase tracking-wider py-3 rounded text-center shadow-lg block mt-4 transition"
            >
              Project Calculator
            </button>
          )}
        </div>
      )}
    </header>
  );
}
