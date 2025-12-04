
import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Check } from 'lucide-react';
import { CrmRecord, Language, AppOptions } from '../types';
import { TRANSLATIONS } from '../constants';

interface EditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: CrmRecord | null;
  options: AppOptions;
  language: Language;
  onSave: (id: string, updates: Partial<CrmRecord>) => void;
}

const EditRecordModal: React.FC<EditRecordModalProps> = ({
  isOpen, onClose, record, options, language, onSave
}) => {
  const [formData, setFormData] = useState<Partial<CrmRecord>>({});
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (record) {
      setFormData({ ...record });
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const handleChange = (field: keyof CrmRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(record.id, formData);
    onClose();
  };

  const InputField = ({ label, value, onChange, readOnly = false }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-400 uppercase">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className={`bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  );

  const SelectField = ({ label, value, optionsList, onChange, readOnly = false }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-400 uppercase">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        className={`bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="">- Select -</option>
        {optionsList.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const MultiSelectField = ({ label, values = [], optionsList, onChange }: any) => {
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val && !values.includes(val)) {
        onChange([...values, val]);
      }
    };

    const removeValue = (valToRemove: string) => {
      onChange(values.filter((v: string) => v !== valToRemove));
    };

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-400 uppercase">{label}</label>
        <div className="bg-slate-950 border border-slate-700 rounded-lg p-2 min-h-[42px] flex flex-wrap gap-2">
           {values.map((v: string) => (
             <span key={v} className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded flex items-center gap-1 border border-slate-700">
               {v}
               <button onClick={() => removeValue(v)} className="hover:text-red-400"><X size={12}/></button>
             </span>
           ))}
           <select
             onChange={handleSelect}
             value=""
             className="bg-transparent text-sm text-slate-400 outline-none flex-1 min-w-[100px]"
           >
             <option value="">+ Add Product</option>
             {optionsList.filter((opt: string) => !values.includes(opt)).map((opt: string) => (
               <option key={opt} value={opt}>{opt}</option>
             ))}
           </select>
        </div>
      </div>
    );
  };

  const DateField = ({ label, value, onChange }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-400 uppercase flex items-center gap-1">
        <Calendar size={12} /> {label}
      </label>
      <input
        type="date"
        value={value ? value.split('T')[0] : ''}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-lg font-bold text-white">{t.editModal.title} - {record.companyName || 'New Record'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 crm-scroll">
          
          {/* Section 1: Read Only / Core Info */}
          <div className="space-y-4">
            <h3 className="text-blue-400 font-semibold border-b border-slate-800 pb-2">{t.editModal.generalInfo}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label={t.columns.id} value={formData.id} readOnly={true} />
              <InputField label={t.columns.company} value={formData.companyName} onChange={(v: string) => handleChange('companyName', v)} />
              <InputField label={t.columns.website} value={formData.website} onChange={(v: string) => handleChange('website', v)} />
              <SelectField label={t.columns.city} value={formData.city} optionsList={options.cities} onChange={(v: string) => handleChange('city', v)} />
              <InputField label={t.columns.contact} value={formData.contactPerson} onChange={(v: string) => handleChange('contactPerson', v)} />
              <InputField label={t.columns.email} value={formData.contactEmail} onChange={(v: string) => handleChange('contactEmail', v)} />
              <InputField label={t.columns.phone} value={formData.contactPhone} onChange={(v: string) => handleChange('contactPhone', v)} />
            </div>
          </div>

          {/* Section 2: Classification */}
          <div className="space-y-4">
            <h3 className="text-purple-400 font-semibold border-b border-slate-800 pb-2">{t.editModal.classification}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label={t.columns.owner} value={formData.owner} optionsList={options.owners} onChange={(v: string) => handleChange('owner', v)} />
              <SelectField label={t.columns.industry} value={formData.industry} optionsList={options.industries} onChange={(v: string) => handleChange('industry', v)} />
              {/* Multi-Select for Products */}
              <MultiSelectField label={t.columns.product} values={formData.product} optionsList={options.products} onChange={(v: string[]) => handleChange('product', v)} />
              <SelectField label={t.columns.leadSource} value={formData.leadSource} optionsList={options.leadSources} onChange={(v: string) => handleChange('leadSource', v)} />
            </div>
          </div>

          {/* Section 3: Status & Dates */}
          <div className="space-y-4">
            <h3 className="text-green-400 font-semibold border-b border-slate-800 pb-2">{t.editModal.salesStatus}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField label={t.columns.saleStage} value={formData.saleStage} optionsList={options.stages} onChange={(v: string) => handleChange('saleStage', v)} />
              <InputField label={t.columns.value} value={formData.dealValue} onChange={(v: string) => handleChange('dealValue', Number(v))} />
              <InputField label={t.columns.nextAction} value={formData.nextAction} onChange={(v: string) => handleChange('nextAction', v)} />
              <DateField label={t.columns.lastActivity} value={formData.lastActivityDate} onChange={(v: string) => handleChange('lastActivityDate', v)} />
              <DateField label={t.columns.nextActionDate} value={formData.nextActionDate} onChange={(v: string) => handleChange('nextActionDate', v)} />
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="space-y-2">
            <h3 className="text-orange-400 font-semibold border-b border-slate-800 pb-2">{t.editModal.notes}</h3>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

        </form>

        <div className="p-4 border-t border-slate-800 bg-slate-800/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">{t.actions.cancel}</button>
          <button onClick={(e) => handleSubmit(e as any)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2">
            <Save size={16} />
            {t.actions.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRecordModal;