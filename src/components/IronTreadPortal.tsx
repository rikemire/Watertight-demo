/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  MapPin, 
  Plus, 
  FileCheck, 
  Briefcase, 
  CheckCircle, 
  TrendingUp, 
  Camera, 
  Receipt, 
  FileText, 
  CloudCheck,
  RefreshCw,
  HardHat,
  Play,
  Square
} from "lucide-react";
import { JobTicket, TimeLog } from "../types";

interface IronTreadPortalProps {
  user: {
    name: string;
    email: string;
    assignedJob: string;
  };
  onLogout: () => void;
}

export default function IronTreadPortal(props: IronTreadPortalProps) {
  const { user, onLogout } = props;

  const [activeSubTab, setActiveSubTab] = useState<"tickets" | "timeclock">("tickets");
  
  // Data lists
  const [tickets, setTickets] = useState<JobTicket[]>([]);
  const [timelogs, setTimelogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Timeclock state
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<TimeLog | null>(null);
  const [clockInNotes, setClockInNotes] = useState<string>("");
  const [clockInJob, setClockInJob] = useState<string>("812 W Franklin St - Basement Encapsulation");

  // New Ticket Form state
  const [ticketJob, setTicketJob] = useState<string>("812 W Franklin St - Basement Encapsulation");
  const [ticketNotes, setTicketNotes] = useState<string>("");
  const [sftCompleted, setSftCompleted] = useState<string>("120");
  const [checkedList, setCheckedList] = useState<string[]>([]);
  
  // Image simulation uploads
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedReceipt, setAttachedReceipt] = useState<string | null>(null);

  // Available Job Options (assigned jobs)
  const jobOptions = [
    "812 W Franklin St - Basement Encapsulation",
    "105 Birch Lane - Moisture Seal",
    "1404 Pawnee Dr - Heavy Retaining Block",
    "712 S Webster St - Crystalline Wall Injection"
  ];

  // Core task checklists
  const taskChecklistOptions = [
    "Cleared base grade gravel matrices",
    "Excavated footing drainage lane",
    "Applied crystalline base coat #1",
    "Secured bowing plates to anchors",
    "Wired sump ejector emergency cutoff",
    "Pressure tested weeping tiles"
  ];

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crew/tickets");
      const json = await res.json();
      if (json.success) setTickets(json.data);
    } catch (e) {
      console.error("Tickets fetch failure", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimelogs = async () => {
    try {
      const res = await fetch("/api/crew/time");
      const json = await res.json();
      if (json.success) {
        setTimelogs(json.data);
        // Check if user is currently clocked in (i.e. has active log without clockOut)
        const active = json.data.find((l: TimeLog) => l.crewLead === user.name && !l.clockOut);
        if (active) {
          setIsClockedIn(true);
          setActiveSession(active);
        } else {
          setIsClockedIn(false);
          setActiveSession(null);
        }
      }
    } catch (e) {
      console.error("Timelogs fetch failure", e);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchTimelogs();
  }, []);

  const handleToggleCheck = (item: string) => {
    if (checkedList.includes(item)) {
      setCheckedList(checkedList.filter(i => i !== item));
    } else {
      setCheckedList([...checkedList, item]);
    }
  };

  const handleUploadSimulate = (type: "image" | "receipt") => {
    // Elegant simulation of a mobile camera/sensor trigger
    if (type === "image") {
      setAttachedImage("https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600");
      showMsg("Camera photo uploaded and hashed successfully.");
    } else {
      setAttachedReceipt("https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600");
      showMsg("Hardware merchant receipt scan completed.");
    }
  };

  const showMsg = (text: string) => {
    setStatusMsg(text);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Submit Daily Ticket
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/crew/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: ticketJob,
          crewLead: user.name,
          notes: ticketNotes,
          sftCompleted: parseFloat(sftCompleted) || 0,
          checklist: checkedList,
          imageAttached: attachedImage || undefined,
          receiptAttached: attachedReceipt || undefined
        })
      });
      const json = await res.json();
      if (json.success) {
        showMsg("✓ Daily dispatcher job ticket submitted successfully.");
        setTicketNotes("");
        setCheckedList([]);
        setAttachedImage(null);
        setAttachedReceipt(null);
        fetchTickets();
      }
    } catch (err) {
      console.error("Submit ticket err", err);
    }
  };

  // Timeclock Punch-In
  const handleClockIn = async () => {
    try {
      const res = await fetch("/api/crew/time/clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crewLead: user.name,
          jobId: clockInJob,
          clockIn: new Date().toISOString(),
          notes: clockInNotes
        })
      });
      const json = await res.json();
      if (json.success) {
        showMsg(`✓ Stamped Clock-In at ${new Date().toLocaleTimeString()}`);
        setClockInNotes("");
        fetchTimelogs();
      } else {
        showMsg(`Error: ${json.message}`);
      }
    } catch (e) {
      console.error("Clock in failure", e);
    }
  };

  // Timeclock Punch-Out
  const handleClockOut = async () => {
    if (!activeSession) return;
    try {
      const res = await fetch("/api/crew/time/clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeSession.id,
          crewLead: user.name,
          clockOut: new Date().toISOString(),
          notes: `${activeSession.notes ? activeSession.notes + " | " : ""}${clockInNotes}`.trim()
        })
      });
      const json = await res.json();
      if (json.success) {
        showMsg("✓ Punched out cleanly. Session total time computed.");
        setClockInNotes("");
        fetchTimelogs();
      } else {
        showMsg(`Error: ${json.message}`);
      }
    } catch (e) {
      console.error("Clock out failure", e);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-sans">
      {/* Port Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-xl">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#22c55e] uppercase">Active Operator terminal</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <HardHat className="w-6 h-6 text-[#22c55e]" />
            IronTread Crew Dispatch
          </h2>
          <p className="text-xs text-slate-400">
            Field Operative Lead: <strong className="text-slate-200">{user.name}</strong> • Assigned Task Base: <strong className="text-blue-600 font-mono">{user.assignedJob}</strong>
          </p>
        </div>

        <div className="flex gap-2 self-stretch md:self-auto shrink-0 z-10">
          <button
            onClick={() => {
              fetchTickets();
              fetchTimelogs();
            }}
            className="p-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-400 rounded-lg"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={onLogout}
            id="btn-crew-logout"
            className="text-xs font-mono bg-slate-950 hover:bg-slate-850 hover:text-slate-200 border border-slate-800 px-4 py-2.5 rounded-lg transition text-slate-300 cursor-pointer"
          >
            Exit Terminal
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-[#064e3b]/40 border border-[#059669]/30 text-[#34d399] text-xs font-mono text-center rounded-xl animate-bounce tracking-wide uppercase">
          {statusMsg}
        </div>
      )}

      {/* Sub Tabs Toggle */}
      <div className="flex border-b border-slate-850 gap-4 text-xs font-sans">
        <button
          onClick={() => setActiveSubTab("tickets")}
          className={`pb-3 px-3 font-semibold transition-all relative ${
            activeSubTab === "tickets" 
              ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
              : "text-slate-400 hover:text-slate-205"
          }`}
        >
          Daily Field Tickets ({tickets.length})
        </button>

        <button
          onClick={() => setActiveSubTab("timeclock")}
          className={`pb-3 px-3 font-semibold transition-all relative ${
            activeSubTab === "timeclock" 
              ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
              : "text-slate-400 hover:text-slate-205"
          }`}
        >
          ⏱ Punch Timeclock & Timesheets
        </button>
      </div>

      {/* RENDER TAB 1: DAILY FIELD TICKETS */}
      {activeSubTab === "tickets" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* New ticket form (left) */}
          <form onSubmit={handleSubmitTicket} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-lg">
            <div className="border-b border-slate-800/85 pb-4">
              <h3 className="text-sm font-display font-extrabold tracking-tight text-slate-200 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Log Daily Task Completion Receipt
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter target project details, operator checklist progress, and active materials inventory codes.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Job selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-400 block">Select Active Job Assignment</label>
                <select
                  value={ticketJob}
                  onChange={(e) => setTicketJob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-600"
                >
                  {jobOptions.map((job) => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
              </div>

              {/* SFT completed and notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-400 block">Square Footage Treated / SFT</label>
                  <input
                    type="number"
                    value={sftCompleted}
                    onChange={(e) => setSftCompleted(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-600 font-mono"
                    placeholder="e.g. 150"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 block">Operator Lead Initials</label>
                  <input
                    type="text"
                    disabled
                    value={`${user.name} (Lead)`}
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Task Checklist Group */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-400 block">Interactive Structural Checklist</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-slate-955/40 border border-slate-850 rounded-xl">
                  {taskChecklistOptions.map((option) => {
                    const isChecked = checkedList.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleToggleCheck(option)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-[11px] transition-all cursor-pointer ${
                          isChecked 
                            ? "border-emerald-500/30 bg-emerald-950/15 text-[#34d399] font-medium" 
                            : "border-slate-850 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isChecked ? "text-emerald-400" : "text-slate-600"}`} />
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes block */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-400 block">Job Notes, Backfill Specs & Field Impediments</label>
                <textarea
                  rows={3}
                  value={ticketNotes}
                  onChange={(e) => setTicketNotes(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-850 rounded-lg px-3.5 py-2.5 text-slate-205 placeholder-slate-600 focus:outline-none focus:border-blue-600 font-sans"
                  placeholder="e.g. Cleared 15 yards of silt gravel. No water intrusion under high pressure sprays. Sealed joints..."
                />
              </div>

              {/* Progress Photo and Receipt uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-dashed border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center space-y-3.5 bg-slate-950/30">
                  <div className="text-center">
                    <Camera className="w-5 h-5 text-slate-500 mx-auto" />
                    <span className="text-[10px] text-slate-400 block mt-1">Slab Progress Image</span>
                  </div>
                  {attachedImage ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-800">
                      <img src={attachedImage} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setAttachedImage(null)} className="absolute top-1 right-1 bg-slate-950/80 hover:bg-red-950 px-2 py-0.5 rounded text-[9px] text-red-400">Cancel</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUploadSimulate("image")}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-[10px] text-slate-350 rounded border border-slate-800"
                    >
                      Trigger Mobile Camera
                    </button>
                  )}
                </div>

                <div className="border border-dashed border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center space-y-3.5 bg-slate-950/30">
                  <div className="text-center">
                    <Receipt className="w-5 h-5 text-slate-500 mx-auto" />
                    <span className="text-[10px] text-slate-400 block mt-1">Merchant Materials Receipt</span>
                  </div>
                  {attachedReceipt ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-800">
                      <img src={attachedReceipt} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setAttachedReceipt(null)} className="absolute top-1 right-1 bg-slate-950/80 hover:bg-red-950 px-2 py-0.5 rounded text-[9px] text-red-400">Cancel</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUploadSimulate("receipt")}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-[10px] text-slate-350 rounded border border-slate-800"
                    >
                      Trigger Receipt Scanner
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-850">
              <span className="text-[10px] text-slate-550 block leading-tight font-mono">
                *Saves dynamic telemetry to central Watertight ERP dashboard in real-time.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-950 font-sans font-bold rounded-lg text-xs tracking-wider transition uppercase cursor-pointer"
              >
                Log Dispatch Ticket
              </button>
            </div>
          </form>

          {/* Ticket Log Spooler panel (right) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350">
              Active Job Spooler Feed ({tickets.length})
            </h3>

            {loading ? (
              <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-850 text-slate-500 text-xs">
                Syncing server telemetry buffer...
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                {tickets.map((t) => (
                  <div key={t.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3 shadow-md">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-500 block">TICKET #{t.id.substring(4, 11).toUpperCase()}</span>
                      <span className="text-blue-600 block uppercase font-bold">{t.sftCompleted} SFT Treated</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-205 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {t.jobId}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-normal">{t.notes}</p>
                    </div>

                    {t.checklist && t.checklist.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {t.checklist.map((item, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-950 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded">
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-850/80">
                      {t.imageAttached && (
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-mono uppercase block">Progress Photo:</span>
                          <img src={t.imageAttached} className="w-full h-11 object-cover rounded border border-slate-800" />
                        </div>
                      )}
                      {t.receiptAttached && (
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-mono uppercase block">Material Receipt:</span>
                          <img src={t.receiptAttached} className="w-full h-11 object-cover rounded border border-slate-800" />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 block pt-1">
                      <span>Submitted By: {t.crewLead}</span>
                      <span>{new Date(t.loggedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* RENDER TAB 2: PUNCH TIMECLOCK */}
      {activeSubTab === "timeclock" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
          
          {/* Active punch screen */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-800/85 pb-4">
                <h3 className="text-sm font-display font-extrabold tracking-tight text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#22c55e]" />
                  Active Timesheet Punch
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Log your mechanical hours to calculate wage disbursements.
                </p>
              </div>

              {isClockedIn ? (
                /* Clocked in view */
                <div className="space-y-5">
                  <div className="bg-emerald-950/20 border border-emerald-500/25 p-5 rounded-2xl text-center space-y-2 animate-pulse">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">● ACTIVE SESSION CURRENTLY RUNNING</span>
                    <span className="text-3xl font-mono font-extrabold text-white block">CLOCK RUNNING</span>
                    <span className="text-[11px] text-slate-350 block">Job Location: <strong>{activeSession?.jobId}</strong></span>
                    <p className="text-[10px] text-slate-500 font-mono mt-2">Started: {new Date(activeSession?.clockIn || "").toLocaleTimeString()}</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 block">End-of-shift Checklist/Notes</label>
                    <textarea
                      rows={2}
                      value={clockInNotes}
                      onChange={(e) => setClockInNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600 text-slate-200"
                      placeholder="e.g. Masonry core pours completed. Leaving drywells covered..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleClockOut}
                    className="w-full py-3 bg-red-650 hover:bg-red-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                  >
                    <Square className="w-4 h-4 shrink-0 fill-current" />
                    Punch Out (Save Hours)
                  </button>
                </div>
              ) : (
                /* Clocked out view */
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl text-center space-y-1 text-slate-500">
                    <span className="text-xs block">You are currently clocked out.</span>
                    <span className="text-[10px] font-mono block text-slate-600">Secure GPS Geo-mesh activated on Christian County.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 block">Target Job for Shift</label>
                    <select
                      value={clockInJob}
                      onChange={(e) => setClockInJob(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-250 focus:outline-none text-slate-200"
                    >
                      {jobOptions.map((job) => (
                        <option key={job} value={job}>{job}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-block text-slate-400 block">Task Operations Note (Optional)</label>
                    <input
                      type="text"
                      value={clockInNotes}
                      onChange={(e) => setClockInNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs focus:outline-none text-slate-200"
                      placeholder="e.g. Setting up excavator bucket..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleClockIn}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 shrink-0 fill-current" />
                    Punch In (Start Shift)
                  </button>
                </div>
              )}
            </div>

            <div className="text-[9.5px] font-mono text-slate-550 border-t border-slate-850 pt-4 mt-4">
              *All timesheets are synced within Christian County labor board local guidelines (IL-92410).
            </div>
          </div>

          {/* Timecards historical list */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350">
              Personal Timecard Archives
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[500px]">
              {timelogs.filter(l => l.crewLead === user.name).map((log) => (
                <div key={log.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex justify-between items-center gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Log ID: {log.id}</span>
                    <h4 className="text-xs font-bold text-slate-250 font-mono">{log.jobId}</h4>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      In: {new Date(log.clockIn).toLocaleTimeString()} ({new Date(log.clockIn).toLocaleDateString()})
                    </span>
                    {log.clockOut && (
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Out: {new Date(log.clockOut).toLocaleTimeString()}
                      </span>
                    )}
                    {log.notes && (
                      <p className="text-[10px] text-slate-500 max-w-sm italic">&ldquo;{log.notes}&rdquo;</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {log.clockOut ? (
                      <div className="space-y-1">
                        <span className="text-lg font-mono font-extrabold text-blue-600">{log.hours} hrs</span>
                        <span className="text-[8.5px] bg-[#064e3b]/30 border border-[#059669]/20 text-[#34d399] px-2 py-0.5 rounded block text-center uppercase font-bold font-mono">Punched</span>
                      </div>
                    ) : (
                      <span className="text-[8.5px] bg-indigo-950 text-indigo-400 border border-indigo-700/20 px-2 py-0.5 rounded block uppercase font-bold animate-pulse font-mono">Running</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
