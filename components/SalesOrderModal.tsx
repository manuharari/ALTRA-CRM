
import React, { useState } from 'react';
import { X, FileText, Loader2, ArrowRight } from 'lucide-react';
import { CrmRecord, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { parseSalesOrder } from '../services/geminiService';

interface SalesOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: CrmRecord | null;
  language: Language;
  onUpdateRecord: (id: string, updates: Partial<CrmRecord>) => void;
}

const SalesOrderModal: React.FC<SalesOrderModalProps> = ({ 
  isOpen, onClose, record, language, onUpdateRecord 
}) => {
  const [orderText, setOrderText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const t = TRANSLATIONS[language];

  if (!isOpen || !record) return null;

  const handleProcess = async () => {
    if (!orderText.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await parseSalesOrder(orderText);
      
      onUpdateRecord(record.id, {
        dealValue: result.dealValue,
        saleStage: result.saleStage,
        notes: `${record.notes}\n[Auto-Order]: ${result.notes}`
        // We don't auto-update product here yet as AI logic for array matching is complex, keep existing products
      });
      
      setOrderText('');
      onClose();
    } catch (e) {
      console.error(e);
      alert('Error processing order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-2 text-white font-semibold">
            <FileText className="text-blue-400" size={20} />
            {t.orderModal.title}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-sm text-slate-300">
             <p className="mb-1"><span className="text-slate-500">{t.columns.company}:</span> {record.companyName}</p>
             <p className="text-slate-400 text-xs">{t.orderModal.instruction}</p>
          </div>

          <textarea
            value={orderText}
            onChange={(e) => setOrderText(e.target.value)}
            placeholder={t.orderModal.placeholder}
            className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
          
          <div className="flex justify-end pt-2">
            <button
              onClick={handleProcess}
              disabled={isProcessing || !orderText.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t.orderModal.processing}
                </>
              ) : (
                <>
                  {t.orderModal.process}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderModal;