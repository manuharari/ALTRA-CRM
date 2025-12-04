
import { Language, Industry, LeadSource, SaleStage } from './types';

export const INITIAL_OPTIONS = {
  owners: [], // Initial Sales Reps - Empty as requested
  products: [
    'Piso Homogéneo',
    'Piso Heterogéneo',
    'Piso Conductivo',
    'Piso Técnico'
  ],
  cities: [
    'CDMX',
    'Monterrey',
    'Guadalajara',
    'Puebla',
    'Querétaro',
    'Mexicali',
    'Chihuahua',
    'Ciudad Juárez',
    'Hidalgo',
    'Saltillo',
    'Aguascalientes'
  ],
  industries: Object.values(Industry),
  stages: Object.values(SaleStage),
  leadSources: Object.values(LeadSource)
};

export const TRANSLATIONS = {
  [Language.ES]: {
    appTitle: 'Altra CRM',
    navMaster: 'Datos Maestros',
    navDashboard: 'Reportes',
    navBriefing: 'Briefing Diario',
    navAdmin: 'Admin / Config',
    aiAssistant: 'Asistente IA',
    search: 'Buscar...',
    filters: 'Filtros',
    columns: {
      id: 'ID',
      company: 'Empresa',
      website: 'Sitio Web',
      contact: 'Contacto',
      phone: 'Teléfono',
      email: 'Email',
      city: 'Ciudad',
      dateAdded: 'Fecha Alta',
      lastActivity: 'Última Actividad',
      nextAction: 'Siguiente Acción',
      nextActionDate: 'Fecha Acción',
      owner: 'Owner',
      industry: 'Industria',
      leadSource: 'Fuente Lead',
      saleStage: 'Etapa de Venta',
      product: 'Productos',
      value: 'Valor ($)',
      notes: 'Notas',
    },
    values: {
      'All': 'Todos'
    },
    actions: {
      export: 'Exportar CSV',
      newRecord: 'Nuevo Registro',
      analyze: 'Analizar (IA)',
      processOrder: 'Procesar Orden',
      edit: 'Editar',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      add: 'Agregar',
      remove: 'Quitar'
    },
    admin: {
      title: 'Configuración de Datos Maestros',
      subtitle: 'Administra las opciones disponibles en los menús desplegables.',
      manageOwners: 'Gestión de Owners (Vendedores)',
      manageProducts: 'Gestión de Productos',
      manageIndustries: 'Gestión de Industrias',
      manageStages: 'Gestión de Etapas',
      manageCities: 'Gestión de Ciudades',
      placeholder: 'Escribe nuevo valor...'
    },
    editModal: {
      title: 'Editar Registro',
      generalInfo: 'Información General',
      classification: 'Clasificación y Producto',
      salesStatus: 'Estatus y Seguimiento',
      notes: 'Notas Adicionales'
    },
    dashboard: {
      totalRecords: 'Total Registros',
      totalValue: 'Valor en Pipeline',
      conversionRate: 'Tasa de Conversión',
      salesByIndustry: 'Ventas por Industria',
      salesByStage: 'Embudo de Ventas',
      topOpportunities: 'Mejores Oportunidades'
    },
    ai: {
      title: 'Análisis Inteligente',
      briefingTitle: 'Briefing Diario de Ventas',
      promptPlaceholder: 'Ej: Redactar correo de seguimiento...',
      generate: 'Generar',
      analyzing: 'Analizando datos...',
      close: 'Cerrar',
      suggestion: 'Sugerencia: Pide un borrador de correo o estrategia de cierre.',
      briefingIntro: 'Aquí tienes tus prioridades para hoy basadas en fechas y valor:',
    },
    orderModal: {
      title: 'Procesar Orden de Venta (IA)',
      instruction: 'Pega aquí el texto de la Orden de Compra, Correo o Factura. La IA extraerá el valor y actualizará el estado.',
      placeholder: 'Ej: Confirmamos la orden por $15,000 USD para el servicio anual...',
      processing: 'Procesando...',
      process: 'Actualizar Registro',
    }
  },
  [Language.EN]: {
    appTitle: 'Altra CRM',
    navMaster: 'Master Data',
    navDashboard: 'Dashboard',
    navBriefing: 'Daily Briefing',
    navAdmin: 'Admin / Config',
    aiAssistant: 'AI Assistant',
    search: 'Search...',
    filters: 'Filters',
    columns: {
      id: 'ID',
      company: 'Company Name',
      website: 'Website',
      contact: 'Contact Person',
      phone: 'Phone',
      email: 'Email',
      city: 'City',
      dateAdded: 'Date Added',
      lastActivity: 'Last Activity',
      nextAction: 'Next Action',
      nextActionDate: 'Action Date',
      owner: 'Owner',
      industry: 'Industry',
      leadSource: 'Lead Source',
      saleStage: 'Sales Stage',
      product: 'Products',
      value: 'Value ($)',
      notes: 'Notes',
    },
    values: {
      'All': 'All'
    },
    actions: {
      export: 'Export CSV',
      newRecord: 'New Record',
      analyze: 'Analyze (AI)',
      processOrder: 'Process Order',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      add: 'Add',
      remove: 'Remove'
    },
    admin: {
      title: 'Master Data Configuration',
      subtitle: 'Manage the options available in dropdown menus.',
      manageOwners: 'Manage Owners (Sales Reps)',
      manageProducts: 'Manage Products',
      manageIndustries: 'Manage Industries',
      manageStages: 'Manage Stages',
      manageCities: 'Manage Cities',
      placeholder: 'Type new value...'
    },
    editModal: {
      title: 'Edit Record',
      generalInfo: 'General Information',
      classification: 'Classification & Product',
      salesStatus: 'Status & Follow-up',
      notes: 'Additional Notes'
    },
    dashboard: {
      totalRecords: 'Total Records',
      totalValue: 'Pipeline Value',
      conversionRate: 'Conversion Rate',
      salesByIndustry: 'Sales by Industry',
      salesByStage: 'Sales Funnel',
      topOpportunities: 'Top Opportunities'
    },
    ai: {
      title: 'Smart Analysis',
      briefingTitle: 'Daily Sales Briefing',
      promptPlaceholder: 'Ex: Draft follow-up email...',
      generate: 'Generate',
      analyzing: 'Analyzing data...',
      close: 'Close',
      suggestion: 'Suggestion: Ask for an email draft or closing strategy.',
      briefingIntro: 'Here are your top priorities for today based on dates and deal value:',
    },
    orderModal: {
      title: 'Process Sales Order (AI)',
      instruction: 'Paste the PO text, Email content, or Invoice details here. AI will extract value and update status.',
      placeholder: 'Ex: We confirm the order for $15,000 USD for the annual service...',
      processing: 'Processing...',
      process: 'Update Record',
    }
  }
};

