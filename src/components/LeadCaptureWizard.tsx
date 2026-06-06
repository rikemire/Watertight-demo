/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileUploadData, EstimateResult, QuoteRequest } from "../types";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  ShieldCheck, 
  DollarSign, 
  Trash2, 
  FileText, 
  Camera, 
  HelpCircle,
  TrendingUp,
  MapPin,
  ClipboardCheck,
  User,
  Mail,
  Phone,
  Settings,
  AlertCircle,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";

interface LeadCaptureWizardProps {
  onSuccess?: (quote: QuoteRequest) => void;
}

export default function LeadCaptureWizard(props: LeadCaptureWizardProps) {
  const { onSuccess } = props;

  // New multi-step structure: 1-5 intake categories, 6 success summary
  const [step, setStep] = useState<number>(1);
  
  // STEP 1 STATE
  const [projectType, setProjectType] = useState<string>("concrete_pad");
  const [length, setLength] = useState<number>(30);
  const [width, setWidth] = useState<number>(20);
  const [intendedUse, setIntendedUse] = useState<string>("storage");

  // STEP 2 STATE
  const [machineryAccess, setMachineryAccess] = useState<string>("yes");
  const [existObstructions, setExistObstructions] = useState<string>("clear");

  // STEP 3 STATE
  const [terrainSlope, setTerrainSlope] = useState<string>("flat");
  const [standingWater, setStandingWater] = useState<string>("dry");

  // STEP 4 STATE
  const [timelineGround, setTimelineGround] = useState<string>("months");
  const [handlePermits, setHandlePermits] = useState<string>("yes");

  // NEW ADDITIONAL DETAILS STATE
  const [natureOfBuild, setNatureOfBuild] = useState<string>("new_construction");
  const [propertyType, setPropertyType] = useState<string>("residential");

  // STEP 5 STATE (Contact & Delivery)
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  
  // File attachments state
  const [files, setFiles] = useState<FileUploadData[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estimation Result State
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  // Trigger quick estimation API when parameters change
  useEffect(() => {
    let active = true;
    const fetchEstimate = async () => {
      if (length <= 0 || width <= 0) return;
      setLoadingEstimate(true);
      try {
        const res = await fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectType,
            length,
            width,
            intendedUse,
            machineryAccess,
            existObstructions,
            terrainSlope,
            standingWater,
            timelineGround,
            handlePermits,
            natureOfBuild,
            propertyType
          })
        });
        const json = await res.json();
        if (active && json.success) {
          setEstimate({
            range: json.range,
            lowEstimate: json.lowEstimate,
            highEstimate: json.highEstimate,
            sqftPrice: json.sqftPrice,
            totalArea: json.totalArea
          });
        }
      } catch (err) {
        console.error("Failed estimation request", err);
      } finally {
        if (active) setLoadingEstimate(false);
      }
    };

    fetchEstimate();
    return () => {
      active = false;
    };
  }, [
    projectType, 
    length, 
    width, 
    intendedUse, 
    machineryAccess, 
    existObstructions, 
    terrainSlope, 
    standingWater, 
    timelineGround, 
    handlePermits,
    natureOfBuild,
    propertyType
  ]);

  // Handle Drag-and-Drop files
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = async (fileList: FileList) => {
    setUploading(true);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string || "";
        
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: file.name,
              size: file.size,
              type: file.type,
              dataUrl: dataUrl
            })
          });
          const json = await res.json();
          if (json.success) {
            setFiles(prev => [...prev, {
              name: file.name,
              size: file.size,
              type: file.type,
              dataUrl: dataUrl
            }]);
          }
        } catch (err) {
          console.error("Upload process error", err);
        }
      };
      reader.readAsDataURL(file);
    }
    setUploading(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Final Form Submit Execution
  const handleSubmitAll = async () => {
    if (!name || !email || !phone) {
      alert("Please provide at least Name, Email, and Phone to register your quote request.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        phone,
        address: address || "Taylorville, IL",
        projectType,
        length,
        width,
        intendedUse,
        machineryAccess,
        existObstructions,
        terrainSlope,
        standingWater,
        timelineGround,
        handlePermits,
        natureOfBuild,
        propertyType,
        notes,
        estimatedRange: estimate?.range || "$0",
        files: files
      };

      const res = await fetch("/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setSubmittedQuote(json.quote);
        setStep(6);
        if (onSuccess) onSuccess(json.quote);
      }
    } catch (err) {
      console.error("Submit quote failure", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Estimate visual calculations details
  const area = length * width;
  
  const projectLabels: Record<string, string> = {
    concrete_pad: "Concrete Pad Slab Pouring",
    pole_barn: "Pole Barn/Outbuilding Support Frame",
    framing_add_on: "Add-on Structural Framing",
    waterproofing_repair: "Structural Waterproofing & Foundation Repair"
  };

  return (
    <div id="lead-Wizard-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: The Step Intake Wizard */}
      <div id="wizard-form-card" className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Progress header - hidden on success screen */}
        {step < 6 && (
          <div id="wizard-progress-header" className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono text-blue-500 tracking-wider uppercase font-bold">
                STEP {step} OF 5
              </span>
              <span className="text-sm font-sans text-slate-300 font-medium">
                {step === 1 && "Basic Scope & Dimensions"}
                {step === 2 && "Accessibility clearance & structures"}
                {step === 3 && "Geotechnical & drain prep"}
                {step === 4 && "Logistics & permitting setup"}
                {step === 5 && "Contact parameters & file upload"}
              </span>
            </div>
            {/* Progress bar line */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Project Type & Footprint Dimensions */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <h3 className="text-lg md:text-xl font-display font-black text-slate-100 tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  What type of project are we building?
                </h3>
                <p className="text-xs text-slate-400">Select the primary structural option to begin calibrating spatial weights.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Options mapping */}
                <button
                  type="button"
                  id="btn-pt-concrete-pad"
                  onClick={() => setProjectType("concrete_pad")}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    projectType === "concrete_pad"
                      ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-200">Concrete Pad</span>
                  <span className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Poured garage bases, custom utility layouts, cold joints support.
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-pt-pole-barn"
                  onClick={() => setProjectType("pole_barn")}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    projectType === "pole_barn"
                      ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-200">Pole Barn/Outbuilding</span>
                  <span className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Post-frame agricultural outbuildings, stable wood structure foundations.
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-pt-framing-addon"
                  onClick={() => setProjectType("framing_add_on")}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    projectType === "framing_add_on"
                      ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-200">Framing/Add-on</span>
                  <span className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Residential structural expansions, wall layouts, and framing conversions.
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-pt-waterproofing"
                  onClick={() => setProjectType("waterproofing_repair")}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    projectType === "waterproofing_repair"
                      ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-200">Waterproofing/Foundation Repair</span>
                  <span className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Perimeter drain networks, sump configurations, polymer wall tiebacks.
                  </span>
                </button>
              </div>

              {/* Sliders Area */}
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">Estimated Project Footprint</span>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300 font-mono">
                    <span>LENGTH DESIRED</span>
                    <span className="text-blue-500 font-bold">{length} FT</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full accent-blue-600 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300 font-mono">
                    <span>WIDTH DESIRED</span>
                    <span className="text-blue-500 font-bold">{width} FT</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="1"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                    className="w-full accent-blue-600 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Intended Use options */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">What is the intended use of the space?</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "storage", label: "Storage", desc: "Shed overflow" },
                    { id: "vehicle", label: "Vehicle / Heavy", desc: "Thicker slab" },
                    { id: "living", label: "Living Space", desc: "Insulation layer" },
                    { id: "livestock", label: "Livestock", desc: "Anti-slip prep" }
                  ].map((use) => (
                    <button
                      key={use.id}
                      type="button"
                      onClick={() => setIntendedUse(use.id)}
                      className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 text-xs select-none ${
                        intendedUse === use.id
                          ? "border-blue-500 bg-blue-950/20 text-slate-100 ring-1 ring-blue-500"
                          : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="font-bold block leading-none">{use.label}</span>
                      <span className="text-[8px] text-slate-500 block leading-tight">{use.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  id="btn-step-1-next"
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-500 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase py-3 px-6 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Scope Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: On-Site Accessibility & Obstructions */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <h3 className="text-lg md:text-xl font-display font-black text-slate-100 tracking-tight flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  On-Site Accessibility & Obstructions
                </h3>
                <p className="text-xs text-slate-400">Mechanical loader access width dictates standard versus micro equipment hauling budgets.</p>
              </div>

              {/* Machinery Access Box */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">Can heavy machinery easily access the build area?</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMachineryAccess("yes")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      machineryAccess === "yes"
                        ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-200">Yes, Wide-Open Access</span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                      Full yard space over 6 ft clearance. Direct bulldozer or standard dump truck loading.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMachineryAccess("no")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      machineryAccess === "no"
                        ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-205">No, Gated / Narrow Path</span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                      Gate or path under 6 ft. Requires tracked concrete buggies or intensive manual transport.
                    </span>
                  </button>
                </div>
              </div>

              {/* Demolition & Clearing Options */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">Are there existing structures or hardscapes that need to be removed first?</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {[
                    { id: "clear", label: "Clear Dirt/Grass", desc: "Ready for grading directly" },
                    { id: "concrete", label: "Cracked Concrete/Asphalt", desc: "Requires pneumatic breaking & dumping" },
                    { id: "stumps", label: "Tree Stumps/Brush", desc: "Deep root pulling & excavation dump" }
                  ].map((obs) => (
                    <button
                      key={obs.id}
                      type="button"
                      onClick={() => setExistObstructions(obs.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        existObstructions === obs.id
                          ? "border-blue-500 bg-blue-950/20 text-slate-100 ring-1 ring-blue-500"
                          : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-200">{obs.label}</span>
                      <span className="text-[9px] text-slate-500 mt-1 leading-tight">{obs.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="flex justify-between pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-slate-800 hover:border-slate-700 hover:text-slate-200 text-slate-400 text-xs font-mono font-bold tracking-wider uppercase py-3 px-6 rounded-xl transition duration-150 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-blue-600 hover:bg-blue-500 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase py-3 px-6 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Soil Prep Variables</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Geotechnical & Soil Preparation */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <h3 className="text-lg md:text-xl font-display font-black text-slate-100 tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Geotechnical & Environmental Prep
                </h3>
                <p className="text-xs text-slate-400">Midwest clay soils require stabilization base treatments to avoid slab shearing or foundation sinking.</p>
              </div>

              {/* Terrain Slope Section */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">What best describes the terrain and slope of the site?</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTerrainSlope("flat")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      terrainSlope === "flat"
                        ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-202">Flat and Level</span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                      Under 5% incline. Minimal earth scraping, standard gravel layout packing.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTerrainSlope("sloped")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      terrainSlope === "sloped"
                        ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-202">Sloped or Uneven</span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                      Requires deep laser-level grading, subgrade leveling, and custom compaction hours.
                    </span>
                  </button>
                </div>
              </div>

              {/* Soil standing water damp conditions */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">Does the area experience standing water or damp soil conditions?</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStandingWater("dry")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      standingWater === "dry"
                        ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-200 font-sans">Generally Dry</span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                      Good natural run-off. Standard limestone gravel subgrade bedding is completely sufficient.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStandingWater("wet")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      standingWater === "wet"
                        ? "border-blue-500 bg-blue-950/20 text-slate-100 ring-1 ring-blue-500"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-200">Stays Wet / Poor Drainage</span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                      Requires deeper washed-rock bedding wraps, extra drainage filters, or subgrid fabric.
                    </span>
                  </button>
                </div>
              </div>

              {/* Navigation button rows */}
              <div className="flex justify-between pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="border border-slate-800 hover:border-slate-700 hover:text-slate-200 text-slate-400 text-xs font-mono font-bold tracking-wider uppercase py-3 px-6 rounded-xl transition duration-150 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-blue-600 hover:bg-blue-500 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase py-3 px-6 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Logistical Overheads</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Administrative & Timeline Logistics */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <h3 className="text-lg md:text-xl font-display font-black text-slate-100 tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Administrative & Site Logistics
                </h3>
                <p className="text-xs text-slate-400">Manage dispatch queue prioritizing, local zoning filings, and municipal permits.</p>
              </div>

              {/* Breaking ground timeline choices */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">How soon would you like to break ground?</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "immediate", label: "Immediately", desc: "Priority scheduling dispatch queue allocation" },
                    { id: "months", label: "Within 1-3 Months", desc: "Standard scheduling window slot option" },
                    { id: "planning", label: "Planning Ahead", desc: "Budget scoping and planning phase only" }
                  ].map((time) => (
                    <button
                      key={time.id}
                      type="button"
                      onClick={() => setTimelineGround(time.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        timelineGround === time.id
                          ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                          : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-200">{time.label}</span>
                      <span className="text-[9px] text-slate-500 mt-1 leading-normal">{time.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permit filings help */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">Would you like us to handle the municipal building permits and code filings?</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHandlePermits("yes")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      handlePermits === "yes"
                        ? "border-blue-500 bg-blue-950/20 text-slate-150 ring-1 ring-blue-500"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-200 font-sans">Yes, handle it for me</span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                      We draft mechanical submittals, coordinate Christian County code filings, and pay structural permit fees.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHandlePermits("no")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      handlePermits === "no"
                        ? "border-blue-500 bg-blue-950/20 text-slate-100 ring-1 ring-blue-500"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-200">No, I will secure them</span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                      Homeowner manages all local zoning hearings, county engineer approvals, and permit filings.
                    </span>
                  </button>
                </div>
              </div>

              {/* Property sector selection */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">What is the primary classification of the property?</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "residential", label: "Residential", desc: "Subdivision homes, backyard layouts, personal garages" },
                    { id: "commercial", label: "Commercial", desc: "Office hubs, retail locations, or heavy warehouses (+25%)" },
                    { id: "agricultural", label: "Agricultural & Barns", desc: "Acreage structures, equestrian spaces, simple bases (-5%)" }
                  ].map((prop) => (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => setPropertyType(prop.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        propertyType === prop.id
                          ? "border-blue-500 bg-blue-950/20 text-slate-100 ring-1 ring-blue-500"
                          : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-200">{prop.label}</span>
                      <span className="text-[9px] text-slate-500 mt-1 leading-tight">{prop.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nature of the project */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider">What is the scope context of this build?</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "new_construction", label: "New Construction", desc: "Clean terrain" },
                    { id: "remodel", label: "Remodel / Retrofit", desc: "Structure tie-in (+15%)" },
                    { id: "addition", label: "Structural Addition", desc: "Expanding envelope (+10%)" },
                    { id: "repair", label: "Waterproofing / Repair", desc: "Address issues (+5%)" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNatureOfBuild(item.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 text-xs select-none ${
                        natureOfBuild === item.id
                          ? "border-blue-500 bg-blue-950/20 text-slate-100 ring-1 ring-blue-500"
                          : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="font-bold block leading-none">{item.label}</span>
                      <span className="text-[8px] text-slate-500 block leading-tight">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation button rows */}
              <div className="flex justify-between pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="border border-slate-800 hover:border-slate-700 hover:text-slate-200 text-slate-400 text-xs font-mono font-bold tracking-wider uppercase py-3 px-6 rounded-xl transition duration-150 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="bg-blue-600 hover:bg-blue-500 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase py-3 px-6 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Contact & Submit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Contact Info & File Uploads */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <h3 className="text-lg md:text-xl font-display font-black text-slate-100 tracking-tight flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-blue-500" />
                  Register Estimate & Upload Details
                </h3>
                <p className="text-xs text-slate-400">Lock in your calculated estimate range by registering your project contact info below.</p>
              </div>

              {/* Inputs form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-bold uppercase text-[10px] text-slate-300 block tracking-wider">FULL NAME *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Arthur Pendelton"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium transition duration-150"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold uppercase text-[10px] text-slate-300 block tracking-wider">EMAIL ADDRESS *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. arthur@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium transition duration-150"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold uppercase text-[10px] text-slate-300 block tracking-wider">PHONE NUMBER *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Phone className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 217-555-0143"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium transition duration-150"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold uppercase text-[10px] text-slate-300 block tracking-wider">SITE STREET ADDRESS</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type="text" 
                      placeholder="e.g. 712 S Webster St, Taylorville"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium transition duration-150"
                    />
                  </div>
                </div>
              </div>

              {/* Drag-and-drop uploads */}
              <div className="space-y-2">
                <label className="font-bold uppercase text-[10px] text-slate-300 block tracking-wider">OPTIONAL CONTEXT FILES / BLUEPRINTS</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    isDragging 
                      ? "border-blue-550 bg-blue-950/20" 
                      : "border-slate-800 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-950/50"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                  />
                  <Upload className={`w-6 h-6 text-slate-500 ${uploading ? 'animate-bounce' : ''}`} />
                  <span className="text-xs font-bold font-sans text-slate-300">
                    {uploading ? "Analyzing attachments..." : "Drag files here or tap to select"}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">PNG, JPG, PDF or DXF CAD layouts</span>
                </div>

                {/* Uploaded files stack */}
                {files.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {files.map((f, index) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-300">
                          <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="font-mono text-[10px] truncate max-w-[200px]" title={f.name}>{f.name}</span>
                          <span className="text-[9px] text-slate-500">({Math.round(f.size / 1024)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Brief notes */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-[10px] text-slate-300 block tracking-wider">ADDITIONAL NOTES / ACCESS CHALLENGES</label>
                <textarea
                  placeholder="Tell us about soil soft spots, narrow driveways or any custom specifications..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 font-medium transition duration-150"
                />
              </div>

              {/* Navigation button rows */}
              <div className="flex justify-between pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="border border-slate-800 hover:border-slate-700 hover:text-slate-200 text-slate-400 text-xs font-mono font-bold tracking-wider uppercase py-3 px-6 rounded-xl transition duration-150 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitAll}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase py-3 px-8 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-blue-600/10"
                >
                  {submitting ? (
                    <>
                      <Settings className="w-4 h-4 animate-spin" />
                      <span>Logging Intake...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Submit Estimate Request</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Successful Submittal Summary */}
          {step === 6 && submittedQuote && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="text-center py-6 space-y-6"
            >
              <div className="inline-flex p-4 bg-blue-605/10 border border-blue-500/20 text-blue-500 rounded-full animate-bounce">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-display font-black text-slate-100 tracking-tight text-white leading-none">
                  Estimate Request Logged Successfully
                </h3>
                <span className="text-xs font-mono text-blue-500 font-bold block">
                  JOB SERIAL ID: {submittedQuote.id}
                </span>
                <p className="text-xs text-slate-350 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-100">{submittedQuote.name}</strong>! Your intake specifications have been compiled. A local manager will verify files and contact you shortly.
                </p>
              </div>

              {/* Details table summary */}
              <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 max-w-sm mx-auto text-left space-y-2.5 font-mono text-[10.5px]">
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">PROJECT TYPE:</span>
                  <span className="text-slate-200 font-bold uppercase">{projectType.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">PROPERTY SECTOR:</span>
                  <span className="text-slate-200 font-bold uppercase">{propertyType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">BUILD SCOPE:</span>
                  <span className="text-slate-200 font-bold uppercase">{natureOfBuild.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">FOOTPRINT:</span>
                  <span className="text-slate-200 font-bold">{length} FT x {width} FT</span>
                </div>
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">ESTIMATED INVESTMENT:</span>
                  <span className="text-blue-500 font-bold">{submittedQuote.estimatedRange || "$0.00"}</span>
                </div>
                <div className="flex justify-between pb-0.5">
                  <span className="text-slate-500">CONTACT PHONE:</span>
                  <span className="text-slate-250">{submittedQuote.phone}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  id="btn-restart-wizard"
                  onClick={() => {
                    setStep(1);
                    setFiles([]);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setAddress("");
                    setNotes("");
                  }}
                  className="bg-slate-950 hover:bg-slate-900 text-xs font-mono font-bold tracking-wider uppercase py-3 px-6 rounded-xl border border-slate-800 hover:border-slate-650 transition cursor-pointer"
                >
                  Start New Calculation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT COLUMN: Real-Time Quote Calculation Breakdown Dashboard */}
      <div id="cost-estimator-panel" className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="space-y-1">
          <h4 className="text-[10px] font-mono font-bold tracking-widest text-blue-500 uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            LIVE ESTIMATION ENGINE
          </h4>
          <h3 className="text-base font-display font-black text-white">Dynamic Pricing Breakdown</h3>
          <p className="text-[11px] text-slate-400 leading-normal">
            Parameters entered are analyzed instantly against baseline Central IL trade indices.
          </p>
        </div>

        {/* Price display number card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-center space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
          
          <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-bold">ESTIMATED INVESTMENT RANGE</span>
          
          {loadingEstimate ? (
            <div className="h-10 flex items-center justify-center text-xs font-mono text-blue-500 tracking-wider">
              Recalculating local index...
            </div>
          ) : (
            <span className="text-2xl md:text-3xl font-mono text-blue-500 font-black block">
              {estimate ? estimate.range : "$0.00"}
            </span>
          )}

          <span className="text-[9px] text-slate-500 font-sans block leading-tight pt-1">
            *Includes average tool haulage, machinery hours & standard base preparation.
          </span>
        </div>

        {/* Calculation Logic Stack */}
        <div className="space-y-3.5 pt-2 font-mono text-[11px]">
          <h4 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-900 pb-1.5 flex items-center gap-1">
            <span>TECHNICAL CALCULATION VALUES</span>
          </h4>

          {/* Sizing line */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Specified Size:</span>
            <span className="text-slate-200">{length} ft x {width} ft</span>
          </div>

          {/* Area line */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Calculated Footprint:</span>
            <span className="text-slate-100 font-bold">{area} SQ. FT.</span>
          </div>

          {/* Base rates list */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Primary Category Rate:</span>
            <span className="text-slate-100">
              {projectType === "concrete_pad" && "$9.50 / sft"}
              {projectType === "pole_barn" && "$15.50 / sft"}
              {projectType === "framing_add_on" && "$35.00 / sft"}
              {projectType === "waterproofing_repair" && "$12.50 / sft"}
            </span>
          </div>

          <div className="border-t border-slate-900 my-2" />

          {/* Intended space use */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Use Complexity:</span>
            <span className={`text-right ${intendedUse !== "storage" ? "text-blue-400" : "text-slate-400"}`}>
              {intendedUse === "storage" && "Standard (No surcharge)"}
              {intendedUse === "vehicle" && "+30% thicker reinforcings"}
              {intendedUse === "living" && "+15% weather moisture layers"}
              {intendedUse === "livestock" && "Standard (No surcharge)"}
            </span>
          </div>

          {/* Access surcharge tracker */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Accessibility Factor:</span>
            <span className={`text-right ${machineryAccess === "no" ? "text-blue-400" : "text-slate-400"}`}>
              {machineryAccess === "no" ? "+20% micro compact equipment" : "Standard (Open loaders)"}
            </span>
          </div>

          {/* Obstruction demolishing */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Site Demolition prep:</span>
            <span className={`text-right ${existObstructions !== "clear" ? "text-blue-400" : "text-slate-400"}`}>
              {existObstructions === "clear" && "Raw soil flat scraping"}
              {existObstructions === "concrete" && "+$4.00/sft concrete tearing"}
              {existObstructions === "stumps" && "+$2.00/sft brush clear + $400 flat"}
            </span>
          </div>

          {/* Geotechnical Leveling Adjuster */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Slope Grading treatments:</span>
            <span className={`text-right ${terrainSlope === "sloped" ? "text-blue-400" : "text-slate-400"}`}>
              {terrainSlope === "sloped" ? "+$1,200 level modeling" : "Standard Flat scraping"}
            </span>
          </div>

          {/* Damp conditions */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Soil Wetness Hydric factor:</span>
            <span className={`text-right ${standingWater === "wet" ? "text-blue-400" : "text-slate-400"}`}>
              {standingWater === "wet" ? "+15% limestone drainage wrap" : "Standard dry drainage bed"}
            </span>
          </div>

          {/* Timeline dispatch */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Scheduling Dispatch:</span>
            <span className={`text-right ${timelineGround === "immediate" ? "text-blue-400" : "text-slate-400"}`}>
              {timelineGround === "immediate" ? "+$500 priority allocation" : "Standard scheduling queue"}
            </span>
          </div>

          {/* Administrative Permits */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">County Permit securement:</span>
            <span className={`text-right ${handlePermits === "yes" ? "text-blue-400" : "text-slate-400"}`}>
              {handlePermits === "yes" ? "+$350 code submittals drafting" : "Owner self-approves"}
            </span>
          </div>

          {/* Property Class */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Property Sector:</span>
            <span className={`text-right ${propertyType !== "residential" ? "text-blue-400" : "text-slate-400"}`}>
              {propertyType === "residential" && "Residential (Standard)"}
              {propertyType === "commercial" && "+25% Commercial specifications"}
              {propertyType === "agricultural" && "-5% Agricultural structure"}
            </span>
          </div>

          {/* Nature of the project */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Build Scope:</span>
            <span className={`text-right ${natureOfBuild !== "new_construction" ? "text-blue-400" : "text-slate-400"}`}>
              {natureOfBuild === "new_construction" && "New Construction"}
              {natureOfBuild === "remodel" && "+15% Remodel tie-in"}
              {natureOfBuild === "addition" && "+10% Structural Addition"}
              {natureOfBuild === "repair" && "+5% Structural Repair"}
            </span>
          </div>

          {/* Divider line style */}
          <div className="border-t border-slate-900 pt-3 flex justify-between items-center">
            <span className="text-slate-300 font-bold uppercase">Estimated Avg SFT Price:</span>
            <span className="text-blue-550 font-bold text-sm">
              {estimate ? `$${estimate.sqftPrice.toFixed(2)}` : "$0.00"}
            </span>
          </div>
        </div>

        {/* Lifetime Transferable Certificate */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1.5 font-sans leading-relaxed text-[11px] text-slate-400 block">
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider font-bold text-slate-200 uppercase leading-none">
            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
            WARRANTY & PERFORMANCE PLEDGE
          </div>
          <p>
            Certified structural methods applied strictly. All subgrade sealants are backed by our <strong>Lifetime Transferable Structural Waterproofing Guarantee</strong>. Fully bonded, licensed IL #055-198302.
          </p>
        </div>
      </div>
    </div>
  );
}
