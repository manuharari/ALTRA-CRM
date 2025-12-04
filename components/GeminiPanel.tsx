
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Loader2, Coffee } from 'lucide-react';
import { CrmRecord, Language, AiMode } from '../types';
import { TRANSLATIONS } from '../constants';
import { analyzeRecord, generateDailyBriefing } from '../services/geminiService';

interface GeminiPanelProps {
  isOpen: boolean;
  onClose: () => void;
  record: CrmRecord | null;
  allRecords: CrmRecord[];
  mode: AiMode;
  language: Language;
}

const GeminiPanel: React.FC<GeminiPanelProps> = ({ isOpen, onClose, record, allRecords, mode, language }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = TRANSLATIONS[language];

  // Reset state when panel opens or context changes
  useEffect(() => {
    if (isOpen) {
        setResponse('');
        setPrompt('');
        if (mode === 'briefing') {
            handleGenerateBriefing();
        } else if (mode === 'record' && record) {
             // Optional: Auto-generate on open? Let's wait for user or manual trigger for records
             // But actually, a quick auto-analysis is nice.
             handleGenerateRecordAnalysis();
        }
    }
  }, [isOpen, mode, record]);

  if (!isOpen) return null;

  const handleGenerateRecordAnalysis = async () => {
    if (!record) return;
    setIsLoading(true);
    const result = await analyzeRecord(record, undefined, language);
    setResponse(result);
    setIsLoading(false);
  };

  const handleCustomPrompt = async () => {
    if (!record) return;
    setIsLoading(true);
    const result = await analyzeRecord(record, prompt, language);
    setResponse(result);
    setIsLoading(false);
  };

  const handleGenerateBriefing = async () => {
      setIsLoading(true);
      const result = await generateDailyBriefing(allRecords, language);
      setResponse(result);
      setIsLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 shadow-2xl border-l border-slate-800 transform transition-transform duration-300 z-50 flex flex-col text-slate-100">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="flex items-center gap-2">
          {mode === 'record' ? <Sparkles size={20} className="text-yellow-300" /> : <Coffee size={20} className="text-orange-300" />}
          <h2 className="font-semibold text-lg">{mode === 'record' ? t.ai.title : t.ai.briefingTitle}</h2>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900 crm-scroll">
        {mode === 'record' && record && (
            <div className="bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">{t.columns.company}</h3>
            <p className="font-medium text-white">{record.companyName}</p>
            <div className="mt-2 text-xs text-slate-400">
                <span className="block">{t.columns.saleStage}: {t.values[record.saleStage]}</span>
                <span className="block">{t.columns.value}: ${record.dealValue.toLocaleString()}</span>
            </div>
            </div>
        )}

        {isLoading ? (
             <div className="flex flex-col items-center justify-center py-10 space-y-3 text-slate-400">
                <Loader2 size={30} className="animate-spin text-blue-500" />
                <p>{t.ai.analyzing}</p>
             </div>
        ) : response ? (
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-sm">
             <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold">
                <Sparkles size={14} />
                <span>Gemini Analysis</span>
             </div>
             {response}
          </div>
        ) : (
            <div className="text-center text-slate-500 text-sm py-4">
                {t.ai.analyzing}
            </div>
        )}
      </div>

      {mode === 'record' && (
        <div className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="mb-2 text-xs text-slate-500 text-center">
            {t.ai.suggestion}
            </div>
            <div className="relative">
            <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.ai.promptPlaceholder}
                className="w-full p-3 pr-10 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm shadow-sm"
                rows={3}
            />
            <button 
                onClick={handleCustomPrompt}
                disabled={isLoading}
                className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
            >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default GeminiPanel;