// Re-export MOCK_DATA with real websites populated
export const MOCK_DATA = [
  // HEALTHCARE (H-Series)
  { id: 'H-001', companyName: 'IMSS', website: 'www.imss.gob.mx', contactPerson: 'Lic. Roberto Serna', contactPhone: '+52 55 5238 2700', contactEmail: 'buzon.contacto@imss.gob.mx', city: 'CDMX', industry: Industry.Healthcare },
  { id: 'H-002', companyName: 'Grupo Ángeles Servicios de Salud', website: 'www.hospitalesangeles.com', contactPerson: 'Ing. Patricia Rojas', contactPhone: '+52 55 5242 5300', contactEmail: 'contacto@saludangeles.com', city: 'CDMX', industry: Industry.Healthcare },
  { id: 'H-003', companyName: 'ISSSTE', website: 'www.gob.mx/issste', contactPerson: 'Mtro. Javier Montes', contactPhone: '+52 55 5140 9617', contactEmail: 'contacto@issste.gob.mx', city: 'CDMX', industry: Industry.Healthcare },
  { id: 'H-004', companyName: 'Hospitales Star Médica', website: 'www.starmedica.com', contactPerson: 'Arq. Gabriel Leal', contactPhone: '+52 55 5282 3000', contactEmail: 'info@starmedica.com', city: 'Puebla', industry: Industry.Healthcare },
  { id: 'H-005', companyName: 'Centro Médico ABC', website: 'www.centromedicoabc.com', contactPerson: 'Dra. Sofía Ramos', contactPhone: '+52 55 5230 8000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Healthcare },
  { id: 'H-006', companyName: 'Christus Muguerza', website: 'www.christusmuguerza.com.mx', contactPerson: 'Ing. Luis Herrera', contactPhone: '+52 81 8122 8000', contactEmail: 'info@christusmuguerza.com.mx', city: 'Monterrey', industry: Industry.Healthcare },
  { id: 'H-007', companyName: 'Médica Sur', website: 'www.medicasur.com.mx', contactPerson: 'Lic. Carolina Dávalos', contactPhone: '+52 55 5424 7200', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Healthcare },
  { id: 'H-008', companyName: 'Hospitales San Ángel Inn', website: 'www.hospitalessanangelinn.mx', contactPerson: 'Arq. Héctor Sosa', contactPhone: '+52 55 5278 2000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Healthcare },
  { id: 'H-009', companyName: 'TecSalud (ITESM)', website: 'www.tecsalud.mx', contactPerson: 'Dr. Fernando Ruiz', contactPhone: '+52 81 8888 0000', contactEmail: 'info@tecsalud.mx', city: 'Monterrey', industry: Industry.Healthcare },
  { id: 'H-10', companyName: 'Fabricantes Farmacéuticos', website: '', contactPerson: 'Ing. Raúl Montes', contactPhone: '+52 55 5284 3400', contactEmail: '(Verificar contacto)', city: 'Querétaro', industry: Industry.Healthcare },

  // EDUCATION (E-Series)
  { id: 'E-011', companyName: 'Tecnológico de Monterrey (ITESM)', website: 'www.tec.mx', contactPerson: 'Arq. Elisa Durán', contactPhone: '+52 81 8358 2000', contactEmail: 'campusinfo@itesm.mx', city: 'Monterrey', industry: Industry.Education },
  { id: 'E-012', companyName: 'UNAM', website: 'www.unam.mx', contactPerson: 'Lic. Andrea Navarro', contactPhone: '+52 55 5622 1332', contactEmail: 'contacto@unam.mx', city: 'CDMX', industry: Industry.Education },
  { id: 'E-013', companyName: 'IPN', website: 'www.ipn.mx', contactPerson: 'Ing. Manuel Olvera', contactPhone: '+52 55 5729 6000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Education },
  { id: 'E-014', companyName: 'Universidad Anáhuac', website: 'www.anahuac.mx', contactPerson: 'Arq. Brenda Ibarra', contactPhone: '+52 55 5627 0210', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Education },
  { id: 'E-015', companyName: 'UAM', website: 'www.uam.mx', contactPerson: 'Lic. Juan Vidal', contactPhone: '+52 55 5483 4000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Education },
  { id: 'E-016', companyName: 'Universidad Iberoamericana (IBERO)', website: 'www.ibero.mx', contactPerson: 'Arq. Roberto Cifuentes', contactPhone: '+52 55 5950 4000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Education },
  { id: 'E-017', companyName: 'Universidad de Guadalajara (UDG)', website: 'www.udg.mx', contactPerson: 'Lic. Martha Ruiz', contactPhone: '+52 33 3134 2200', contactEmail: '(Contactar por Web)', city: 'Guadalajara', industry: Industry.Education },
  { id: 'E-018', companyName: 'Secretaría de Educación Pública (SEP)', website: 'www.gob.mx/sep', contactPerson: 'Mtro. Efrén Castillo', contactPhone: '+52 55 3601 7500', contactEmail: '(Contactar por Licitaciones)', city: 'CDMX', industry: Industry.Education },
  { id: 'E-019', companyName: 'CAPFCE', website: 'www.inifed.gob.mx', contactPerson: 'Lic. Gustavo Flores', contactPhone: '+52 55 3601 7500', contactEmail: '(Contactar por Licitaciones)', city: 'CDMX', industry: Industry.Education },
  { id: 'E-020', companyName: 'Cadenas Grandes de Escuelas K-12', website: '', contactPerson: 'Arq. Daniela Solís', contactPhone: '+52 55 5282 3000', contactEmail: '(Investigación regional)', city: 'Guadalajara', industry: Industry.Education },

  // CONSTRUCTION (Commercial - C-Series)
  { id: 'C-021', companyName: 'Constructora Hermosillo', website: 'www.hermosillo.com', contactPerson: 'Ing. Octavio Vega', contactPhone: '+52 686 565 6500', contactEmail: 'contacto@hermosillo.com', city: 'Mexicali', industry: Industry.Construction },
  { id: 'C-022', companyName: 'Fibra Uno (FUNO)', website: 'www.funo.mx', contactPerson: 'Lic. Alejandro Salas', contactPhone: '+52 55 5251 6880', contactEmail: 'info@fibrauno.mx', city: 'CDMX', industry: Industry.Construction },
  { id: 'C-023', companyName: 'Gicsa', website: 'www.gicsa.com.mx', contactPerson: 'Arq. Viviana Méndez', contactPhone: '+52 55 5950 0000', contactEmail: 'contacto@gicsa.com.mx', city: 'CDMX', industry: Industry.Construction },
  { id: 'C-024', companyName: 'AECOM México', website: 'www.aecom.com', contactPerson: 'Ing. Felipe Cruz', contactPhone: '+52 55 5258 0880', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Construction },
  { id: 'C-025', companyName: 'Grupo Carso', website: 'www.gcarso.com.mx', contactPerson: 'Lic. Eugenio Slim', contactPhone: '+52 55 5251 3200', contactEmail: '(Contactar por RRCC)', city: 'CDMX', industry: Industry.Construction },
  { id: 'C-026', companyName: 'Gilbane Building Company', website: 'www.gilbaneco.com', contactPerson: 'Ing. Alan Miller', contactPhone: '+52 55 4738 4157', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Construction },
  { id: 'C-027', companyName: 'Interceramic', website: 'www.interceramic.com', contactPerson: 'Lic. Sandra Robles', contactPhone: '+52 614 439 4000', contactEmail: '(Contactar por Web)', city: 'Chihuahua', industry: Industry.Construction },
  { id: 'C-028', companyName: 'Desarrolladora Ruba', website: 'www.ruba.com.mx', contactPerson: 'Arq. Miguel Rivas', contactPhone: '+52 656 629 1700', contactEmail: '(Contactar por Web)', city: 'Ciudad Juárez', industry: Industry.Construction },
  { id: 'C-029', companyName: 'ProLogis Mexico', website: 'www.prologis.com', contactPerson: 'Ing. Diego Guzmán', contactPhone: '+52 55 5284 3400', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Construction },
  { id: 'C-030', companyName: 'Finsa', website: 'www.finsa.net', contactPerson: 'Arq. Elisa Rangel', contactPhone: '+52 81 8152 4200', contactEmail: 'contacto@finsa.net', city: 'Monterrey', industry: Industry.Construction },

  // AUTOMOTIVE (Vehicles - V-Series)
  { id: 'V-031', companyName: 'Mercedes-Benz Autobuses México', website: 'www.autobusesmercedesbenz.com.mx', contactPerson: 'Ing. Eduardo Solís', contactPhone: '+52 55 5267 8000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-032', companyName: 'Scania México', website: 'www.scania.com/mx', contactPerson: 'Lic. Sergio Nieto', contactPhone: '+52 55 5081 7200', contactEmail: 'contacto@scania.com.mx', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-033', companyName: 'DINA Camiones', website: 'www.dina.com.mx', contactPerson: 'Ing. Alberto Rivas', contactPhone: '+52 771 717 0100', contactEmail: '(Contactar por Web)', city: 'Hidalgo', industry: Industry.Automotive },
  { id: 'V-034', companyName: 'MAN Truck & Bus México', website: 'www.mantruckandbus.com/mx', contactPerson: 'Lic. Victoria Castro', contactPhone: '+52 55 5080 3400', contactEmail: '(Contactar por Web)', city: 'Puebla', industry: Industry.Automotive },
  { id: 'V-035', companyName: 'CAF México', website: 'www.caf.net', contactPerson: 'Ing. Rafael Linares', contactPhone: '+52 55 5336 2150', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-036', companyName: 'Alstom', website: 'www.alstom.com', contactPerson: 'Ing. Laura Nieto', contactPhone: '+52 55 5062 1200', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-037', companyName: 'Nissan México', website: 'www.nissan.com.mx', contactPerson: 'Lic. Diana Soto', contactPhone: '+52 55 5628 2700', contactEmail: '(Contactar por Prensa)', city: 'Aguascalientes', industry: Industry.Automotive },
  { id: 'V-038', companyName: 'Ferrocarriles Suburbanos', website: 'www.fsuburbanos.com', contactPerson: 'Ing. Carlos Peña', contactPhone: '+52 55 5870 0530', contactEmail: 'contacto@fsuburbanos.com.mx', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-039', companyName: 'CFE', website: 'www.cfe.mx', contactPerson: 'Arq. Elena Guzmán', contactPhone: '+52 55 5249 2000', contactEmail: 'atencion.clientes@cfe.mx', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-040', companyName: 'ASA', website: 'www.gob.mx/asa', contactPerson: 'Lic. Fernando Rico', contactPhone: '+52 55 5133 1000', contactEmail: 'contacto@asa.gob.mx', city: 'CDMX', industry: Industry.Automotive },

  // AUTOMOTIVE (Ambulances - A-Series)
  { id: 'A-041', companyName: 'Grupo El Dorado (Ambumedic)', website: '', contactPerson: 'Ing. Rodrigo Paz', contactPhone: '+52 442 216 0000', contactEmail: '(Contactar por Web)', city: 'Querétaro', industry: Industry.Automotive },
  { id: 'A-042', companyName: 'COMSA Seguridad Integral', website: 'www.comsa.com', contactPerson: 'Dr. Benjamín Ríos', contactPhone: '+52 55 5586 1630', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },
  { id: 'A-043', companyName: 'VECSA', website: 'www.vecsa.com.mx', contactPerson: 'Lic. Martha Leal', contactPhone: '+52 81 8378 1417', contactEmail: '(Contactar por Web)', city: 'Monterrey', industry: Industry.Automotive },
  { id: 'A-044', companyName: 'DESPA / Rescue Medic', website: '', contactPerson: 'Ing. David Torres', contactPhone: '+52 222 245 0000', contactEmail: '(Contactar por Web)', city: 'Puebla', industry: Industry.Automotive },
  { id: 'A-045', companyName: 'CONVITA Ambulancias', website: 'www.convita.com.mx', contactPerson: 'Lic. Andrea Pérez', contactPhone: '+52 81 8272 2679', contactEmail: 'info@convita.com.mx', city: 'Monterrey', industry: Industry.Automotive },
  { id: 'A-046', companyName: 'Quiroga Trucks', website: 'www.quirogatrucks.com', contactPerson: 'Ing. Juan Quiroga', contactPhone: '+52 844 410 0000', contactEmail: 'info@quirogatrucks.com', city: 'Saltillo', industry: Industry.Automotive },
  { id: 'A-047', companyName: 'Grupo Ferbel', website: 'www.ferbel.com.mx', contactPerson: 'Lic. Susana Robles', contactPhone: '+52 33 3617 0000', contactEmail: '(Contactar por Web)', city: 'Guadalajara', industry: Industry.Automotive },
  { id: 'A-048', companyName: 'IEV AMBULANCES', website: '', contactPerson: 'Ing. Raúl Méndez', contactPhone: '+52 55 5543 0000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },
  { id: 'A-049', companyName: 'GC MILENIO', website: '', contactPerson: 'Lic. Teresa López', contactPhone: '+52 222 296 0000', contactEmail: '(Contactar por Web)', city: 'Puebla', industry: Industry.Automotive },
  { id: 'A-050', companyName: 'Aeersa', website: 'www.aeersa.com.mx', contactPerson: 'Ing. Ricardo Vidal', contactPhone: '+52 55 5133 1000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },

  // AUTOMOTIVE (Conversions - V-Series)
  { id: 'V-051', companyName: 'Imperial Vans', website: '', contactPerson: 'Lic. Javier Solís', contactPhone: '+52 55 5580 0000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-052', companyName: 'DE BELLO VAN', website: 'www.debellovan.com.mx', contactPerson: 'Arq. Mónica Prado', contactPhone: '+52 81 8378 0000', contactEmail: '(Contactar por Web)', city: 'Monterrey', industry: Industry.Automotive },
  { id: 'V-053', companyName: 'ROYAL VAN', website: '', contactPerson: 'Lic. Elena Rangel', contactPhone: '+52 55 5590 0000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-054', companyName: 'SICSA Motorhome/Caravana', website: '', contactPerson: 'Ing. Carlos López', contactPhone: '+52 33 3810 0000', contactEmail: '(Contactar por Web)', city: 'Guadalajara', industry: Industry.Automotive },
  { id: 'V-055', companyName: 'CamperVan', website: '', contactPerson: 'Lic. Andrea Gil', contactPhone: '+52 222 230 0000', contactEmail: '(Contactar por Web)', city: 'Puebla', industry: Industry.Automotive },
  { id: 'V-056', companyName: 'Egos Vans', website: '', contactPerson: 'Ing. Ricardo Salas', contactPhone: '+52 55 5510 0000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-057', companyName: 'TSN Vans', website: 'www.tsnvans.com', contactPerson: 'Lic. Martha Chávez', contactPhone: '+52 55 5520 0000', contactEmail: '(Contactar por Web)', city: 'CDMX', industry: Industry.Automotive },
  { id: 'V-058', companyName: 'vans mexico', website: '', contactPerson: 'Arq. Roberto Vidal', contactPhone: '+52 33 3620 0000', contactEmail: '(Contactar por Web)', city: 'Guadalajara', industry: Industry.Automotive },
  { id: 'V-059', companyName: 'INNOVAN', website: 'www.innovan.com.mx', contactPerson: 'Ing. Luis Herrera', contactPhone: '+52 81 8350 0000', contactEmail: '(Contactar por Directorio)', city: 'Monterrey', industry: Industry.Automotive },
  { id: 'V-060', companyName: 'Caravanas Tawa', website: '', contactPerson: 'Lic. Sofía Ramos', contactPhone: '+52 222 240 0000', contactEmail: '(Contactar por Directorio)', city: 'Puebla', industry: Industry.Automotive },
].map((record, index) => ({
  ...record,
  owner: '', // Cleared
  leadSource: LeadSource.Other, // Cleared/Defaulted
  product: [], // Cleared to empty array
  dateAdded: new Date().toISOString().split('T')[0], // Reset to today
  lastActivityDate: '', // Cleared
  nextAction: '', // Cleared
  nextActionDate: '', // Cleared
  saleStage: SaleStage.New, // Reset to New
  dealValue: 0, // Reset to 0
  notes: '' // Cleared
}));