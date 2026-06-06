/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ProjectCategory {
  RESIDENTIAL_REMODELS = "Residential Remodels",
  COMMERCIAL_BUILDOUTS = "Commercial Build-outs",
  STRUCTURAL_WATERPROOFING = "Structural Waterproofing",
  CONCRETE_FOUNDATIONS = "Concrete Foundations"
}

export interface CaseStudy {
  id: string;
  title: string;
  category: ProjectCategory;
  location: string;
  year: string;
  challenge: string;
  solution: string;
  result: string;
  beforeImage: string;
  afterImage: string;
  beforeTitle?: string;
  afterTitle?: string;
  tags: string[];
  featured: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  location: string;
  projectType: string;
  rating: number;
  content: string;
  date: string;
  projectImage?: string;
}

export interface EstimateParams {
  projectType: string;
  length: number;
  width: number;
  accessRestriction: "standard" | "narrow";
  existingDemo: "none" | "concrete" | "lumber";
}

export interface EstimateResult {
  range: string;
  lowEstimate: number;
  highEstimate: number;
  sqftPrice: number;
  totalArea: number;
}

export interface FileUploadData {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  projectType: string;
  length: number;
  width: number;
  accessRestriction: string;
  existingDemo: string;
  notes?: string;
  status: "Pending" | "Reviewed" | "Site Visit Scheduled" | "Estimated" | "Approved" | "Archived";
  estimatedRange?: string;
  files: FileUploadData[];
  submittedAt: string;
  // New Project Calculator Parameters:
  intendedUse?: string;
  machineryAccess?: string;
  existObstructions?: string;
  terrainSlope?: string;
  standingWater?: string;
  timelineGround?: string;
  handlePermits?: string;
  natureOfBuild?: string;
  propertyType?: string;
}

export interface SubcontractorApplication {
  id: string;
  partnerType?: "Individual Contractor" | "Business Partner";
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  specialty: string[];
  crewSize: number;
  insuranceLimit: string;
  hasEquipment: boolean;
  equipmentList?: string;
  serviceRadius: number;
  availability: "Immediate" | "1-2 Weeks" | "1 Month" | "Looking for future projects";
  additionalNotes?: string;
  status: "Applied" | "Under Review" | "Interview Scheduled" | "Approved Vendor" | "Archived";
  submittedAt: string;
}

export interface PortalAccessRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  portalType: "client" | "crew";
  comments: string;
  token?: string;
  tokenStatus: "pending" | "generated" | "registered";
  assignedJob?: string;
  submittedAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string; // stored hashed/plain for mock auth
  portalType: "client" | "crew";
  assignedJob: string;
  registeredAt: string;
}

export interface JobTicket {
  id: string;
  jobId: string;
  crewLead: string;
  notes: string;
  sftCompleted: number;
  checklist: string[];
  imageAttached?: string;
  receiptAttached?: string;
  loggedAt: string;
}

export interface TimeLog {
  id: string;
  crewLead: string;
  jobId: string;
  clockIn: string;
  clockOut?: string;
  hours?: number;
  notes?: string;
}

