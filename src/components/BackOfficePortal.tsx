/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  TrendingUp, 
  MapPin, 
  FileText, 
  RefreshCw, 
  Mail, 
  Phone,
  Lock,
  ArrowRight,
  UserPlus,
  Trash2,
  Cpu,
  Bookmark,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { QuoteRequest, SubcontractorApplication, PortalAccessRequest, UserAccount } from "../types";

export default function BackOfficePortal() {
  const [activeTab, setActiveTab] = useState<"quotes" | "subcontractors" | "accounts" | "ai-estimator" | "integrations">("quotes");
  
  // Login secure administrative authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  // States
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [subcontractors, setSubcontractors] = useState<SubcontractorApplication[]>([]);
  const [accessRequests, setAccessRequests] = useState<PortalAccessRequest[]>([]);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // AI-Assisted Estimates States
  const [aiProjectType, setAiProjectType] = useState<string>("Structural Waterproofing");
  const [aiLength, setAiLength] = useState<number>(30);
  const [aiWidth, setAiWidth] = useState<number>(20);
  const [aiConstraints, setAiConstraints] = useState<string>("Dense Central Illinois glaciated clay matrices. High baseline seasonal hydrostatic pressure.");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Direct Account Provision states
  const [directName, setDirectName] = useState<string>("");
  const [directEmail, setDirectEmail] = useState<string>("");
  const [directPassword, setDirectPassword] = useState<string>("pass123");
  const [directType, setDirectType] = useState<"client" | "crew">("client");
  const [directJob, setDirectJob] = useState<string>("812 W Franklin St - Basement Encapsulation");

  // Specific assignment job edits
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editJobTitle, setEditJobTitle] = useState<string>("");

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/admin/quotes");
      const json = await res.json();
      if (json.success) setQuotes(json.data);
    } catch (err) {
      console.error("Quotes fetch failure", err);
    }
  };

  const fetchSubs = async () => {
    try {
      const res = await fetch("/api/admin/subcontractors");
      const json = await res.json();
      if (json.success) setSubcontractors(json.data);
    } catch (err) {
      console.error("Subs fetch failure", err);
    }
  };

  const fetchAccessRequests = async () => {
    try {
      const res = await fetch("/api/admin/portal-requests");
      const json = await res.json();
      if (json.success) setAccessRequests(json.data);
    } catch (e) {
      console.error("Fetch access requests failure", e);
    }
  };

  const fetchUserAccounts = async () => {
    try {
      const res = await fetch("/api/admin/accounts");
      const json = await res.json();
      if (json.success) setUserAccounts(json.data);
    } catch (e) {
      console.error("Fetch registered accounts failure", e);
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    await Promise.all([
      fetchQuotes(),
      fetchSubs(),
      fetchAccessRequests(),
      fetchUserAccounts()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    // If we have sessionStorage indicating we are logged in, auto authenticate
    const savedAuth = sessionStorage.getItem("admin_authenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllAdminData();
    }
  }, [isAuthenticated]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!adminUsername || !adminPassword) {
      setAuthError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminUsername, password: adminPassword })
      });
      const json = await res.json();
      if (res.ok && json.success && json.role === "admin") {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_authenticated", "true");
      } else {
        setAuthError(json.message || "Invalid credentials. Use water.admin / tight.62568");
      }
    } catch (err) {
      setAuthError("Auth routing offline. Verify server is listening on port 3000.");
    }
  };

  const handleUpdateQuoteStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/admin/quotes/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const json = await res.json();
      if (json.success) {
        showActionMsg(`Quote status verified: "${nextStatus}"`);
        fetchQuotes();
      }
    } catch (e) {
      console.error("Update quote status failure", e);
    }
  };

  const handleUpdateSubStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/admin/subcontractors/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const json = await res.json();
      if (json.success) {
        showActionMsg(`Crew status updated: "${nextStatus}"`);
        fetchSubs();
      }
    } catch (e) {
      console.error("Update sub failure", e);
    }
  };

  const handleGenerateToken = async (id: string, assignedJob: string, portalType: "client" | "crew") => {
    try {
      const res = await fetch(`/api/admin/portal-requests/${id}/generate-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedJob, portalType })
      });
      const json = await res.json();
      if (json.success) {
        // Dispatched alert simulation
        showActionMsg(`Invite Token Generated successfully. Dispatch notice queued to renee@savvytechpartners.com.`);
        loadAllAdminData();
      }
    } catch (e) {
      console.error("Generate token err", e);
    }
  };

  const handleDirectUserCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName || !directEmail || !directPassword) {
      showActionMsg("Direct provisioning fields required.");
      return;
    }

    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: directName,
          email: directEmail,
          password: directPassword,
          portalType: directType,
          assignedJob: directJob
        })
      });
      const json = await res.json();
      if (json.success) {
        showActionMsg(`Spawned new account directly for: ${directName}`);
        setDirectName("");
        setDirectEmail("");
        fetchUserAccounts();
      }
    } catch (e) {
      console.error("Direct spawn err", e);
    }
  };

  const handleUpdateUserJob = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/accounts/${id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedJob: editJobTitle })
      });
      const json = await res.json();
      if (json.success) {
        showActionMsg("Attached job metadata updated.");
        setEditingUserId(null);
        fetchUserAccounts();
      }
    } catch (err) {
      console.error("Update job assignment error", err);
    }
  };

  const handleDeactivateAccount = async (id: string) => {
    if (!window.confirm("Are you sure you want to revoke portal access for this account?")) return;
    try {
      const res = await fetch(`/api/admin/accounts/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        showActionMsg("Portal account revoked and deactivated cleanly.");
        fetchUserAccounts();
      }
    } catch (e) {
      console.error("Deactivate account err", e);
    }
  };

  const handleTriggerAIEstimate = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/ai-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType: aiProjectType,
          length: aiLength,
          width: aiWidth,
          constraints: aiConstraints
        })
      });
      const json = await res.json();
      if (json.success) {
        setAiResult(json.result);
      } else {
        setAiResult(`AI Generation Error: ${json.message}`);
      }
    } catch (err) {
      setAiResult("Offline: Validate host connectivity to Gemini gateway.");
    } finally {
      setAiLoading(false);
    }
  };

  const showActionMsg = (text: string) => {
    setActionMessage(text);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
  };

  // Helper function to render simple markdown sections as HTML blocks
  const renderMarkdownText = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("###")) {
        return <h4 key={i} className="text-sm font-bold text-slate-100 font-sans tracking-tight mt-4 first:mt-0 border-b border-slate-800 pb-1 pb-1.5">{line.replace("###", "")}</h4>;
      }
      if (line.startsWith("####")) {
        return <h5 key={i} className="text-xs font-extrabold text-blue-600 font-sans uppercase tracking-wider mt-3">{line.replace("####", "")}</h5>;
      }
      if (line.startsWith("**")) {
        return <p key={i} className="text-xs font-sans text-slate-200">{line.replace(/\*\*/g, "")}</p>;
      }
      if (line.startsWith("-")) {
        return (
          <li key={i} className="text-xs text-slate-400 font-sans list-disc list-inside ml-2 leading-relaxed">
            {line.replace("-", "").replace(/\*\*/g, "")}
          </li>
        );
      }
      if (line.trim() === "***") {
        return <hr key={i} className="border-slate-850 my-3" />;
      }
      return line.trim() ? <p key={i} className="text-xs text-slate-400 leading-relaxed font-sans">{line}</p> : <div key={i} className="h-1.5" />;
    });
  };

  const outerServices = [
    {
      name: "GlassFloor Timeline Portal",
      role: "Client Project Management",
      url: "/login",
      desc: "Our clever customized Client Portal. Allows active project clients to monitor chronological excavation timelines, check selections, and see field updates.",
      isClever: true
    },
    {
      name: "IronTread Dispatch Portal",
      role: "Subcontractor Dispatch & Logs",
      url: "/login",
      desc: "Our bespoke Crew Terminal. Allows structural crews, plumbers, and sub-grade installers to stamp daily task checklists, clock timesheets, and log progress photos.",
      isClever: true
    },
    {
      name: "CoConstruct Portal Launcher",
      role: "Residential PM",
      url: "https://www.coconstruct.com/",
      desc: "Existing integrated platform served for custom residential build schedules."
    },
    {
      name: "Buildertrend Logging",
      role: "Subcontractor PM",
      url: "https://buildertrend.com/",
      desc: "Existing integrated commercial contractor dashboard."
    }
  ];

  // If Not Authenticated, Render Admin Lock Login screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 animate-fadeIn font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-blue-600/10 rounded-full border border-blue-600/20 flex items-center justify-center text-blue-600 mx-auto">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Supreme ERP Command</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
            Authorized Watertight Administrative access ONLY. Enforces credentials lock on pending registrations, schedules, and active estimators.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-mono text-center rounded-xl font-medium">
            {authError}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-wider uppercase text-slate-500 font-bold block">Username Code</label>
            <input
              type="text"
              required
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 dark:bg-slate-950 dark:border-slate-850 rounded-lg px-4 py-2.5 text-slate-800 dark:text-slate-105 font-mono focus:outline-none focus:border-blue-600"
              placeholder="e.g. water.admin"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-wider uppercase text-slate-500 font-bold block">Terminal Pass-key</label>
            <input
              type="password"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 dark:bg-slate-950 dark:border-slate-850 rounded-lg px-4 py-2.5 text-slate-800 dark:text-slate-105 focus:outline-none focus:border-blue-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer font-extrabold uppercase mt-2 shadow-md hover:shadow-lg"
          >
            Authenticate Command Suite
            <ShieldCheck className="w-4 h-4 shrink-0" />
          </button>

          <span className="text-[9.5px] text-slate-500 dark:text-zinc-550 block text-center leading-normal">
            *Credentials requirement: water.admin / tight.62568
          </span>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-sans">
      
      {/* 1. Dashboard Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-xl">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">INTERNAL ERP DEPLOYED</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-slate-150 tracking-tight text-white uppercase">Watertight Command Center</h2>
          <p className="text-xs text-slate-400">
            Authorized administrator pipeline syncing bids, subcontractors, and secure client authorization ledgers.
          </p>
        </div>

        <div className="flex gap-2 shrink-0 z-10 w-full md:w-auto self-stretch md:self-auto justify-end">
          <button
            onClick={loadAllAdminData}
            className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-205 transition"
            title="Refresh database buffers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={handleLogout}
            className="text-xs font-mono font-semibold uppercase bg-red-950/20 text-red-400 hover:bg-red-900/10 border border-red-500/20 px-3.5 py-2 rounded-lg transition"
          >
            Lock Terminal
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-blue-950/40 border border-blue-400/30 text-blue-300 text-xs font-mono tracking-wider text-center rounded-xl animate-fade-in uppercase">
          {actionMessage}
        </div>
      )}

      {/* Tabs list selector */}
      <div className="flex border-b border-slate-850 gap-4 overflow-x-auto pb-1 text-xs font-sans">
        <button
          onClick={() => setActiveTab("quotes")}
          className={`pb-2.5 px-2 font-bold transition-all relative shrink-0 ${
            activeTab === "quotes" 
              ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Active Estimates & Leads ({quotes.length})
        </button>

        <button
          onClick={() => setActiveTab("subcontractors")}
          className={`pb-2.5 px-2 font-bold transition-all relative shrink-0 ${
            activeTab === "subcontractors" 
              ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Crew Roster ({subcontractors.length})
        </button>

        <button
          onClick={() => setActiveTab("accounts")}
          className={`pb-2.5 px-2 font-bold transition-all relative shrink-0 ${
            activeTab === "accounts" 
              ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Account Management
        </button>

        <button
          onClick={() => setActiveTab("ai-estimator")}
          className={`pb-2.5 px-2 font-bold transition-all relative shrink-0 ${
            activeTab === "ai-estimator" 
              ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          ✨ AI Estimator Workspace
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={`pb-2.5 px-2 font-bold transition-all relative shrink-0 ${
            activeTab === "integrations" 
              ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Clever & PM Integrations
        </button>
      </div>

      {/* TAB PANEL 1: QUOTES */}
      {activeTab === "quotes" && (
        <div className="space-y-4">
          {quotes.length === 0 ? (
            <div className="text-center py-12 bg-slate-950 border border-slate-850 rounded-2xl text-slate-500 font-mono text-xs uppercase uppercase">
              No active lead queries on the spooler.
            </div>
          ) : (
            quotes.map((quote) => (
              <div key={quote.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 bg-blue-950/20 border border-blue-600/20 px-2 py-0.5 rounded uppercase">
                      ID: {quote.id.substring(0, 11)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Spooled: {new Date(quote.submittedAt).toLocaleDateString()}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded font-mono border ${
                      quote.status === "Pending" ? "bg-blue-500/10 text-blue-300 border-blue-500/20" :
                      quote.status === "Site Visit Scheduled" ? "bg-indigo-400/10 text-indigo-300 border-indigo-400/20" :
                      quote.status === "Approved" ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20" :
                      "bg-slate-800 text-slate-300 border-slate-700"
                    }`}>
                      {quote.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-1.5">
                      {quote.name}
                      <span className="text-xs font-normal text-slate-500 font-mono">({quote.address})</span>
                    </h3>
                    
                    <div className="flex gap-4 text-xs font-mono text-slate-400 pt-1 flex-wrap">
                      <a href={`mailto:${quote.email}`} className="flex items-center gap-1 hover:text-blue-500">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        {quote.email}
                      </a>
                      <a href={`tel:${quote.phone}`} className="flex items-center gap-1 hover:text-blue-500">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        {quote.phone}
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-lg border border-slate-850">
                    <div>
                      <span className="text-[10px] font-mono text-slate-550 block font-bold">PROJECT TYPE</span>
                      <span className="text-xs font-semibold text-slate-205 uppercase tracking-wide">{quote.projectType.replace("_", " ")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-550 block font-bold">FOOTPRINT</span>
                      <span className="text-xs font-semibold text-slate-205 font-mono">{quote.length} x {quote.width} FT</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-550 block font-bold">SITE ACCESS</span>
                      <span className="text-xs font-semibold text-slate-205 uppercase font-mono">{quote.accessRestriction}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-550 block font-bold">DEMO TYPE</span>
                      <span className="text-xs font-semibold text-slate-205 uppercase font-mono">{quote.existingDemo}</span>
                    </div>
                  </div>

                  {quote.notes && (
                    <div className="text-xs text-slate-400 font-sans leading-relaxed border-l-2 border-slate-850 pl-3.5 italic">
                      &ldquo;{quote.notes}&rdquo;
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 bg-slate-955/40 p-4 border border-slate-850 rounded-xl space-y-3 lg:self-stretch flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-550 block font-bold uppercase">Estimated SFT range</span>
                    <span className="text-xl font-mono font-extrabold text-blue-600">{quote.estimatedRange || "Not calculated"}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Modify Status</span>
                    <div className="grid grid-cols-2 gap-1.5 text-sans">
                      <button
                        onClick={() => handleUpdateQuoteStatus(quote.id, "Site Visit Scheduled")}
                        className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-[11px] text-slate-350 hover:text-slate-100 transition font-medium"
                      >
                        📅 Book Inspection
                      </button>
                      <button
                        onClick={() => handleUpdateQuoteStatus(quote.id, "Approved")}
                        className="p-2 bg-slate-900 border border-slate-850 hover:border-emerald-500/30 rounded text-[11px] text-slate-350 hover:text-[#22c55e] transition font-bold"
                      >
                        ✅ Approve Proposal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB PANEL 2: SUBCONTRACTORS */}
      {activeTab === "subcontractors" && (
        <div className="space-y-4">
          {subcontractors.length === 0 ? (
            <div className="text-center py-12 bg-slate-950 border border-slate-850 rounded-2xl text-slate-500 font-mono text-xs uppercase uppercase">
              No subcontractor applications.
            </div>
          ) : (
            subcontractors.map((sub) => (
              <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#22c55e] bg-slate-955 px-2 py-0.5 rounded border border-slate-850 uppercase">
                      CREW ID: {sub.id.substring(0, 11)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Applied: {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2 py-0.5 rounded">
                    {sub.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-1.5 flex-wrap">
                      {sub.businessName}
                      <span className="text-[10px] font-mono font-medium text-blue-500 bg-blue-950 px-2 py-0.5 rounded border border-blue-600/15">
                        {sub.partnerType || "Business Partner"}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Contact: {sub.contactName}</p>
                    <div className="flex gap-4 text-xs font-mono text-slate-550 pt-1">
                      <a href={`mailto:${sub.email}`} className="flex items-center gap-1 hover:text-blue-500">
                        <Mail className="w-3.5 h-3.5" />
                        {sub.email}
                      </a>
                      <a href={`tel:${sub.phone}`} className="flex items-center gap-1 hover:text-blue-500">
                        <Phone className="w-3.5 h-3.5" />
                        {sub.phone}
                      </a>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 text-xs grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-550 block font-bold">CAPACITY</span>
                      <span className="text-xs font-semibold text-slate-205">{sub.crewSize} Operator(s)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-550 block font-bold">INSURANCE LIMIT</span>
                      <span className="text-xs font-semibold text-blue-600 font-mono">{sub.insuranceLimit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                  <button
                    onClick={() => handleUpdateSubStatus(sub.id, "Interview Scheduled")}
                    className="p-2 bg-slate-905 border border-slate-800 rounded font-bold text-xs hover:border-slate-700 text-slate-300"
                  >
                    📅 Schedule Interview
                  </button>
                  <button
                    onClick={() => handleUpdateSubStatus(sub.id, "Approved Vendor")}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-slate-950 rounded font-bold text-xs transition"
                  >
                    Onboard Vendor Roster
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB PANEL 3: ACCOUNT MANAGEMENT & PENDING REGISTER FLOW */}
      {activeTab === "accounts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-sans">
          
          {/* List pending requests & generate tokens (6 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 space-y-5 shadow-lg">
              <div className="border-b border-slate-800 pb-3 pb-4">
                <h3 className="text-sm font-display font-extrabold text-slate-200">Pending Secure Portal Registrations</h3>
                <p className="text-[11px] text-slate-500">
                  Client & Crew access submissions awaiting authorization codes. Form submissions dispatch notices to Renee.
                </p>
              </div>

              {accessRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-mono text-[11px] uppercase border border-dashed border-slate-800 rounded-lg">
                  No active pending access requests in buffer stack.
                </div>
              ) : (
                <div className="space-y-4">
                  {accessRequests.map((req) => (
                    <div key={req.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3.5">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-600 font-bold uppercase border border-blue-600/10">
                            {req.portalType.toUpperCase()} REQ
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(req.submittedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 border rounded ${
                          req.tokenStatus === "pending" ? "bg-blue-950/20 text-blue-500 border-blue-600/10 animate-pulse" :
                          "bg-emerald-950/20 text-[#34d399] border-[#059669]/10"
                        }`}>
                          {req.tokenStatus}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-205">{req.name}</h4>
                        <p className="text-[10.5px] text-slate-450 font-mono font-normal">
                          Email: {req.email} • Phone: {req.phone}
                        </p>
                        {req.comments && (
                          <div className="p-2 bg-slate-900 border border-slate-850 rounded text-slate-400 leading-normal italic text-[11px] font-sans mt-1.5">
                            &ldquo;{req.comments}&rdquo;
                          </div>
                        )}
                      </div>

                      {req.tokenStatus === "pending" ? (
                        /* Generate security token controls */
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-855 space-y-2">
                          <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Authorize Profile Assignments</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div className="space-y-1.5">
                              <span className="text-[9.5px] text-slate-400 block font-mono">Assign Project Address</span>
                              <input
                                type="text"
                                id={`assign-job-${req.id}`}
                                defaultValue={req.comments?.substring(0, 30) || "812 W Franklin St - General Base"}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-205 font-mono text-[10.5px]"
                                placeholder="812 W Franklin St"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[9.5px] text-slate-400 block font-mono">Assign Target Role</span>
                              <select
                                id={`assign-role-${req.id}`}
                                defaultValue={req.portalType}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-205 text-[10.5px]"
                              >
                                <option value="client">Client Portal (GlassFloor)</option>
                                <option value="crew">Crew Dispatch (IronTread)</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const jobEl = document.getElementById(`assign-job-${req.id}`) as HTMLInputElement;
                              const roleEl = document.getElementById(`assign-role-${req.id}`) as HTMLSelectElement;
                              handleGenerateToken(req.id, jobEl.value, roleEl.value as any);
                            }}
                            className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold rounded text-[11px] uppercase tracking-wide cursor-pointer transition"
                          >
                            ✓ Approve & Issue Invitation Token
                          </button>
                        </div>
                      ) : (
                        /* Token already spawned block */
                        <div className="p-3 bg-emerald-955/10 border border-emerald-500/20 rounded-lg space-y-1.5">
                          <span className="text-[10px] text-emerald-400 font-mono uppercase block font-bold">✓ Active Authorization Token Ready</span>
                          <div className="flex items-center gap-1.5 bg-slate-950 p-2 border border-slate-850 rounded">
                            <span className="text-xs font-mono font-bold text-blue-600">{req.token}</span>
                            <span className="text-[9px] text-slate-550 block font-mono ml-auto">Target: {req.assignedJob}</span>
                          </div>
                          <p className="text-[9.5px] text-slate-500 font-mono leading-normal">
                            Invite token dispatched to <strong className="text-slate-350">{req.email}</strong>. Renee notified at renee@savvytechpartners.com. User can register on homepage with registration token.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active direct provision & registered profiles lists (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Spawn Account */}
            <form onSubmit={handleDirectUserCreate} className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 space-y-4 shadow-lg text-sans">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <h3 className="text-sm font-display font-extrabold text-slate-200">Spawn Direct Profile</h3>
                <UserPlus className="w-4 h-4 text-blue-600" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono text-slate-500 block">Name</span>
                  <input
                    type="text"
                    required
                    value={directName}
                    onChange={(e) => setDirectName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    placeholder="Dan Miller"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono text-slate-500 block">Email Contact</span>
                  <input
                    type="email"
                    required
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                    placeholder="dan@millerbuilt.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-mono text-slate-500 block">Assigned Role</span>
                    <select
                      value={directType}
                      onChange={(e) => setDirectType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-205 focus:outline-none text-[10.5px]"
                    >
                      <option value="client">Client Portal</option>
                      <option value="crew">Field Crew</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-mono text-slate-500 block">Set Password</span>
                    <input
                      type="text"
                      required
                      value={directPassword}
                      onChange={(e) => setDirectPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-205 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono text-slate-500 block">Attach Job/Project Location</span>
                  <select
                    value={directJob}
                    onChange={(e) => setDirectJob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-205 focus:outline-none text-[10.5px]"
                  >
                    <option value="812 W Franklin St - Basement Encapsulation">812 W Franklin St - Encapsulation</option>
                    <option value="105 Birch Lane - Moisture Seal">105 Birch Lane - Moisture Seal</option>
                    <option value="1404 Pawnee Dr - Heavy Retaining Block">1404 Pawnee Dr - Retaining Block</option>
                    <option value="General Dispatch & Field Team">General Dispatch</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold rounded text-xs uppercase cursor-pointer"
              >
                Provision Direct Account Access
              </button>
            </form>

            {/* Registered User accounts list */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 space-y-4 shadow-lg text-sans">
              <h3 className="text-sm font-display font-extrabold text-slate-200">Active Profile Registrations ({userAccounts.length})</h3>
              
              <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                {userAccounts.map((user) => (
                  <div key={user.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-205">{user.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono tracking-tight block">{user.email}</span>
                      </div>
                      
                      <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded border uppercase ${
                        user.portalType === "client" ? "bg-blue-950 text-blue-600 border-blue-600/15" :
                        "bg-emerald-955 text-[#34d399] border-[#059669]/15"
                      }`}>
                        {user.portalType}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded border border-slate-851 text-[11px] leading-tight flex flex-col gap-1 text-sans">
                      <span className="text-[9px] text-slate-550 font-mono block">ATTACHED ACTIVE PROJECT:</span>
                      
                      {editingUserId === user.id ? (
                        <div className="flex gap-2 items-center pt-1 animate-fadeIn">
                          <input
                            type="text"
                            value={editJobTitle}
                            onChange={(e) => setEditJobTitle(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 shrink font-mono"
                          />
                          <button
                            onClick={() => handleUpdateUserJob(user.id)}
                            className="px-2 py-1 bg-emerald-600 font-bold text-slate-950 text-[10px] rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center pt-0.5">
                          <span className="text-slate-350 font-mono font-medium">{user.assignedJob}</span>
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setEditJobTitle(user.assignedJob);
                            }}
                            className="text-[9px] text-blue-600 hover:underline leading-none cursor-pointer"
                          >
                            Attach Job
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono border-t border-slate-850/80 pt-2 mt-1">
                      <span className="text-slate-600 block">Since: {new Date(user.registeredAt).toLocaleDateString()}</span>
                      
                      <button
                        onClick={() => handleDeactivateAccount(user.id)}
                        className="text-red-500 hover:text-red-400 flex items-center gap-1 font-sans text-[10px] cursor-pointer"
                        title="Deactivate core profile"
                      >
                        <Trash2 className="w-3 h-3" />
                        Revoke Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB PANEL 4: GEMINI-POWERED CO-ESTIMATOR WORKSPACE */}
      {activeTab === "ai-estimator" && (
        <div id="ai-assisted-estimator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-sans">
          
          {/* Params configuration console (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 space-y-4 shadow-lg text-sans">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-extrabold tracking-tight text-slate-105">AI Co-Estimator Workspace</h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Prompt real Google Gemini models for deep structural proposals.</p>
              </div>
              <Cpu className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-4 text-xs font-sans mt-2">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">Select Work Category</span>
                <select
                  value={aiProjectType}
                  onChange={(e) => setAiProjectType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-2 text-slate-205 focus:outline-none"
                >
                  <option value="Structural Waterproofing">Structural Crystalline Waterproofing</option>
                  <option value="Concrete Foundation Wall Pours">Concrete Foundation Wall Pours</option>
                  <option value="Basement Structural Remodel/Framing">Basement Structural Remodel/Framing</option>
                  <option value="Sub-surface Excavation & Soil Prep">Sub-surface Excavation & Soil Prep</option>
                  <option value="Masonry Bowed Wall Bracing">Masonry Bowed Wall Bracing</option>
                  <option value="Egress Escape Window Castings">Egress Escape Window Castings</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">Footprint Length (FT)</span>
                  <input
                    type="number"
                    value={aiLength}
                    onChange={(e) => setAiLength(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-200 font-mono text-center focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">Footprint Width (FT)</span>
                  <input
                    type="number"
                    value={aiWidth}
                    onChange={(e) => setAiWidth(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-200 font-mono text-center focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-slate-500 font-mono text-[11px] block">
                Calculated SFT Area: <strong className="text-blue-600 font-bold">{aiLength * aiWidth} SQFT</strong>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 block">Local Impediments & Soil Profiles</span>
                <textarea
                  rows={4}
                  value={aiConstraints}
                  onChange={(e) => setAiConstraints(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-850 rounded px-3 py-2 text-slate-205 focus:outline-none placeholder-slate-600 font-sans"
                  placeholder="Tell Gemini about site conditions, bowing degrees, specific crawlspace wetness indices..."
                />
              </div>
            </div>

            <button
              onClick={handleTriggerAIEstimate}
              disabled={aiLoading}
              className={`w-full py-2.5 rounded font-bold font-sans tracking-wide uppercase transition flex items-center justify-center gap-1.5 text-xs p-3 cursor-pointer ${
                aiLoading 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-500 text-slate-950 shadow-md"
              }`}
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  Analyzing Soils...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 shrink-0" />
                  Query Gemini Co-Estimator
                </>
              )}
            </button>
          </div>

          {/* AI Result display (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-blue-600" />
              Generated Structural Report Output
            </h3>

            {aiLoading ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-4 flex flex-col justify-center items-center">
                <Cpu className="w-8 h-8 text-blue-600 animate-bounce" />
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-slate-205 block uppercase">Gemini Analytical Model Processing</span>
                  <p className="text-[11px] text-slate-400 max-w-sm">
                    Structuring rebar formulas, curing times, and regional Christian County hydrostatic calculations...
                  </p>
                </div>
              </div>
            ) : aiResult ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 space-y-4 shadow-xl overflow-y-auto max-h-[580px] border-blue-600/20">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-[9.5px] font-mono text-blue-600 uppercase font-bold tracking-widest leading-none">
                      AI Structural Architect Ledger
                    </span>
                  </div>
                  <span className="text-[9.5px] text-slate-500 font-mono">
                    Model: gemini-2.5-flash
                  </span>
                </div>

                <div className="space-y-3 prose dark:prose-invert max-w-none text-slate-350">
                  {renderMarkdownText(aiResult)}
                </div>

                <div className="border-t border-slate-850 pt-3 flex justify-between items-center text-[9px] font-mono text-slate-600 block pt-4">
                  <span>© Watertight Co-Estimator Engine</span>
                  <span>Generated in ~1.4 seconds</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500 uppercase font-mono text-[10px] flex items-center justify-center h-[350px]">
                Awaiting query parameters. Configure panel variables and trigger estimator.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB PANEL 5: INTEGRATIONS */}
      {activeTab === "integrations" && (
        <div id="third-party-integrations" className="space-y-6 text-sans">
          <div className="space-y-1 bg-slate-950 p-4 border border-slate-850 rounded-xl">
            <h3 className="text-xs font-bold uppercase text-slate-205">Connected Project Management Interfaces</h3>
            <p className="text-[11px] text-slate-400">Launch internal custom timeline simulators or open legacy construction services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {outerServices.map((serv, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md hover:border-slate-700 transition space-y-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-widest text-slate-505 uppercase">{serv.role}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-550" />
                  </div>
                  <h3 className={`text-sm font-display font-extrabold ${serv.isClever ? "text-blue-600" : "text-slate-105"}`}>{serv.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">{serv.desc}</p>
                </div>

                <a
                  href={serv.url}
                  id={`btn-ext-lnk-${index}`}
                  className={`group flex items-center justify-center gap-1.5 border hover:border-slate-750 text-[10.5px] font-mono font-semibold py-2 rounded transition cursor-pointer ${
                    serv.isClever 
                      ? "bg-blue-600/10 border-blue-600/25 hover:border-blue-500 text-blue-600" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850"
                  }`}
                >
                  {serv.isClever ? "Test Portal Access" : "Launch Platform Access"}
                  <ArrowRight className="w-3 h-3 text-slate-550 group-hover:translate-x-0.5 transition" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
