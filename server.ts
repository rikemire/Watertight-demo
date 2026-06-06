/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { QuoteRequest, SubcontractorApplication, PortalAccessRequest, UserAccount, JobTicket, TimeLog } from "./src/types";
import { GoogleGenAI } from "@google/genai";


// Dynamic In-Memory Database Stores to retain submissions during server session
const quoteRequests: QuoteRequest[] = [
  {
    id: "quote-initial-1",
    name: "Arthur Pendelton",
    email: "art.pendelton@gmail.com",
    phone: "217-555-0143",
    address: "712 S Webster St, Taylorville, IL",
    projectType: "waterproofing",
    length: 30,
    width: 25,
    accessRestriction: "standard",
    existingDemo: "none",
    notes: "Basement walls have wet horizontal cracks. Needs professional evaluation.",
    status: "Pending",
    estimatedRange: "$9,450 - $11,550",
    files: [],
    submittedAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: "quote-initial-2",
    name: "Genevieve Thorne",
    email: "g.thorne@outlook.com",
    phone: "217-555-8912",
    address: "1404 Pawnee Dr, Taylorville, IL",
    projectType: "concrete_foundation",
    length: 20,
    width: 20,
    accessRestriction: "narrow",
    existingDemo: "concrete",
    notes: "Old patio concrete needs to be broken up and a brand new garage foundation slab poured. Access down the driveway is extremely tight.",
    status: "Site Visit Scheduled",
    estimatedRange: "$5,118 - $6,256",
    files: [],
    submittedAt: new Date(Date.now() - 28 * 3600000).toISOString()
  }
];

const subcontractorApplications: SubcontractorApplication[] = [
  {
    id: "sub-initial-1",
    businessName: "Lakeside Framing LLC",
    contactName: "Marcus Vance",
    phone: "217-555-7731",
    email: "marcus@lakesideframing.com",
    specialty: ["Framing Addition", "Foundation Construction"],
    crewSize: 4,
    insuranceLimit: "$2,000,000",
    hasEquipment: true,
    equipmentList: "Bobcat S70 Skid Steer, framing nailers, excavation compactors, full laser-level layout kits.",
    serviceRadius: 45,
    availability: "1-2 Weeks",
    additionalNotes: "Have bonded crews active in Christian County for over 8 years. Fully insured.",
    status: "Under Review",
    submittedAt: new Date(Date.now() - 48 * 3600000).toISOString()
  }
];

const portalAccessRequests: PortalAccessRequest[] = [
  {
    id: "req-1",
    name: "John Miller",
    email: "john@millerproperties.com",
    phone: "217-555-4029",
    portalType: "client",
    comments: "Would like to see timelines on our basement crystalline moisture block on Birch Lane.",
    token: "REG-99120",
    tokenStatus: "generated",
    assignedJob: "105 Birch Lane - Moisture Seal",
    submittedAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: "req-2",
    name: "Daniel Harris",
    email: "dan.harris@outlook.com",
    phone: "217-555-8811",
    portalType: "crew",
    comments: "Joining the masonry & crawlspace team. Ready to start logging tickets.",
    tokenStatus: "pending",
    submittedAt: new Date(Date.now() - 5 * 3600000).toISOString()
  }
];

const userAccounts: UserAccount[] = [
  {
    id: "usr-1",
    name: "Sarah Jenkins",
    email: "sarah.client@gmail.com",
    password: "password123",
    portalType: "client",
    assignedJob: "812 W Franklin St - Basement Encapsulation",
    registeredAt: new Date(Date.now() - 100 * 3600000).toISOString()
  },
  {
    id: "usr-2",
    name: "Marcus Crew",
    email: "marcus.crew@gmail.com",
    password: "password123",
    portalType: "crew",
    assignedJob: "812 W Franklin St - Basement Encapsulation",
    registeredAt: new Date(Date.now() - 120 * 3600000).toISOString()
  }
];

