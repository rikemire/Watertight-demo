/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { SubcontractorApplication } from "../types";
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  Truck, 
  Wrench, 
  CheckCircle, 
  Clock, 
  Send,
  Milestone
} from "lucide-react";

interface SubcontractorPortalProps {
  onSuccess?: (app: SubcontractorApplication) => void;
}

export default function SubcontractorPortal(props: SubcontractorPortalProps) {
  const { onSuccess } = props;

  // Checklist of construction specialties
  const specialtiesList = [
    "Structural Waterproofing",
    "Concrete Foundations Pours",
    "Excavation & Dirt Shifting",
    "Light Wood Framing additions",
    "Drywall & Finish Masonry",
    "Demolition & Junk hauling",
    "Egress Window Installation"
  ];

  const [partnerType, setPartnerType] = useState<"Individual Contractor" | "Business Partner">("Business Partner");
  const [businessName, setBusinessName] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [crewSize, setCrewSize] = useState<number>(2);
  const [insuranceLimit, setInsuranceLimit] = useState<string>("$1,000,000");
  const [hasEquipment, setHasEquipment] = useState<boolean>(true);
  const [equipmentList, setEquipmentList] = useState<string>("");
  const [serviceRadius, setServiceRadius] = useState<number>(30);
  const [availability, setAvailability] = useState<"Immediate" | "1-2 Weeks" | "1 Month" | "Looking for future projects">("Immediate");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<SubcontractorApplication | null>(null);

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const effectiveBizName = partnerType === "Individual Contractor" && !businessName ? contactName : businessName;
    if (!effectiveBizName || !contactName || !email || !phone) {
      alert("Please fill in all primary fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/subcontractor-onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerType,
          businessName: effectiveBizName,
          contactName,
          phone,
          email,
          specialty: selectedSpecialties,
          crewSize,
          insuranceLimit,
          hasEquipment,
          equipmentList,
          serviceRadius,
          availability,
          additionalNotes
        })
      });
      const json = await res.json();
      if (json.success) {
        setSubmittedApp(json.application);
        if (onSuccess) onSuccess(json.application);
      }
    } catch (err) {
      console.error("Subcontractor onboarding error", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="subcontractor-portal-root" className="max-w-3xl mx-auto">
      {/* Intro header */}
      <div className="text-center mb-10 space-y-3">
        <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase bg-blue-950/40 border border-blue-600/20 px-3 py-1.5 rounded-full inline-block">
          Subcontractor & Crew Portals
        </span>
        <h2 className="text-3xl font-display font-bold text-slate-100 tracking-tight">Join Our Christian County Field Crew</h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          We actively subcontract structural framing, heavy earthmoving, egress window setups, and foundation masonry. Register your rates and license below.
        </p>
      </div>

      {submittedApp ? (
        <div id="crew-sub-success-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-[#22c55e]">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100">Application Registered on Vendor Store</h3>
            <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">CREW ID REFERENCE: {submittedApp.id.toUpperCase()}</p>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
              Thanks for applying, <strong>{submittedApp.contactName}</strong>. Your profile for <strong>{submittedApp.businessName}</strong> was uploaded to our dispatch board.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl max-w-md mx-auto space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">Vendor Profile Details</h4>
            
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Specialties:</span>
              <span className="text-slate-200 font-semibold">{selectedSpecialties.length > 0 ? selectedSpecialties.join(", ") : "General Support"}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Verified Crew Size:</span>
              <span className="text-slate-200 font-mono">{crewSize} Field Operators</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Service Radius:</span>
              <span className="text-slate-200 font-mono">{serviceRadius} Miles around Taylorville</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Availability:</span>
              <span className="text-blue-600 font-semibold">{availability}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400 max-w-md mx-auto text-left flex gap-3">
            <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200 uppercase font-mono tracking-wider text-[10px]">VERIFICATION PROCESS</p>
              <p className="mt-1 leading-relaxed text-[11px]">
                Our back-office dispatch team will verify your COIs (Certificate of Insurance) and past project references. Approved vendors are added to dispatch tickets immediately.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-sub-restart"
            onClick={() => {
              setSubmittedApp(null);
              setBusinessName("");
              setContactName("");
              setPhone("");
              setEmail("");
              setSelectedSpecialties([]);
              setCrewSize(2);
              setEquipmentList("");
              setAdditionalNotes("");
            }}
            className="text-xs font-mono tracking-wider font-bold text-blue-600 hover:text-blue-500 uppercase px-4 py-2 border border-blue-600/20 hover:border-blue-600/50 bg-slate-950 rounded-lg transition"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
        <form 
          id="subcontractor-form" 
          onSubmit={handleFormSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6"
        >
          {/* Section 1: Business Identification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="font-sans font-bold text-slate-200 text-sm tracking-wider uppercase">Partner Information</h3>
            </div>

            {/* Individual vs Business Partner Option Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Enrollment Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="sub-partner-type-picker">
                <button
                  type="button"
                  id="btn-partner-type-individual"
                  onClick={() => setPartnerType("Individual Contractor")}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-sans text-xs font-semibold ${
                    partnerType === "Individual Contractor"
                      ? "border-blue-500 bg-blue-950/20 text-slate-100 ring-1 ring-blue-500"
                      : "border-slate-850 bg-slate-950/40 text-slate-400 hover:border-slate-705 hover:text-slate-300"
                  }`}
                >
                  Individual contractor / Crew Lead
                </button>
                <button
                  type="button"
                  id="btn-partner-type-business"
                  onClick={() => setPartnerType("Business Partner")}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-sans text-xs font-semibold ${
                    partnerType === "Business Partner"
                      ? "border-blue-500 bg-blue-950/20 text-slate-100 ring-1 ring-blue-500"
                      : "border-slate-850 bg-slate-950/40 text-slate-400 hover:border-slate-705 hover:text-slate-300"
                  }`}
                >
                  Business Partner / Subcontractor Co
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="sub-biz-name" className="text-xs font-sans font-medium text-slate-300">
                  {partnerType === "Individual Contractor" ? "DBA OR TRADE NAME (OPTIONAL)" : "BUSINESS NAME *"}
                </label>
                <input
                  type="text"
                  id="sub-biz-name"
                  placeholder={partnerType === "Individual Contractor" ? "e.g. Mike Vance Specialty (optional)" : "e.g. Taylorville Masonry Co"}
                  required={partnerType === "Business Partner"}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sub-contact-name" className="text-xs font-sans font-medium text-slate-300">PRIMARY CONTACT NAME <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  id="sub-contact-name"
                  placeholder="e.g. Mike Vance"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sub-phone" className="text-xs font-sans font-medium text-slate-300">DIRECT MOBILE <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  id="sub-phone"
                  placeholder="217-555-5555"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sub-email" className="text-xs font-sans font-medium text-slate-300">EMAIL ADDRESS <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  id="sub-email"
                  placeholder="mike@taylorvillemasonry.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Trades, Crew and Insurance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <h3 className="font-sans font-bold text-slate-200 text-sm tracking-wider uppercase">Trades & Capacity</h3>
            </div>

            {/* Checkboxes specialties */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Specialties offered</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {specialtiesList.map((spec, i) => (
                  <label key={i} className="flex items-center gap-2.5 p-2 bg-slate-950/60 border border-slate-850/60 hover:bg-slate-950 rounded-lg cursor-pointer transition">
                    <input
                      type="checkbox"
                      className="accent-blue-600 w-4 h-4 rounded"
                      checked={selectedSpecialties.includes(spec)}
                      onChange={() => toggleSpecialty(spec)}
                    />
                    <span className="text-slate-300 font-sans">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Crew size range */}
              <div className="space-y-1.5">
                <label htmlFor="sub-crew-size" className="text-xs font-sans font-medium text-slate-300 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> CREW SIZE
                </label>
                <select
                  id="sub-crew-size"
                  value={crewSize}
                  onChange={(e) => setCrewSize(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-600"
                >
                  <option value={1}>1 (Owner-Operator)</option>
                  <option value={2}>2 - 3 Tradesmen</option>
                  <option value={4}>4 - 6 Crew Members</option>
                  <option value={8}>8+ Specialized Team</option>
                </select>
              </div>

              {/* Insurance option */}
              <div className="space-y-1.5">
                <label htmlFor="sub-insurance" className="text-xs font-sans font-medium text-slate-300 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-600" /> ACTIVE GENERAL LIABILITY
                </label>
                <select
                  id="sub-insurance"
                  value={insuranceLimit}
                  onChange={(e) => setInsuranceLimit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-600"
                >
                  <option value="$1,000,000">$1M General Limits</option>
                  <option value="$2,000,000">$2M Aggregate Limit</option>
                  <option value="$5,000,000">$5M Custom Heavy Limit</option>
                  <option value="none">None (Applied as backup auxiliary)</option>
                </select>
              </div>

              {/* Ready status */}
              <div className="space-y-1.5">
                <label htmlFor="sub-availability" className="text-xs font-sans font-medium text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> DISPATCH READY
                </label>
                <select
                  id="sub-availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-600"
                >
                  <option value="Immediate">Immediate Availability</option>
                  <option value="1-2 Weeks">Available in 1-2 Weeks</option>
                  <option value="1 Month">Available next month</option>
                  <option value="Looking for future projects">Keep on file for future bids</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Logistics & Equips */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <h3 className="font-sans font-bold text-slate-200 text-sm tracking-wider uppercase">Logistics & Equipment</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Service radius slider */}
              <div className="md:col-span-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="sub-radius" className="text-slate-300 font-medium">DISPATCH RADIUS</label>
                  <span className="font-mono text-blue-600 font-bold">{serviceRadius} mi</span>
                </div>
                <input
                  type="range"
                  id="sub-radius"
                  min="15"
                  max="100"
                  step="5"
                  value={serviceRadius}
                  onChange={(e) => setServiceRadius(parseInt(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-800 h-1 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-sans block text-center">centered around Taylorville, IL</span>
              </div>

              {/* Equipment trigger */}
              <div className="md:col-span-8 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="sub-equips" className="text-slate-300 font-semibold uppercase font-mono tracking-wider">Specialized Machinery or Rigging?</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                    <input
                      type="checkbox"
                      checked={hasEquipment}
                      onChange={(e) => setHasEquipment(e.target.checked)}
                      className="accent-blue-600"
                    />
                    <span>We own machinery</span>
                  </label>
                </div>
                {hasEquipment && (
                  <input
                    type="text"
                    id="sub-equips"
                    placeholder="e.g. Bobcats, excavators, masonry saws, concrete stamping forms..."
                    value={equipmentList}
                    onChange={(e) => setEquipmentList(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-600"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Experience Notes */}
          <div className="space-y-1.5">
            <label htmlFor="sub-notes" className="text-xs font-sans font-medium text-slate-300">Brief references or previous sub experience</label>
            <textarea
              id="sub-notes"
              rows={3}
              placeholder="Tell us about complex footing pours or municipal waterproofing jobs you have competed in Christian / Sangamon Counties..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-600 font-sans"
            />
          </div>

          {/* Form action button submit */}
          <div className="flex justify-end pt-2 border-t border-slate-850">
            <button
              type="submit"
              disabled={submitting}
              id="btn-sub-submit-form"
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-slate-950 font-sans font-bold py-3 px-6 rounded-xl transition duration-200 shadow-xl disabled:opacity-50 cursor-pointer font-bold"
            >
              <Send className="w-4 h-4 shrink-0" />
              {submitting ? "Uploading Credentials..." : "Register Profile & Join Crew"}
            </button>
          </div>
        </form>
      )}

      {/* Trust assurance card */}
      <div className="mt-8 bg-slate-950/50 border border-slate-850 p-5 rounded-2xl flex gap-3 text-left">
        <Milestone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">EQUAL PARTNERSHIP GUARANTEES</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
            Watertight Construction is built on solid crew relationships. We commit to weekly direct deposits, precise site-ready excavation delivery, and clear, non-conflicting schedules to keep your crew framing without down-time. Fully licensed worker pool safeguards in place in Christian County, IL.
          </p>
        </div>
      </div>
    </div>
  );
}
