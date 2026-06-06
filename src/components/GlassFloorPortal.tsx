/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Compass, 
  Download, 
  FileCheck, 
  FileText, 
  HardHat, 
  HelpCircle, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  User,
  Eye,
  X
} from "lucide-react";

interface GlassFloorPortalProps {
  user: {
    name: string;
    email: string;
    assignedJob: string;
  };
  onLogout: () => void;
}

const PROJECT_DOCUMENTS = [
  {
    id: "doc-contract",
    title: "Master Construction Agreement (C-982)",
    filename: "Watertight_Construction_Contract_C-982.pdf",
    size: "1.4 MB",
    type: "Contract Support Doc",
    issuedDate: "May 18, 2026",
    status: "Digitally Certified",
    hash: "SHA-256: 8fbc4912fa839ee89ad45cc09bb9a",
    content: `WATERTIGHT CONSTRUCTION CO. - GENERAL STRUCTURAL AGREEMENT

STAMP STATE ID: IL-198302
CONTRACT IDENTIFIER: C-982-2026
ISSUED REGISTER DATE: May 18, 2026

BETWEEN:
Watertight Construction Co. ("Contractor"), Christian County Operations Base, Taylorville, IL
AND:
The Authentic Client Portal Account Owner ("Property Owner")

1. OPERATIONAL SCOPE
Contractor agrees to perform the sub-grade structural foundation reinforcement, weeping French drainage tile configuration, and hydrostatic protection crystalline mist coating.

2. MATERIALS USED
Premium weeping drainage channel mesh, active silica crystallization chemical spray, and heavy duty cast iron ejector.

3. LIFETIME TRANSFERABLE GUARANTEE
This agreement ensures complete bone-dry drywall performance. Guaranteed to be transferable to subsequent owners, protecting real estate valuation.

APPROVED BY: RENEE IKEMIRE (MANAGER)`
  },
  {
    id: "doc-blueprint",
    title: "Site Blueprint & Drainage Map (B-450)",
    filename: "Approved_Site_Blueprint_B-450.pdf",
    size: "3.8 MB",
    type: "Engineering Drawing",
    issuedDate: "May 19, 2026",
    status: "Official Stamp Approved",
    hash: "SHA-256: a71f28bc89d2d0f5ee81aa399d10e52",
    content: `WATERTIGHT CONSTRUCTION CO. - STRUCTURAL BLUEPRINT SPECIFICATION SHEET

LAYOUT DRAWING NO: B-450-REV-2
DEVELOPED DATE: May 19, 2026

TECHNICAL SPECIFICATIONS:
- Structural concrete footing grade: 4500 PSI, reinforced with continuous steel rebar.
- Perimeter footing perimeter weeping tile canal: 3-inch slotted dual-wall HDPE.
- Gravity discharge sump configuration: Precast composite sump container.
- Drywall protection envelope: Elastomeric sub-grade sheeting layer applied to soil-contact walls.

LICENSED ARCHITECTURAL SEAL REGISTERED FOR LOCAL FOOTING EXCAVATION AND POURS.`
  },
  {
    id: "doc-permit",
    title: "Excavation & Building Permit (P-112)",
    filename: "Excavation_Building_Permit_P-112.pdf",
    size: "850 KB",
    type: "Zoning & Permitting",
    issuedDate: "May 14, 2026",
    status: "Active Authorized",
    hash: "SHA-256: e8d390a12002fa88e7d23fecbc22b821",
    content: `TAYLORVILLE ZONING AND PLANNING COMMISSION - EXCAVATION LICENSE

PERMIT STAMP ID: P-112-TX
VALID THROUGH: May 14, 2026

MUNICIPAL STAMP OF SERVICE:
Christian County Commissioner hereby approves Watertight Construction to perform heavy mechanical subgrade site trenching, soil compacting, and drainage integration.

COMPLIANCE CHECKS REQUIRED:
- Backfill soil composition approval
- Open channel inspector field signoff
- Discharge outlet test closure.

CHRISTIAN COUNTY LAND USE BOARD COMMISSIONER`
  }
];

