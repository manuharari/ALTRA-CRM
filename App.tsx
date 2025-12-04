
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Table, Globe, Coffee, Settings, LogOut, Cloud, CloudOff } from 'lucide-react';
import { CrmRecord, Language, AiMode, AppOptions, SaleStage, User } from './types';
import { TRANSLATIONS, INITIAL_OPTIONS } from './constants';
import MasterDataView from './components/MasterDataView';
import DashboardView from './components/DashboardView';
import GeminiPanel from './components/GeminiPanel';
import SalesOrderModal from './components/SalesOrderModal';
import EditRecordModal from './components/EditRecordModal';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
// Switch imports to cloudService
import { getRecords, getOptions, addOrUpdateRecord, deleteRecord, saveOptions, subscribeToChanges, addOwner } from './services/cloudService';
import { initializeAuth } from './services/authService';
import { supabase } from './src/supabaseClient';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<CrmRecord[]>([]);
  const [appOptions, setAppOptions] = useState<AppOptions>(INITIAL_OPTIONS);
  const [language, setLanguage] = useState<Language>(Language.ES);
  const [view, setView] = useState<'master' | 'dashboard' | 'admin'>('master');
  const [isLoading, setIsLoading] = useState(false);
  
  // Gemini Panel State
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [selectedRecordForAi, setSelectedRecordForAi] = useState<CrmRecord | null>(null);
  const [aiMode, setAiMode] = useState<AiMode>('record');
  
  // Sales Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [recordForOrder, setRecordForOrder] = useState<CrmRecord | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState<CrmRecord | null>(null);

  const t = TRANSLATIONS[language];
  const isOnline = !!supabase;

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
        setIsLoading(true);
        await initializeAuth();
        setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
      // Setup Realtime Subscription
      const unsubscribe = subscribeToChanges(() => {
          console.log("Realtime update received");
          loadData();
      });
      return () => { unsubscribe(); }
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    const recs = await getRecords();
    const opts = await getOptions();
    setData(recs);
    setAppOptions(opts);
    setIsLoading(false);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Auto-add owner if missing
    if (loggedInUser.name) {
        addOwner(loggedInUser.name);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm(language === Language.ES ? '¿Seguro que desea eliminar?' : 'Are you sure?')) {
      await deleteRecord(id);
      await loadData();
    }
  };

  const handleSaveRecord = async (id: string, updates: Partial<CrmRecord>) => {
    const existing = data.find(r => r.id === id);
    const updatedRecord = existing 
      ? { ...existing, ...updates } 
      : { ...updates, id } as CrmRecord;
      
    await addOrUpdateRecord(updatedRecord);
    await loadData();
  };

  const handleUpdateRecord = async (id: string, updates: Partial<CrmRecord>) => {
    await handleSaveRecord(id, updates);
  };

  const handleNewRecord = () => {
    const newId = `M-${Date.now().toString().slice(-6)}`;
    const newRecord: CrmRecord = {
      id: newId,
      companyName: '',
      website: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      city: '',
      dateAdded: new Date().toISOString().split('T')[0],
      lastActivityDate: '',
      nextActionDate: '',
      nextAction: '',
      owner: user?.name || '', 
      industry: '',
      leadSource: '',
      saleStage: SaleStage.New,
      product: [], // Array for products
      dealValue: 0,
      notes: ''
    };
    setRecordForEdit(newRecord);
    setIsEditModalOpen(true);
  };

  const handleOptionChange = async (newOptions: AppOptions) => {
    setAppOptions(newOptions); 
    await saveOptions(newOptions);
    await loadData();
  }

  const handleAnalyze = (record: CrmRecord) => {
    setSelectedRecordForAi(record);
    setAiMode('record');
    setIsAiPanelOpen(true);
  };

  const handleBriefing = () => {
    setAiMode('briefing');
    setIsAiPanelOpen(true);
  };
  
  const handleOpenProcessOrder = (record: CrmRecord) => {
    setRecordForOrder(record);
    setIsOrderModalOpen(true);
  };

  const handleOpenEdit = (record: CrmRecord) => {
    setRecordForEdit(record);
    setIsEditModalOpen(true);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === Language.ES ? Language.EN : Language.ES);
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300 border-r border-slate-800">
        <div className="p-4 lg:p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/20">A</div>
          <span className="font-bold text-xl tracking-tight hidden lg:block text-slate-100">Altra CRM</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('master')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'master' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'}`}
          >
            <Table size={20} />
            <span className="hidden lg:block font-medium">{t.navMaster}</span>
          </button>
          
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'}`}
          >
            <LayoutGrid size={20} />
            <span className="hidden lg:block font-medium">{t.navDashboard}</span>
          </button>

          <button 
            onClick={handleBriefing}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-slate-800 text-slate-400 hover:text-slate-100"
          >
            <Coffee size={20} className="text-orange-400"/>
            <span className="hidden lg:block font-medium">{t.navBriefing}</span>
          </button>

          <div className="pt-4 border-t border-slate-800/50 mt-2">
            <button 
              onClick={() => setView('admin')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'admin' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'}`}
            >
              <Settings size={20} />
              <span className="hidden lg:block font-medium">{t.navAdmin}</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
           <div className={`text-xs text-center p-1 rounded ${isOnline ? 'text-green-500 bg-green-900/20' : 'text-slate-500'}`}>
              {isOnline ? 'Cloud: Online' : 'Cloud: Offline (Local)'}
           </div>
           <button 
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
           >
             <Globe size={20} />
             <span className="hidden lg:block font-medium">{language === Language.ES ? 'English' : 'Español'}</span>
           </button>
           <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors"
           >
             <LogOut size={20} />
             <span className="hidden lg:block font-medium">Log Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-slate-950">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-100">
            {view === 'master' ? t.navMaster : view === 'dashboard' ? t.navDashboard : t.navAdmin}
          </h1>
          <div className="flex items-center gap-4">
             {isOnline ? <Cloud size={18} className="text-green-500" /> : <CloudOff size={18} className="text-slate-500" />}
             <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
               <div className="text-right hidden sm:block">
                 <div className="text-sm font-bold text-white leading-tight">{user.name}</div>
                 <div className="text-xs text-slate-400 uppercase tracking-wide">{user.role}</div>
               </div>
               <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-800">
                  {user.name.charAt(0)}
               </div>
             </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-hidden relative">
          
          {view === 'master' ? (
            <MasterDataView 
              data={data} 
              options={appOptions}
              language={language}
              currentUser={user}
              onSelectRecord={setSelectedRecordForAi}
              onDeleteRecord={handleDelete}
              onAnalyze={handleAnalyze}
              onProcessOrder={handleOpenProcessOrder}
              onEditRecord={handleOpenEdit}
              onNewRecord={handleNewRecord}
            />
          ) : view === 'dashboard' ? (
            <DashboardView 
              data={data} 
              language={language}
            />
          ) : (
            <AdminView 
              options={appOptions}
              onOptionsChange={handleOptionChange}
              language={language}
              currentUser={user}
            />
          )}
        </div>

        {/* Gemini Panel Overlay */}
        <GeminiPanel 
          isOpen={isAiPanelOpen}
          onClose={() => setIsAiPanelOpen(false)}
          record={selectedRecordForAi}
          allRecords={data}
          mode={aiMode}
          language={language}
        />

        {/* Sales Order Modal */}
        <SalesOrderModal 
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          record={recordForOrder}
          language={language}
          onUpdateRecord={handleUpdateRecord}
        />

        {/* Edit Record Modal */}
        <EditRecordModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={recordForEdit}
          options={appOptions}
          language={language}
          onSave={handleSaveRecord}
        />
      </main>
    </div>
  );
}

export default App;