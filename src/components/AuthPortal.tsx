/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Briefcase, 
  Key, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck,
  Building 
} from "lucide-react";

interface AuthPortalProps {
  onLoginSuccess: (user: any, role: string) => void;
  onNavigateToHome: () => void;
}

export default function AuthPortal(props: AuthPortalProps) {
  const { onLoginSuccess, onNavigateToHome } = props;

  const [mode, setMode] = useState<"login" | "request" | "register">("login");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Form states - Request Access
  const [reqName, setReqName] = useState<string>("");
  const [reqEmail, setReqEmail] = useState<string>("");
  const [reqPhone, setReqPhone] = useState<string>("");
  const [reqType, setReqType] = useState<"client" | "crew">("client");
  const [reqComments, setReqComments] = useState<string>("");

  // Form states - Register
  const [regName, setRegName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regToken, setRegToken] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        onLoginSuccess(json.user, json.role);
      } else {
        setErrorMsg(json.message || "Invalid credentials.");
      }
    } catch (err) {
      setErrorMsg("Network failure. Could not contact core ERP authorization router.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/portal-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reqName,
          email: reqEmail,
          phone: reqPhone,
          portalType: reqType,
          comments: reqComments
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMsg("✓ Request registered! Form queued to renee@savvytechpartners.com with access portal token commands.");
        // Clear req forms
        setReqName("");
        setReqEmail("");
        setReqPhone("");
        setReqComments("");
      } else {
        setErrorMsg(json.message || "Could not register access query.");
      }
    } catch (e) {
      setErrorMsg("Error registering access ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: regToken,
          email: regEmail,
          password: regPassword,
          name: regName
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMsg("✓ Account created successfully! Please proceed to login with your registered email and password.");
        setRegName("");
        setRegEmail("");
        setRegToken("");
        setRegPassword("");
        setMode("login");
      } else {
        setErrorMsg(json.message || "Invalid or unregistered token.");
      }
    } catch (err) {
      setErrorMsg("Connection error registering token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-sans animate-fadeIn">
      {/* Brand logo details */}
      <div className="text-center space-y-2.5 mb-8">
        <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase block font-bold">
          Watertight Construction ERP Portal
        </span>
        <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-100 uppercase">
          Client & Crew Junction
        </h2>
        <div className="h-0.5 w-12 bg-blue-600 mx-auto" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-mono text-center rounded-xl font-medium tracking-wide">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/35 text-emerald-400 text-xs font-mono text-center rounded-xl font-medium">
            {successMsg}
          </div>
        )}

        {/* LOGIN SCREEN */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} id="form-auth-login" className="space-y-4">
            <h3 className="text-base font-bold text-slate-200">Terminal Authorization Login</h3>
            <p className="text-xs text-slate-400">
              Access the GlassFloor, IronTread, or Back-Office Command suite.
            </p>

            <div className="space-y-3 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-500 font-bold block">Terminal Identity Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-9 pr-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 font-mono"
                    placeholder="water.admin or professional@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-slate-500 font-bold block">Password credentials</label>
                  <span className="text-[10px] text-slate-500 font-mono">Any entry allowed *</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="btn-auth-signin"
              className="w-full bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-xs transition cursor-pointer shadow-md uppercase tracking-wider mt-2"
            >
              Authorize Secure Connection
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="space-y-2 border-t border-slate-850/70 pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setMode("request");
                }}
                className="text-xs text-blue-500 hover:text-blue-500 font-semibold cursor-pointer block mx-auto block mb-1"
              >
                No account? Request Terminal Access
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setMode("register");
                }}
                className="text-xs text-slate-400 hover:text-slate-350 block mx-auto cursor-pointer block"
              >
                I have an access token. Setup Profile
              </button>
            </div>
          </form>
        )}

        {/* REQUEST ACCESS FLOW */}
        {mode === "request" && (
          <form onSubmit={handleRequestSubmit} id="form-auth-request" className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setMode("login");
                }}
                className="p-1 hover:bg-slate-800 text-slate-400 rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-base font-bold text-slate-200">Request Specialized Access</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-normal">
              Clients and Field Crew leaders can request secure tokens to generate individualized dashboards.
            </p>

            <div className="space-y-3.5 text-xs text-sans">
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setReqType("client")}
                  className={`p-3 text-center rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
                    reqType === "client" 
                      ? "border-blue-600 bg-blue-950/20 text-white" 
                      : "border-slate-800 bg-slate-950/40 text-slate-400"
                  }`}
                >
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-[11px]">GlassFloor Portal</span>
                  <span className="text-[9px] text-slate-405 block">Active Build Client</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReqType("crew")}
                  className={`p-3 text-center rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
                    reqType === "crew" 
                      ? "border-emerald-500 bg-emerald-950/20 text-white" 
                      : "border-slate-800 bg-slate-950/40 text-slate-400"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-[11px]">IronTread Dispatch</span>
                  <span className="text-[9px] text-slate-405 block">Field Subcontractor</span>
                </button>
                <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Contact Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-200"
                    placeholder="Arthur Jenkins"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Authorized Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={reqEmail}
                    onChange={(e) => setReqEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-200 font-mono"
                    placeholder="arthur.client@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Phone Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={reqPhone}
                    onChange={(e) => setReqPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-200 font-mono"
                    placeholder="217-555-9011"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Project Location Address & Purpose</label>
                <textarea
                  rows={2}
                  value={reqComments}
                  onChange={(e) => setReqComments(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 leading-relaxed placeholder-slate-600"
                  placeholder="e.g. Requesting tracking on 812 W Franklin St wet crawlspace contract..."
                />
              </div>              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="btn-auth-request-submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-xs transition cursor-pointer mt-2 uppercase tracking-wider"
            >
              Submit Ticket to Renee
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-[9px] text-slate-550 block text-center leading-normal">
              *Form dispatches notification alert to renee@savvytechpartners.com. Link maps to admin dashboard for generation commands.
            </span>
          </form>
        )}

        {/* REGISTER WITH TOKEN */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} id="form-auth-register" className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setMode("login");
                }}
                className="p-1 hover:bg-slate-800 text-slate-400 rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-base font-bold text-slate-200">Complete Profile Signup</h3>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              Verify your administrative security token of format <strong className="text-blue-600 font-mono">REG-XXXXXX</strong> to finalize dashboard account.
            </p>

            <div className="space-y-3.5 text-xs text-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Secure Registration Token</label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={regToken}
                    onChange={(e) => setRegToken(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-blue-500 placeholder-slate-700 font-mono"
                    placeholder="REG-99120"
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Reviewer Hint: Use admin generated token (e.g. <strong className="text-slate-400 font-mono">REG-99120</strong> in requests tab)
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Profile Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-200"
                    placeholder="Sarah Jenkins"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Your Designated Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-200 font-mono"
                    placeholder="sarah.client@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Establish Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="btn-auth-register-submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-xs transition cursor-pointer mt-2 uppercase tracking-wider"
            >
              Verify Token & Spawn Account
            </button>
          </form>
        )}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={onNavigateToHome}
          className="text-xs text-slate-450 hover:text-slate-300 font-mono transition inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Watertight Homepage
        </button>
      </div>
    </div>
  );
}
