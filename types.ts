
export enum Language {
  ES = 'es',
  EN = 'en',
}

// Enums updated to Spanish values as primary language
export enum Industry {
  Technology = 'Tecnología',
  Finance = 'Finanzas',
  Healthcare = 'Salud',
  Retail = 'Retail',
  Manufacturing = 'Manufactura',
  Education = 'Educación',
  Construction = 'Construcción',
  Automotive = 'Automotriz',
  Other = 'Otro',
}

export enum LeadSource {
  Website = 'Sitio Web',
  Referral = 'Referido',
  ColdCall = 'Llamada en Frío',
  Event = 'Evento',
  SocialMedia = 'Redes Sociales',
  Other = 'Otro',
}

export enum SaleStage {
  New = 'Nuevo',
  Discovery = 'Descubrimiento',
  Qualification = 'Calificación',
  Proposal = 'Propuesta',
  Negotiation = 'Negociación',
  ClosedWon = 'Cerrado Ganado',
  ClosedLost = 'Cerrado Perdido',
}

export interface CrmRecord {
  id: string;
  companyName: string;
  website: string; // New Field
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  dateAdded: string; // ISO Date
  lastActivityDate: string; // ISO Date
  nextActionDate: string; // ISO Date
  nextAction: string;
  owner: string; // Dynamic
  industry: string; // Dynamic
  leadSource: string; // Dynamic
  saleStage: string; // Dynamic
  product: string[]; // Dynamic - Multi-Select
  dealValue: number;
  notes: string;
}

export type SortField = keyof CrmRecord;
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  industry: string[]; // Changed to array for multi-select
  leadSource: string;
  saleStage: string;
  product: string;
  city: string[]; // Changed to array for multi-select
  minDealValue: number | '';
  owner: string[]; // Changed to array for multi-select
}

export type AiMode = 'record' | 'briefing';

export interface AppOptions {
  owners: string[];
  products: string[];
  industries: string[];
  stages: string[];
  leadSources: string[];
  cities: string[];
}

export type UserRole = 'admin' | 'user'; // 'user' acts as Salesman

export interface User {
  username: string;
  email: string;
  password: string; 
  name: string;
  role: UserRole;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  username: string;
  userEmail: string;
  action: 'LOGIN' | 'EXPORT_DOWNLOAD' | 'EXPORT_EMAIL' | 'DATA_UPDATE' | 'ADMIN_ACTION';
  details: string;
}