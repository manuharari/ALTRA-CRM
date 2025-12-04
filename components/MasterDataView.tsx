
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Filter, ArrowUpDown, Search, Download, 
  Sparkles, FileText, Pencil, Plus, Lock, Mail, Globe, Loader2, Check, ChevronDown
} from 'lucide-react';
import { CrmRecord, Language, SortField, SortDirection, FilterState, AppOptions, User, Industry } from '../types';
import { TRANSLATIONS } from '../constants';
import { addLog } from '../services/logService';

interface MasterDataViewProps {
  data: CrmRecord[];
  options: AppOptions;
  language: Language;
  currentUser: User;
  onSelectRecord: (record: CrmRecord) => void;
  onDeleteRecord: (id: string) => void;
  onAnalyze: (record: CrmRecord) => void;
  onProcessOrder: (record: CrmRecord) => void;
  onEditRecord: (record: CrmRecord) => void;
  onNewRecord: () => void;
}

// Internal Multi-Select Component
const MultiSelectFilter = ({ 
  label, 
  options, 
  selectedValues, 
  onChange,
  icon: Icon
}: { 
  label: string; 
  options: string[]; 
  selectedValues: string[]; 
  onChange: (values: string[]) => void;
  icon?: React.ElementType; 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md outline-none transition-all ${selectedValues.length > 0 ? 'bg-blue-900/30 border-blue-700 text-blue-200' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'}`}
      >
        {Icon && <Icon size={14} className={selectedValues.length > 0 ? 'text-blue-400' : 'text-slate-400'} />}
        <span className="truncate max-w-[100px]">
          {selectedValues.length === 0 ? label : `${selectedValues.length} selected`}
        </span>
        <ChevronDown size={14} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">{label}</span>
            {selectedValues.length > 0 && (
              <button 
                onClick={() => onChange([])}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto crm-scroll p-1">
            {options.map(opt => (
              <div 
                key={opt} 
                onClick={() => toggleOption(opt)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-md cursor-pointer"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedValues.includes(opt) ? 'bg-blue-600 border-blue-600' : 'border-slate-500'}`}>
                  {selectedValues.includes(opt) && <Check size={10} className="text-white" />}
                </div>
                <span className="truncate">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MasterDataView: React.FC<MasterDataViewProps> = ({ 
  data, options, language, currentUser, onSelectRecord, onDeleteRecord, onAnalyze, onProcessOrder, onEditRecord, onNewRecord
}) => {
  const t = TRANSLATIONS[language];
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const exportBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportBtnRef.current && !exportBtnRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    industry: [], // Array
    leadSource: 'All',
    saleStage: 'All',
    product: 'All',
    city: [], // Array
    minDealValue: '',
    owner: [] // Array
  });
  
  const [sort, setSort] = useState<{ field: SortField, direction: SortDirection }>({
    field: 'lastActivityDate',
    direction: 'desc'
  });

  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleDeleteClick = async (id: string) => {
    setDeletingId(id);
    await onDeleteRecord(id);
    setDeletingId(null);
  };

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case Industry.Technology: return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      case Industry.Finance: return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case Industry.Healthcare: return 'bg-rose-950 text-rose-400 border-rose-800';
      case Industry.Retail: return 'bg-orange-950 text-orange-400 border-orange-800';
      case Industry.Manufacturing: return 'bg-slate-700 text-slate-300 border-slate-600';
      case Industry.Education: return 'bg-violet-950 text-violet-400 border-violet-800';
      case Industry.Construction: return 'bg-yellow-950 text-yellow-500 border-yellow-800';
      case Industry.Automotive: return 'bg-red-950 text-red-400 border-red-800';
      case Industry.Other: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
      default: return 'bg-blue-950 text-blue-400 border-blue-800';
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(record => {
      const matchesSearch = 
        record.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
        record.contactPerson.toLowerCase().includes(filters.search.toLowerCase()) ||
        record.notes.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesIndustry = filters.industry.length === 0 || filters.industry.includes(record.industry);
      const matchesLeadSource = filters.leadSource === 'All' || record.leadSource === filters.leadSource;
      const matchesStage = filters.saleStage === 'All' || record.saleStage === filters.saleStage;
      
      const productList = Array.isArray(record.product) ? record.product : [];
      const matchesProduct = filters.product === 'All' || productList.includes(filters.product);
      
      const matchesCity = filters.city.length === 0 || filters.city.some(c => record.city.toLowerCase().includes(c.toLowerCase()));
      const matchesOwner = filters.owner.length === 0 || filters.owner.some(o => record.owner.toLowerCase().includes(o.toLowerCase()));
      const matchesValue = filters.minDealValue === '' || record.dealValue >= filters.minDealValue;

      return matchesSearch && matchesIndustry && matchesLeadSource && matchesStage && matchesProduct && matchesCity && matchesOwner && matchesValue;
    }).sort((a, b) => {
      const aValue = a[sort.field] || '';
      const bValue = b[sort.field] || '';
      
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, filters, sort]);

  const canModify = (record: CrmRecord) => {
    return currentUser.role === 'admin' || record.owner === currentUser.name;
  };

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Company', 'Website', 'Contact', 'Email', 'Value', 'Stage', 'Products'];
    const rows = filteredData.map(r => [
      r.id, r.companyName, r.website, r.contactPerson, r.contactEmail, r.dealValue, r.saleStage, 
      Array.isArray(r.product) ? r.product.join(';') : ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "altra_crm_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog(currentUser, 'EXPORT_DOWNLOAD', `Downloaded CSV containing ${filteredData.length} records.`);
    setShowExportMenu(false);
  };

  const handleSendEmail = () => {
    alert(`Report generated and sent to: ${currentUser.email}`);
    addLog(currentUser, 'EXPORT_EMAIL', `Emailed export of ${filteredData.length} records to ${currentUser.email}`);
    setShowExportMenu(false);
  };

  const TableHeader = ({ field, label, className = '' }: { field: SortField, label: string, className?: string }) => (
    <th 
      className={`px-4 py-3 bg-slate-800 border-b border-slate-700 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors whitespace-nowrap sticky top-0 z-10 ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sort.field === field && (
          <ArrowUpDown size={14} className={sort.direction === 'asc' ? 'text-blue-400' : 'text-blue-400 transform rotate-180'} />
        )}
      </div>
    </th>
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg shadow-sm border border-slate-800">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-900 rounded-t-lg z-30">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder={t.search} 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full text-sm outline-none bg-transparent placeholder-slate-500 text-slate-200"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
           {/* Multi-Select Filters */}
           <MultiSelectFilter 
             label={t.columns.owner} 
             options={options.owners} 
             selectedValues={filters.owner} 
             onChange={(vals) => setFilters(prev => ({ ...prev, owner: vals }))}
           />
           
           <MultiSelectFilter 
             label={t.columns.city} 
             options={options.cities} 
             selectedValues={filters.city} 
             onChange={(vals) => setFilters(prev => ({ ...prev, city: vals }))}
           />

           <MultiSelectFilter 
             label={t.columns.industry} 
             options={options.industries} 
             selectedValues={filters.industry} 
             onChange={(vals) => setFilters(prev => ({ ...prev, industry: vals }))}
             icon={Filter}
           />

          <button onClick={onNewRecord} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm ring-1 ring-blue-500/50 ml-2">
            <Plus size={14} /> <span className="hidden sm:inline">{t.actions.newRecord}</span>
          </button>
          
          <div className="relative" ref={exportBtnRef}>
            <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm ring-1 ring-green-500/50">
              <Download size={14} /> <span className="hidden sm:inline">{t.actions.export}</span>
            </button>
            {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <button onClick={handleDownloadCSV} className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"><FileText size={14} /> Download CSV</button>
                    <button onClick={handleSendEmail} className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2 border-t border-slate-700"><Mail size={14} /> Send to Email</button>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto crm-scroll relative">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-slate-800 border-b border-slate-700 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider sticky left-0 top-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] min-w-[180px]">{t.columns.company}</th>
              <TableHeader field="id" label={t.columns.id} />
              <TableHeader field="industry" label={t.columns.industry} />
              <th className="px-4 py-3 bg-slate-800 border-b border-slate-700 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider sticky top-0 z-10 w-[40px] text-center"><Globe size={14} className="inline" /></th>
              <TableHeader field="product" label={t.columns.product} />
              <TableHeader field="leadSource" label={t.columns.leadSource} />
              <TableHeader field="contactPerson" label={t.columns.contact} />
              <TableHeader field="city" label={t.columns.city} />
              <TableHeader field="contactEmail" label={t.columns.email} />
              <TableHeader field="contactPhone" label={t.columns.phone} />
              <TableHeader field="owner" label={t.columns.owner} />
              <TableHeader field="lastActivityDate" label={t.columns.lastActivity} />
              <TableHeader field="nextAction" label={t.columns.nextAction} />
              <TableHeader field="nextActionDate" label={t.columns.nextActionDate} />
              <TableHeader field="saleStage" label={t.columns.saleStage} />
              <TableHeader field="dealValue" label={t.columns.dealValue} />
              <th className="px-4 py-3 bg-slate-800 border-b border-slate-700 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider sticky top-0 z-10 w-[200px]">{t.columns.notes}</th>
              <th className="px-4 py-3 bg-slate-800 border-b border-slate-700 sticky top-0 z-10"></th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 divide-y divide-slate-800">
            {filteredData.map((record) => (
              <tr key={record.id} className="hover:bg-slate-800 transition-colors duration-150 ease-in-out group">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-200 sticky left-0 bg-slate-900 group-hover:bg-slate-800 transition-colors duration-150 ease-in-out shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] border-r border-slate-800">{record.companyName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{record.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${getIndustryColor(record.industry)}`}>{record.industry}</span></td>
                <td className="px-4 py-3 whitespace-nowrap text-center">{record.website && (<a href={record.website.startsWith('http') ? record.website : `https://${record.website}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors" title={record.website}><Globe size={16} /></a>)}</td>
                <td className="px-4 py-3 text-sm text-slate-400 max-w-[200px]"><div className="flex flex-wrap gap-1">{Array.isArray(record.product) && record.product.length > 0 ? (record.product.map((p, idx) => (<span key={idx} className="px-1.5 py-0.5 inline-flex text-[10px] font-medium rounded bg-slate-800 text-orange-200/80 border border-slate-700 whitespace-nowrap">{p}</span>))) : (<span className="text-slate-600">-</span>)}</div></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400"><span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700">{record.leadSource}</span></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{record.contactPerson}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{record.city}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-400 hover:text-blue-300 hover:underline cursor-pointer">{record.contactEmail}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{record.contactPhone}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300 font-medium">{record.owner || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{record.lastActivityDate ? new Date(record.lastActivityDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300 max-w-[150px] truncate" title={record.nextAction}>{record.nextAction || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{record.nextActionDate ? new Date(record.nextActionDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${record.saleStage === 'Cerrado Ganado' || record.saleStage === 'Closed Won' ? 'bg-green-900/30 text-green-300 border-green-800' : record.saleStage === 'Cerrado Perdido' || record.saleStage === 'Closed Lost' ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-indigo-900/30 text-indigo-300 border-indigo-800'}`}>{record.saleStage}</span></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-slate-300">{record.dealValue > 0 ? `$${record.dealValue.toLocaleString()}` : '-'}</td>
                <td className="px-4 py-3 text-sm text-slate-500 max-w-[200px] truncate" title={record.notes}>{record.notes}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    {canModify(record) ? (
                      <>
                        <button onClick={() => onEditRecord(record)} className="text-blue-400 hover:text-blue-300 bg-blue-900/50 hover:bg-blue-800 p-1.5 rounded-md transition-colors" title={t.actions.edit}><Pencil size={16} /></button>
                        <button onClick={() => onProcessOrder(record)} className="text-emerald-400 hover:text-emerald-300 bg-emerald-900/50 hover:bg-emerald-800 p-1.5 rounded-md transition-colors" title={t.actions.processOrder}><FileText size={16} /></button>
                        <button onClick={() => handleDeleteClick(record.id)} disabled={deletingId === record.id} className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-900/30 rounded-md transition-colors">
                          {deletingId === record.id ? <Loader2 size={16} className="animate-spin" /> : <span className="text-xl leading-none">&times;</span>}
                        </button>
                      </>
                    ) : (
                      <span className="p-1.5 text-slate-600 cursor-not-allowed" title="Read Only"><Lock size={16} /></span>
                    )}
                    <button onClick={() => onAnalyze(record)} className="text-indigo-400 hover:text-indigo-300 bg-indigo-900/50 hover:bg-indigo-800 p-1.5 rounded-md transition-colors" title={t.actions.analyze}><Sparkles size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-900 border-t border-slate-800 p-2 text-xs text-slate-500 flex justify-between rounded-b-lg">
        <span>{filteredData.length} records</span>
        <span>User: {currentUser.username} ({currentUser.role})</span>
      </div>
    </div>
  );
};

export default MasterDataView;