export default function GlassFloorPortal(props: GlassFloorPortalProps) {
  const { user, onLogout } = props;

  // Selection states
  const [sealFinish, setSealFinish] = useState<string>("Textured Off-White");
  const [gratingProfile, setGratingProfile] = useState<string>("Standard Infiltration");
  const [selectionsSaved, setSelectionsSaved] = useState<boolean>(false);
  const [activeDoc, setActiveDoc] = useState<any>(null);
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  const triggerDownload = (doc: any) => {
    const formattedContent = `${doc.title}\n========================\nFile Name: ${doc.filename}\nHash: ${doc.hash}\nIssued Date: ${doc.issuedDate}\nStatus: ${doc.status}\n\n${doc.content}\n\n--- DOCUMENT DIGITAL SIGNATURE STAMP VERIFIED BY WATERTIGHT ERP NODE ---`;
    const blob = new Blob([formattedContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadFeedback(`✓ downloaded ${doc.filename}`);
    setTimeout(() => {
      setDownloadFeedback(null);
    }, 4050);
  };

  // Active milestones
  const milestones = [
    { name: "Phase 1: Site Excavation & Soil Dynamics", status: "Complete", date: "May 20, 2026", desc: "Heavy mechanical excavation down to footing. Extracted 4 tons of high-expansion regional clay." },
    { name: "Phase 2: French Drainage & Aggregates", status: "Complete", date: "May 25, 2026", desc: "Installed 3-inch weeping drainage tile, lined with geotextile mesh. Laminated walls with structural backing." },
    { name: "Phase 3: Deep Hydro-Crystalline Spray", status: "In_Progress", date: "Target: June 8, 2026", desc: "Applying active chemical crystalline compound. Reacts with cement calcium to stop sub-grade capillary action." },
    { name: "Phase 4: Inspection & Warranty Stamps", status: "Pending", date: "Target: June 12, 2026", desc: "Final hydrostatic load test and issuance of the Lifetime Transferable Structural Guarantee." }
  ];

  const recentUpdates = [
    {
      title: "Sub-surface Hydro Seal Curing Active",
      category: "Material Curing",
      date: "Yesterday",
      desc: "Base coat applied to south mortar joints. Undergoing standard hydration check over 48 hours to activate crystals.",
      author: "Marcus Vance (Superintendent)"
    },
    {
      title: "Active Sump Basin Ejector Hookup",
      category: "Plumbing Assembly",
      date: "3 days ago",
      desc: "Dual-float premium cast-iron ejector pump successfully set. High capacity emergency check valve configured to municipal exit lines.",
      author: "Dan Harris (Operator Lead)"
    }
  ];

  const handleSaveSelections = () => {
    setSelectionsSaved(true);
    setTimeout(() => setSelectionsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-xl">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-blue-500 uppercase">Interactive Timeline Active</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-600" />
            GlassFloor Client Command
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Job Assignment: <strong className="text-slate-300 font-mono">{user.assignedJob}</strong>
          </p>
        </div>

        <div className="flex gap-3 items-center z-10 w-full md:w-auto">
          <div className="text-right hidden md:block">
            <span className="text-xs font-mono block text-slate-400">Client: {user.name}</span>
            <span className="text-[10px] text-slate-500 block font-mono">{user.email}</span>
          </div>
          <button
            onClick={onLogout}
            id="btn-client-logout"
            className="text-xs font-mono bg-slate-950 hover:bg-slate-850 hover:text-slate-200 border border-slate-800 px-3.5 py-2 rounded-lg transition ml-2 cursor-pointer"
          >
            Exit Portal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: TIMELINE (Phase Tracker) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-lg">
            <div className="border-b border-slate-800/85 pb-4">
              <h3 className="text-base font-display font-extrabold text-slate-250 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Build Milestone Progress Tracking
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                A transparent, step-by-step chronology of our local sub-grade operations.
              </p>
            </div>

            {/* Timelines tree */}
            <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {milestones.map((ms, idx) => (
                <div key={idx} className="flex gap-4 items-start relative select-none">
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                    ms.status === "Complete" 
                      ? "bg-blue-600/10 border-blue-600 text-blue-600" 
                      : ms.status === "In_Progress"
                      ? "bg-indigo-500/10 border-indigo-400 text-indigo-400 animate-pulse"
                      : "bg-slate-950 border-slate-850 text-slate-600"
                  }`}>
                    {ms.status === "Complete" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : ms.status === "In_Progress" ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Layers className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-sans font-bold text-slate-200">{ms.name}</h4>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        ms.status === "Complete" ? "bg-blue-950/20 text-blue-600 border-blue-600/15" :
                        ms.status === "In_Progress" ? "bg-indigo-950/25 text-indigo-400 border-indigo-400/15" :
                        "bg-slate-950 text-slate-505 border-slate-850"
                      }`}>
                        {ms.status.replace("_", " ")}
                      </span>
                      <span className="text-[10px] font-mono text-slate-550 ml-auto">{ms.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{ms.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Selection Board */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-lg">
            <div className="border-b border-slate-800/85 pb-4">
              <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Custom Building & Material Selections
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose aesthetic and design finishes for your sub-grade living space conversion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sans">
              {/* Option A: Seal Tint Finish */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Crystalline Compound Tint Finish</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Satin Slate Gray", desc: "Provides a dark industrial vault look" },
                    { label: "Textured Off-White", desc: "Reflects basement low-voltage lights cleanly" },
                    { label: "Invisible Clear Barrier", desc: "Preserves the existing vintage masonry face" }
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSealFinish(opt.label)}
                      className={`p-3 text-left rounded-lg text-xs border transition-all ${
                        sealFinish === opt.label
                          ? "border-blue-500 bg-blue-950/15 text-slate-100"
                          : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-250"
                      }`}
                    >
                      <span className="font-bold block">{opt.label}</span>
                      <span className="text-[10px] block text-slate-500 mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option B: French Drain Trim */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Corrugated Weeping Drain Trim</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Standard Infiltration", desc: "Direct slit flow channels optimized for clay soils" },
                    { label: "Deco-Grid Bronze Tint", desc: "Aesthetic premium metal grill overlays" },
                    { label: "High-Volume Trenching", desc: "Constructed for high water pressure seasonal basins" }
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setGratingProfile(opt.label)}
                      className={`p-3 text-left rounded-lg text-xs border transition-all ${
                        gratingProfile === opt.label
                          ? "border-blue-500 bg-blue-950/15 text-slate-100"
                          : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-250"
                      }`}
                    >
                      <span className="font-bold block">{opt.label}</span>
                      <span className="text-[10px] block text-slate-500 mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-850">
              <span className="text-[10px] text-slate-500 font-mono">
                *Saved selections are synced instantly with back-office Dispatch
              </span>
              <button
                type="button"
                onClick={handleSaveSelections}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-950 font-sans font-bold hover:shadow-lg rounded-lg text-xs transition cursor-pointer"
              >
                Log Preferences Choice
              </button>
            </div>

            {selectionsSaved && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/25 text-[#10b981] text-[11px] font-mono text-center rounded-lg uppercase">
                ✓ Selections recorded and cached with crew dispatch sheets!
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT DAILY LOGS & COVERS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Warranty & Guarantee Quick Card */}
          <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/5 border border-blue-600/30 rounded-xl p-5 space-y-4 shadow-md relative">
            <div className="p-2.5 bg-blue-600/10 rounded-lg w-fit text-blue-600 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-blue-500">Lifetime Guarantee</h4>
              <span className="text-sm font-display font-bold text-slate-100 block">Fully Bonded Structural Protection</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Upon final project sign-off and site inspector closure, your Transferable Guarantee document will unlock here for download and ledger certification.
              </p>
            </div>
            <div className="border-t border-blue-600/15 pt-3 flex justify-between items-center text-[10px] font-mono text-blue-600">
              <span>Bond Ledger Cert: IL-198302</span>
              <span className="opacity-50">Pending Phase 4</span>
            </div>
          </div>

          {/* Daily field records */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg text-sans">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350">
              Daily Operator Dispatch Feed
            </h3>

            <div className="space-y-4 divide-y divide-slate-850">
              {recentUpdates.map((up, idx) => (
                <div key={idx} className={`space-y-1.5 pt-3 first:pt-0`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase bg-slate-950 px-2 py-0.5 rounded leading-none">
                      {up.category}
                    </span>
                    <span className="text-[10px] text-slate-550 font-mono">{up.date}</span>
                  </div>
                  <h4 className="text-xs font-sans font-bold text-slate-200">{up.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">{up.desc}</p>
                  <span className="text-[9.5px] font-mono text-slate-550 block">By: {up.author}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contract specs & attachments */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg text-sans">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Project Vault Files (PDF)
              </h3>
              <span className="text-[9px] font-mono bg-blue-950/40 text-blue-400 px-2 py-0.5 rounded border border-blue-900/30">
                {PROJECT_DOCUMENTS.length} Documents
              </span>
            </div>

            {downloadFeedback && (
              <div className="text-[10px] bg-emerald-950/40 border border-emerald-500/20 text-[#10b981] px-3 py-1.5 rounded-lg text-center font-mono uppercase animate-pulse">
                {downloadFeedback}
              </div>
            )}

            <div className="space-y-2.5">
              {PROJECT_DOCUMENTS.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-950/70 rounded-xl border border-slate-850 hover:border-slate-800 transition">
                  <div className="flex items-center gap-2.5 text-slate-300 min-w-0">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold block text-[11px] text-slate-200 truncate">{doc.title}</span>
                      <span className="text-[9.5px] text-slate-500 block font-mono">{doc.size} • {doc.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      type="button" 
                      onClick={() => setActiveDoc(doc)}
                      className="p-1.5 hover:bg-slate-800 hover:text-blue-400 rounded-lg transition text-slate-450 cursor-pointer"
                      title="Preview PDF Document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => triggerDownload(doc)}
                      className="p-1.5 hover:bg-slate-800 hover:text-blue-400 rounded-lg transition text-slate-450 cursor-pointer"
                      title="Download PDF Document File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Document Interactive Preview Modal */}
      {activeDoc && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col my-8">
            {/* Modal header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="text-sm font-display font-extrabold text-slate-200">{activeDoc.title}</h3>
                  <span className="text-[9px] font-mono text-slate-500 tracking-wider block">{activeDoc.hash}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveDoc(null)}
                className="p-1.5 hover:bg-slate-805 hover:text-slate-100 rounded-lg text-slate-450 transition cursor-pointer"
                title="Close document viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal document particulars panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-950/30 px-5 py-3 border-b border-slate-850 gap-3 text-[10px] font-mono text-slate-400">
              <div>
                <span className="text-slate-550 block">CATEGORY</span>
                <span className="text-blue-400 font-bold">{activeDoc.type}</span>
              </div>
              <div>
                <span className="text-slate-550 block">ISSUED</span>
                <span className="text-slate-300">{activeDoc.issuedDate}</span>
              </div>
              <div>
                <span className="text-slate-550 block">FILE SIZE</span>
                <span className="text-slate-300">{activeDoc.size}</span>
              </div>
              <div>
                <span className="text-slate-550 block">STATUS</span>
                <span className="text-emerald-400 uppercase font-bold">✓ {activeDoc.status}</span>
              </div>
            </div>

            {/* Document content viewer area */}
            <div className="p-5 overflow-y-auto max-h-[380px] bg-slate-950 font-mono text-[11px] text-slate-300 leading-relaxed border-b border-slate-850 whitespace-pre-wrap select-text">
              <div className="border border-slate-850/80 p-6 rounded-lg bg-slate-950/45 relative shadow-inner">
                {/* Watermark decors */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                  <span className="text-5xl font-extrabold uppercase border-8 border-blue-400 p-8 transform -rotate-12 rounded">WATERTIGHT DIRECT SEAL</span>
                </div>
                {activeDoc.content}
              </div>
            </div>

            {/* Footer controls */}
            <div className="p-4 bg-slate-950/60 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[10px] font-mono text-slate-550">
                Authorized digital stamp certified by Watertight ERP node on {activeDoc.issuedDate}.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveDoc(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-sans transition cursor-pointer"
                >
                  Close Viewer
                </button>
                <button
                  onClick={() => {
                    triggerDownload(activeDoc);
                    setActiveDoc(null);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-slate-950 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 shadow hover:shadow-blue-600/10 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