const jobTickets: JobTicket[] = [
  {
    id: "tkt-1",
    jobId: "812 W Franklin St - Basement Encapsulation",
    crewLead: "Marcus Crew",
    notes: "Applied first crystalline base compound. Completed drainage channel layout, drywell basin set. Wet storms did not breach.",
    sftCompleted: 350,
    checklist: ["Cleaned masonry surfaces", "Sealed core cracks", "Water tested flow paths"],
    loggedAt: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: "tkt-2",
    jobId: "105 Birch Lane - Moisture Seal",
    crewLead: "Robert Vance",
    notes: "Site excavation and general grading completed. Removed 2.5 tons of wet clay backfilled with compacted gravel.",
    sftCompleted: 600,
    checklist: ["Excavated sub-surface wall", "Configured drainage lines", "Gravel bedding layout"],
    loggedAt: new Date(Date.now() - 48 * 3600000).toISOString()
  }
];

const timeLogs: TimeLog[] = [
  {
    id: "time-1",
    crewLead: "Marcus Crew",
    jobId: "812 W Franklin St - Basement Encapsulation",
    clockIn: new Date(Date.now() - 6 * 3600000).toISOString(),
    clockOut: new Date(Date.now() - 1 * 3600000).toISOString(),
    hours: 5,
    notes: "Masonry crystalline spray prep."
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // --- API ROUTE: Get Active Data Stores (Only for Back-Office crew portal view) ---
  app.get("/api/admin/quotes", (req: Request, res: Response) => {
    res.json({ success: true, count: quoteRequests.length, data: quoteRequests });
  });

  app.get("/api/admin/subcontractors", (req: Request, res: Response) => {
    res.json({ success: true, count: subcontractorApplications.length, data: subcontractorApplications });
  });

  // --- API ROUTE: Update Quote Status (From Back Office) ---
  app.post("/api/admin/quotes/:id/status", (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const quote = quoteRequests.find(q => q.id === id);
    if (quote) {
      quote.status = status;
      return res.json({ success: true, message: `Status updated to ${status}`, data: quote });
    }
    return res.status(404).json({ success: false, message: "Quote not found" });
  });

  // --- API ROUTE: Update Subcontractor Status (From Back Office) ---
  app.post("/api/admin/subcontractors/:id/status", (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const sub = subcontractorApplications.find(s => s.id === id);
    if (sub) {
      sub.status = status;
      return res.json({ success: true, message: `Status updated to ${status}`, data: sub });
    }
    return res.status(404).json({ success: false, message: "Application not found" });
  });

  // --- API ROUTE: Login ---
  app.post("/api/login", (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Check Supreme Admin Credential
    if (email === "water.admin" && password === "tight.62568") {
      return res.json({
        success: true,
        role: "admin",
        name: "Watertight Admin Office",
        user: { id: "admin", name: "Watertight Admin", email: "water.admin", portalType: "admin", assignedJob: "All Projects" }
      });
    }

    // Check in userAccounts
    const user = userAccounts.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      return res.json({
        success: true,
        role: user.portalType,
        name: user.name,
        user: { id: user.id, name: user.name, email: user.email, portalType: user.portalType, assignedJob: user.assignedJob }
      });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials. Please verify or use access registration token." });
  });

  // --- API ROUTE: Access Request Submission ---
  app.post("/api/portal-requests", (req: Request, res: Response) => {
    const { name, email, phone, portalType, comments } = req.body;
    if (!name || !email || !phone || !portalType) {
      return res.status(400).json({ success: false, message: "Name, email, phone, and portal assignment are required." });
    }

    const newRequest: PortalAccessRequest = {
      id: `req-${Date.now()}`,
      name,
      email,
      phone,
      portalType,
      comments: comments || "",
      tokenStatus: "pending",
      submittedAt: new Date().toISOString()
    };

    portalAccessRequests.unshift(newRequest);

    res.json({
      success: true,
      message: "Access request registered successfully. Renee will review this request at renee@savvytechpartners.com.",
      request: newRequest
    });
  });

  // --- API ROUTE: Admin List Access Requests ---
  app.get("/api/admin/portal-requests", (req: Request, res: Response) => {
    res.json({ success: true, count: portalAccessRequests.length, data: portalAccessRequests });
  });

  // --- API ROUTE: Admin Action On Request (Generate Token) ---
  app.post("/api/admin/portal-requests/:id/generate-token", (req: Request, res: Response) => {
    const { id } = req.params;
    const { assignedJob, portalType } = req.body;

    const request = portalAccessRequests.find(r => r.id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Portal access request not found." });
    }

    const token = `REG-${Math.floor(100000 + Math.random() * 900000)}`;
    request.token = token;
    request.tokenStatus = "generated";
    if (assignedJob) request.assignedJob = assignedJob;
    if (portalType) request.portalType = portalType;

    res.json({
      success: true,
      message: `Access authorization generated successfully. Registration token is active.`,
      data: request
    });
  });

  // --- API ROUTE: Register (With Token) ---
  app.post("/api/register", (req: Request, res: Response) => {
    const { token, email, password, name } = req.body;
    if (!token || !email || !password || !name) {
      return res.status(400).json({ success: false, message: "Full credentials and token are required." });
    }

    const request = portalAccessRequests.find(r => r.token === token && r.tokenStatus === "generated");
    if (!request) {
      return res.status(400).json({ success: false, message: "Invalid, expired, or registered registration token." });
    }

    // Create User Account
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name,
      email: email,
      password,
      portalType: request.portalType,
      assignedJob: request.assignedJob || "General Dispatch",
      registeredAt: new Date().toISOString()
    };

    userAccounts.push(newUser);
    request.tokenStatus = "registered";

    res.json({
      success: true,
      message: "Successfully registered! You can now log into your specialized portal.",
      user: newUser
    });
  });

  // --- API ROUTE: Admin Get Registered User Accounts ---
  app.get("/api/admin/accounts", (req: Request, res: Response) => {
    res.json({ success: true, data: userAccounts });
  });

  // --- API ROUTE: Admin Create Account Directly ---
  app.post("/api/admin/accounts", (req: Request, res: Response) => {
    const { name, email, password, portalType, assignedJob } = req.body;
    if (!name || !email || !password || !portalType) {
      return res.status(400).json({ success: false, message: "Missing required fields keys to create account." });
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password,
      portalType,
      assignedJob: assignedJob || "Unassigned Project",
      registeredAt: new Date().toISOString()
    };

    userAccounts.push(newUser);
    res.json({ success: true, message: "Direct user account spawned.", data: newUser });
  });

  // --- API ROUTE: Admin Update Account Job Attachment ---
  app.post("/api/admin/accounts/:id/update", (req: Request, res: Response) => {
    const { id } = req.params;
    const { assignedJob, portalType, name, email } = req.body;

    const user = userAccounts.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    if (assignedJob !== undefined) user.assignedJob = assignedJob;
    if (portalType !== undefined) user.portalType = portalType;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    res.json({ success: true, message: "Account assignments updated.", data: user });
  });

  // --- API ROUTE: Admin Deactivate Account ---
  app.delete("/api/admin/accounts/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = userAccounts.findIndex(u => u.id === id);
    if (idx !== -1) {
      const deleted = userAccounts.splice(idx, 1);
      return res.json({ success: true, message: "Portal access removed successfully.", data: deleted[0] });
    }
    return res.status(404).json({ success: false, message: "Portal user account not found." });
  });

  // --- API ROUTE: Crew Job Tickets ---
  app.get("/api/crew/tickets", (req: Request, res: Response) => {
    res.json({ success: true, data: jobTickets });
  });

  app.post("/api/crew/tickets", (req: Request, res: Response) => {
    const { jobId, crewLead, notes, sftCompleted, checklist, imageAttached, receiptAttached } = req.body;
    if (!jobId || !crewLead) {
      return res.status(400).json({ success: false, message: "Job Assignment ID and Lead Operator are required." });
    }

    const newTicket: JobTicket = {
      id: `tkt-${Date.now()}`,
      jobId,
      crewLead,
      notes: notes || "",
      sftCompleted: parseFloat(sftCompleted) || 0,
      checklist: checklist || [],
      imageAttached,
      receiptAttached,
      loggedAt: new Date().toISOString()
    };

    jobTickets.unshift(newTicket);
    res.json({ success: true, message: "Daily field ticket stamped and logged successfully.", data: newTicket });
  });

  // --- API ROUTE: Crew Mobile Timelogs ---
  app.get("/api/crew/time", (req: Request, res: Response) => {
    res.json({ success: true, data: timeLogs });
  });

  app.post("/api/crew/time/clock", (req: Request, res: Response) => {
    const { id, crewLead, jobId, clockIn, clockOut, notes } = req.body;

    if (clockIn) {
      const activeLog = timeLogs.find(l => l.crewLead === crewLead && !l.clockOut);
      if (activeLog) {
        return res.status(400).json({ success: false, message: "Crew operator is already clocked into another active task." });
      }

      const newLog: TimeLog = {
        id: `time-${Date.now()}`,
        crewLead,
        jobId: jobId || "General Dispatch",
        clockIn: clockIn,
        notes: notes || ""
      };
      timeLogs.unshift(newLog);
      return res.json({ success: true, message: "Crew logged Clock-In timestamp successfully.", data: newLog });
    }

    if (id && clockOut) {
      const activeLog = timeLogs.find(l => l.id === id);
      if (!activeLog) {
        return res.status(404).json({ success: false, message: "Active timesheet session not found." });
      }

      activeLog.clockOut = clockOut;
      const start = new Date(activeLog.clockIn).getTime();
      const end = new Date(clockOut).getTime();
      const elapsedHours = parseFloat(((end - start) / 3600000).toFixed(2));
      activeLog.hours = elapsedHours;
      activeLog.notes = notes || activeLog.notes;

      return res.json({ success: true, message: "Timesheet Clock-Out punched and calculated successfully.", data: activeLog });
    }

    return res.status(400).json({ success: false, message: "Invalid punch operation." });
  });

  // --- API ROUTE: AI-Assisted Estimates (Gemini Workspace integration) ---
  app.post("/api/ai-estimate", async (req: Request, res: Response) => {
    const { projectType, length, width, constraints } = req.body;

    const area = (length || 30) * (width || 20);
    const typeLabel = projectType || "Waterproofing Seal";

    if (!process.env.GEMINI_API_KEY) {
      console.log("No GEMINI_API_KEY found, running mathematical heuristics generator fallback...");
      const mockAISummary = `### Watertight AI Estimator Analytical Report
**Target Location:** Taylorville, IL (Christian County Geolocation grid)
**Project Category:** ${typeLabel} (${length} ft x ${width} ft — Total Target Area: **${area} SQFT**)
**Structural Constraints Analyzed:** ${constraints || "None specified."}

***

#### 1. Engineered Material Estimates (Heuristics Grid)
- **Primary Compound / Slabs:** Premium hydrophobic deep crystalline barrier polymer sealant layers (est. 12 kits).
- **Drainage Assemblies:** Commercial corrugated weeping tiles coupled with active backfill geofabric layers (est. 110 linear feet).
- **Active Water Pump Assembly:** Cast-iron premium 1/2 HP sub-grade sump basin ejector with dynamic dual-float redundant backup sensors.
- **Estimated Material Total:** **$2,850 - $3,400** (Refining low-overhead local hardware supplier index).

#### 2. Labor Operations & Operator Allocation (Union Grade Sub-Grade Crew)
- **Pre-Grade Preparation:** Sub-surface machine excavation, high clay index extraction & grading: **12 Crew Hours**.
- **Structural Installation:** Core barrier injectants with French weeping drain integration: **16 Crew Hours**.
- **Final Curing Verification:** Dual flood-testing of drainage grids with active sump testing: **4 Crew Hours**.
- **Recommended Operator Roster:** 3 Certified sub-grade operatives overseen by 1 Field Superintendent.

#### 3. Professional Structural Advisory Note
Central Illinois glacial clay matrices are famous for holding moisture during springtime, generating up to **180 lbs/sqft** of hydrostatic lateral wall tension. Installing weeping drain networks coupled with structural plate wall tensioners will prevent horizontal concrete sheer, locking in structural stability is for 50+ Years.`;

      return res.json({ success: true, result: mockAISummary, calculatedArea: area, fallback: true });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const promptText = `You are the chief estimator for Watertight Construction Co., headquartered in Taylorville, IL (Christian County). 
We specialize in sub-grade foundation engineering, structural frame remodels, masonry bowed wall stabilizing, and crystalline waterproofing barriers.
Write a highly professional, detailed construction estimate breakdown report for the following project:
- Project Type/Category: ${typeLabel}
- Dimensions: ${length} ft length by ${width} ft width (Area: ${area} Sq. Ft.)
- Ground Constraints/Site Conditions: ${constraints || "Standard Central IL dense clay soil matrices, seasonal high water table."}

Provide standard markdown headers detailing:
1. Engineered Material Estimates (concrete yards, drainage tiles, weeping systems, sump ejectors)
2. Labor Operations & Operator Allocation (crew size and hours required)
3. Professional Structural Advisory (such as freeze-thaw cycles, clay expansions, hydrostatic pressures, local IL water grids)

Write clearly, objectively, with high structural engineering authority. Always keep recommendations dense, actionable, and formatted in clean Markdown.`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [promptText],
      });

      const resultText = aiResponse.text || "Failed to generate AI report text";
      return res.json({ success: true, result: resultText, calculatedArea: area });
    } catch (err: any) {
      console.error("Gemini API Error", err);
      return res.status(500).json({ success: false, message: "AI Engine error: " + (err.message || err) });
    }
  });  // --- API ROUTE: Estimate Cost Formula ---
  app.post("/api/estimate", (req: Request, res: Response) => {
    const { 
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
    } = req.body;

    if (!projectType || !length || !width) {
      return res.status(400).json({ success: false, message: "Missing required fields for estimation." });
    }

    // Centered around competitive Central IL pricing model
    const baseRates: Record<string, number> = {
      concrete_pad: 9.50,          // Concrete Pad base rate of $9.50/sqft
      pole_barn: 15.50,            // Pole Barn/Outbuilding base rate of $15.50/sqft
      framing_add_on: 35.00,       // Framing/Add-on base rate of $35.00/sqft
      waterproofing_repair: 12.50  // Waterproofing/Foundation Repair base rate of $12.50/sqft
    };

    const parsedLength = parseFloat(length) || 0;
    const parsedWidth = parseFloat(width) || 0;
    const area = parsedLength * parsedWidth;
    
    const basePrice = baseRates[projectType] || 12.50;
    let estimatedCost = area * basePrice;

    // 1. Intended Use Adjustments
    if (intendedUse === "vehicle") {
      estimatedCost *= 1.30; // +30% for thicker concrete pour and heavier rebar grid
    } else if (intendedUse === "living") {
      estimatedCost *= 1.15; // +15% insulation & thermal underlayers
    }

    // 2. Accessibility premium
    if (machineryAccess === "no") {
      estimatedCost *= 1.20; // +20% labor premium for compact gear/manual buggying
    }

    // Obstructions clearing
    let extraCosts = 0;
    if (existObstructions === "concrete") {
      extraCosts += (area * 4.00); // Demolition jackhammer & disposal fees
    } else if (existObstructions === "stumps") {
      extraCosts += (area * 2.00) + 400; // Stump clearing and disposal
    }

    // 3. Geotechnical Slope & Standing Water
    if (terrainSlope === "sloped") {
      extraCosts += 1200; // Grading, leveling machinery hours fee
    }
    if (standingWater === "wet") {
      estimatedCost *= 1.15; // Washed limestone gravel base, extra stabilization fabric
    }

    // 4. Logistics timeline & permits
    if (timelineGround === "immediate") {
      extraCosts += 500; // Priority rush scheduling dispatch
    }
    if (handlePermits === "yes") {
      extraCosts += 350; // Muni permit submissions drafting
    }

    // 5. Nature of Build & Property Type adjustments
    if (natureOfBuild === "remodel") {
      estimatedCost *= 1.15; // +15% for remodel tie-ins
    } else if (natureOfBuild === "addition") {
      estimatedCost *= 1.10; // +10% for structural additions
    } else if (natureOfBuild === "repair") {
      estimatedCost *= 1.05; // +5% for minor repairs
    }

    if (propertyType === "commercial") {
      estimatedCost *= 1.25; // +25% for commercial inspections & thicker specifications
    } else if (propertyType === "agricultural") {
      estimatedCost *= 0.95; // -5% simpler agricultural setup
    }

    const finalCost = estimatedCost + extraCosts;
    const lowEstimate = Math.round(finalCost * 0.9);
    const highEstimate = Math.round(finalCost * 1.1);

    res.json({
      success: true,
      range: `$${lowEstimate.toLocaleString()} - $${highEstimate.toLocaleString()}`,
      lowEstimate,
      highEstimate,
      sqftPrice: parseFloat((finalCost / area).toFixed(2)) || 0,
      totalArea: area
    });
  });

  // --- API ROUTE: Submit Lead / Quote ---
  app.post("/api/submit-quote", (req: Request, res: Response) => {
    const quoteData = req.body;
    
    if (!quoteData.name || !quoteData.email || !quoteData.phone) {
      return res.status(400).json({ success: false, message: "Contact information (Name, Email, Phone) is required." });
    }

    const newQuote: QuoteRequest = {
      id: `quote-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: quoteData.name,
      email: quoteData.email,
      phone: quoteData.phone,
      address: quoteData.address || "Taylorville, IL",
      projectType: quoteData.projectType || "concrete_pad",
      length: parseFloat(quoteData.length) || 0,
      width: parseFloat(quoteData.width) || 0,
      accessRestriction: quoteData.machineryAccess === "no" ? "narrow" : "standard",
      existingDemo: quoteData.existObstructions || "none",
      notes: quoteData.notes || "",
      status: "Pending",
      estimatedRange: quoteData.estimatedRange || "$0",
      files: quoteData.files || [],
      submittedAt: new Date().toISOString(),
      // Additional project fields
      intendedUse: quoteData.intendedUse,
      machineryAccess: quoteData.machineryAccess,
      existObstructions: quoteData.existObstructions,
      terrainSlope: quoteData.terrainSlope,
      standingWater: quoteData.standingWater,
      timelineGround: quoteData.timelineGround,
      handlePermits: quoteData.handlePermits,
      natureOfBuild: quoteData.natureOfBuild,
      propertyType: quoteData.propertyType
    };

    quoteRequests.unshift(newQuote);

    res.json({
      success: true,
      message: "Lead intake compiled and calculated successfully. Our Taylorville team will confirm via email within 24 business hours.",
      quote: newQuote
    });
  });

  // --- API ROUTE: Submit Subcontractor Application ---
  app.post("/api/subcontractor-onboard", (req: Request, res: Response) => {
    const data = req.body;

    const effectiveBizName = data.businessName || data.contactName;
    if (!effectiveBizName || !data.contactName || !data.email || !data.phone) {
      return res.status(400).json({ success: false, message: "Contact name, email, and phone are required." });
    }

    const newApp: SubcontractorApplication = {
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      partnerType: data.partnerType || "Business Partner",
      businessName: effectiveBizName,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email,
      specialty: data.specialty || [],
      crewSize: parseInt(data.crewSize) || 1,
      insuranceLimit: data.insuranceLimit || "Unknown",
      hasEquipment: !!data.hasEquipment,
      equipmentList: data.equipmentList || "",
      serviceRadius: parseInt(data.serviceRadius) || 25,
      availability: data.availability || "Immediate",
      additionalNotes: data.additionalNotes || "",
      status: "Applied",
      submittedAt: new Date().toISOString()
    };

    subcontractorApplications.unshift(newApp);

    res.json({
      success: true,
      message: "Subcontractor profile successfully uploaded. Welcome to the crew database—we will review your insurance credentials shortly.",
      application: newApp
    });
  });

  // --- API ROUTE: Simulated Secure Portal Uploads ---
  app.post("/api/upload", (req: Request, res: Response) => {
    const { name, size, type, dataUrl } = req.body;
    if (!name || !dataUrl) {
      return res.status(400).json({ success: false, message: "Invalid file payload" });
    }
    // Simulate secure file hashing and file upload. Returns success and data metadata
    res.json({
      success: true,
      file: {
        name,
        size,
        type,
        dataUrl,
        uploadedAt: new Date().toISOString(),
        id: `file-${Date.now()}`
      }
    });
  });

  // --- VITE MIDDLEWARE FOR DEVELOPMENT OR STATIC SERVING IN PRODUCTION ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Watertight CRM] Full-stack Server listening on port ${PORT}`);
  });
}

startServer();
