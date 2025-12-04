
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Settings, Users, Key, Save, RefreshCw, X, Shield, ShieldAlert, User as UserIcon, Mail, FileText, Activity, Lock, Pencil, Ban, Loader2, Database, Upload, Download } from 'lucide-react';
import { AppOptions, Language, User, AuditLog } from '../types';
import { TRANSLATIONS } from '../constants';
import { getUsers, createUser, deleteUser, changePassword, updateUser } from '../services/authService';
import { resetOptions, getOptions, createBackup, restoreBackup } from '../services/cloudService';
import { getLogs } from '../services/logService';

interface AdminViewProps {
  options: AppOptions;
  onOptionsChange: (newOptions: AppOptions) => void;
  language: Language;
  currentUser: User;
}

// ----------------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------------

interface AdminSectionProps {
  title: string;
  items: string[];
  onAdd: (val: string) => void;
  onRemove: (val: string) => void;
  placeholder: string;
}

const AdminSection: React.FC<AdminSectionProps> = ({ title, items = [], onAdd, onRemove, placeholder }) => {
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddClick = async () => {
    if (!newItem.trim()) return;
    setLoading(true);
    await onAdd(newItem);
    setNewItem('');
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddClick();
  };

  const handleRemoveClick = async (item: string) => {
    setLoading(true);
    await onRemove(item);
    setLoading(false);
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex justify-between">
        {title}
        {loading && <Loader2 size={16} className="animate-spin text-slate-500" />}
      </h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button 
          onClick={handleAddClick}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto crm-scroll pr-1">
        {(!items || items.length === 0) && (
          <p className="text-sm text-slate-500 italic text-center py-2">No items defined.</p>
        )}
        {(items || []).map((item, idx) => (
          <div key={`${item}-${idx}`} className="flex justify-between items-center bg-slate-800 px-3 py-2 rounded-md border border-slate-700 group">
            <span className="text-sm text-slate-300">{item}</span>
            <button 
              onClick={() => handleRemoveClick(item)}
              className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserManagementSection: React.FC<{ currentUser: User, onUserUpdated: () => void }> = ({ currentUser, onUserUpdated }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', name: '', role: 'user' as 'user' | 'admin' });
  const [isEditing, setIsEditing] = useState(false);
  const [originalUsername, setOriginalUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshUsers = async () => {
    const list = await getUsers();
    setUsers(list);
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '', name: '', role: 'user' });
    setIsEditing(false);
    setOriginalUsername('');
  };

  const handleSaveUser = async () => {
    if (!formData.username || !formData.password || !formData.name || !formData.email) {
      alert('Please fill in all fields.');
      return;
    }
    setLoading(true);

    if (isEditing) {
      const success = await updateUser(originalUsername, formData, currentUser);
      if (success) {
        await refreshUsers();
        resetForm();
        onUserUpdated();
      } else {
        alert('Error updating user.');
      }
    } else {
      const success = await createUser(formData, currentUser);
      if (success) {
        await refreshUsers();
        resetForm();
        onUserUpdated();
      } else {
        alert('Username or Email already exists');
      }
    }
    setLoading(false);
  };

  const handleEditClick = (user: User) => {
    setFormData({ ...user });
    setOriginalUsername(user.username);
    setIsEditing(true);
  };

  const handleDeleteUser = async (username: string) => {
    if (username === 'mharari') {
      alert('The Master Admin account cannot be deleted.');
      return;
    }
    if (confirm(`Delete user ${username}? This action cannot be undone.`)) {
      setLoading(true);
      if (await deleteUser(username, currentUser)) {
        await refreshUsers();
        if (isEditing && originalUsername === username) resetForm();
        onUserUpdated();
      } else {
        alert('Error deleting user.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-200">
        <Users size={20} className="text-blue-500" />
        <h3 className="text-lg font-semibold">User Management</h3>
        {loading && <Loader2 size={16} className="animate-spin text-slate-500" />}
      </div>

      <div className="flex flex-col gap-3 mb-6 bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-slate-400 uppercase">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h4>
          {isEditing && (
            <button onClick={resetForm} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
              <Ban size={12} /> Cancel Edit
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input 
            placeholder="Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input 
            placeholder="Username" 
            value={formData.username} 
            onChange={e => setFormData({...formData, username: e.target.value})}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input 
            placeholder="Email (for reports/login)" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input 
            type="text" 
            placeholder="Password" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <select
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value as 'user' | 'admin'})}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none md:col-span-2"
          >
            <option value="user">Salesman (Limited Access)</option>
            <option value="admin">Admin (Full Access)</option>
          </select>
          <button 
            onClick={handleSaveUser} 
            disabled={loading}
            className={`${isEditing ? 'bg-orange-600 hover:bg-orange-500' : 'bg-green-600 hover:bg-green-500'} text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-center gap-1 md:col-span-2 mt-1 transition-colors disabled:opacity-50`}
          >
            {isEditing ? <Save size={16} /> : <Plus size={16} />}
            {isEditing ? 'Update User' : 'Create User'}
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto crm-scroll">
        {users.map(u => (
          <div key={u.username} className={`flex justify-between items-center p-3 rounded-lg border ${u.username === 'mharari' ? 'bg-indigo-900/20 border-indigo-900/50' : 'bg-slate-800 border-slate-700'} ${isEditing && originalUsername === u.username ? 'ring-1 ring-orange-500' : ''}`}>
             <div className="flex items-center gap-3">
               <div className={`p-2 rounded-full ${u.role === 'admin' ? 'bg-purple-900/50 text-purple-400' : 'bg-slate-700 text-slate-400'}`}>
                 {u.role === 'admin' ? <ShieldAlert size={16} /> : <UserIcon size={16} />}
               </div>
               <div>
                 <p className="text-sm font-bold text-white flex items-center gap-2">
                    {u.name}
                    {u.role === 'admin' && <span className="text-[10px] bg-purple-900 text-purple-200 px-1.5 py-0.5 rounded border border-purple-700">ADMIN</span>}
                    {u.username === 'mharari' && <span className="text-[10px] bg-yellow-600/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-600/30 font-bold tracking-wider">MASTER</span>}
                 </p>
                 <div className="flex flex-col">
                    <span className="text-xs text-slate-400">@{u.username}</span>
                    <span className="text-xs text-blue-400 flex items-center gap-1"><Mail size={10} /> {u.email}</span>
                 </div>
               </div>
             </div>
             
             <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleEditClick(u)} 
                  className="text-slate-500 hover:text-blue-400 p-2 hover:bg-blue-900/20 rounded-md transition-colors" 
                  title="Edit User"
                >
                  <Pencil size={16} />
                </button>

                {u.username !== 'mharari' ? (
                    <button onClick={() => handleDeleteUser(u.username)} className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-900/20 rounded-md transition-colors" title="Delete User">
                      <Trash2 size={16} />
                    </button>
                ) : (
                    <span className="text-slate-600 p-2 cursor-not-allowed" title="Master Account Protected">
                      <Lock size={16} />
                    </span>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChangePasswordSection: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (passwords.new !== passwords.confirm) {
      setMsg('New passwords do not match');
      return;
    }
    setLoading(true);
    await changePassword(currentUser.username, passwords.new, currentUser);
    setLoading(false);
    setMsg('Password updated successfully');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-200">
        <Key size={20} className="text-orange-500" />
        <h3 className="text-lg font-semibold">Change Password</h3>
      </div>
      
      <div className="space-y-3 max-w-sm">
        <input 
           type="password"
           placeholder="New Password"
           value={passwords.new}
           onChange={e => setPasswords({...passwords, new: e.target.value})}
           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
        />
        <input 
           type="password"
           placeholder="Confirm New"
           value={passwords.confirm}
           onChange={e => setPasswords({...passwords, confirm: e.target.value})}
           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
        />
        {msg && <p className={`text-xs ${msg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
        <button onClick={handleChange} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
};

const AuditLogSection: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    refreshLogs();
  }, []);

  const refreshLogs = async () => {
    const data = await getLogs();
    setLogs(data);
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm col-span-1 md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200">
            <Activity size={20} className="text-emerald-500" />
            <h3 className="text-lg font-semibold">Security Audit Logs (Local Records)</h3>
        </div>
        <button onClick={refreshLogs} className="text-xs text-blue-400 hover:text-white">Refresh</button>
      </div>
      
      <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-96 crm-scroll">
        <table className="w-full text-xs text-left text-slate-400">
          <thead className="text-xs text-slate-500 uppercase bg-slate-950 sticky top-0">
            <tr>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900">
            {logs.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-4 text-center italic">No activity recorded yet.</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="px-4 py-2 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 text-white">
                    {log.username} <br/><span className="text-slate-500 text-[10px]">{log.userEmail}</span>
                </td>
                <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded font-bold
                        ${log.action === 'LOGIN' ? 'bg-blue-900 text-blue-300' : 
                          log.action.includes('EXPORT') ? 'bg-yellow-900 text-yellow-300' :
                          log.action === 'ADMIN_ACTION' ? 'bg-purple-900 text-purple-300' : 'bg-slate-700'}
                    `}>
                        {log.action}
                    </span>
                </td>
                <td className="px-4 py-2">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DataVaultSection: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState('');

    const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        if (!confirm('WARNING: This will overwrite ALL current data with the backup file. Continue?')) return;
        
        setStatus('Restoring...');
        const success = await restoreBackup(e.target.files[0]);
        if (success) {
            alert('Restore successful! The application will now reload.');
            window.location.reload();
        } else {
            setStatus('Error restoring file.');
        }
    };

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-slate-200">
                <Database size={20} className="text-cyan-500" />
                <h3 className="text-lg font-semibold">Data Vault (Backup & Restore)</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
                Create a full backup of your CRM data (Leads, Users, Settings) to a secure local file, or restore from a previous backup.
                Use this to transfer data between computers or save your work.
            </p>
            
            <div className="flex flex-wrap gap-4">
                <button 
                    onClick={createBackup}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl border border-slate-700 transition-all hover:border-slate-500"
                >
                    <Download size={20} className="text-cyan-400" />
                    <div className="text-left">
                        <div className="font-semibold text-sm">Download Backup</div>
                        <div className="text-xs text-slate-500">Save .json to computer</div>
                    </div>
                </button>

                <div className="relative">
                    <input 
                        type="file" 
                        accept=".json" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleRestore}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl border border-slate-700 transition-all hover:border-slate-500"
                    >
                        <Upload size={20} className="text-orange-400" />
                        <div className="text-left">
                            <div className="font-semibold text-sm">Restore Database</div>
                            <div className="text-xs text-slate-500">Upload .json file</div>
                        </div>
                    </button>
                </div>
                {status && <span className="text-sm self-center text-slate-400">{status}</span>}
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------

const AdminView: React.FC<AdminViewProps> = ({ options, onOptionsChange, language, currentUser }) => {
  const t = TRANSLATIONS[language];

  const updateList = async (key: keyof AppOptions, action: 'add' | 'remove', value: string) => {
    const currentList = options[key] || [];
    let newList: string[];

    if (action === 'add') {
      if (currentList.includes(value)) return;
      newList = [...currentList, value];
    } else {
      newList = currentList.filter(item => item !== value);
    }

    // Update locally immediately for responsiveness (optimistic), then save to cloud via parent
    onOptionsChange({ ...options, [key]: newList });
  };

  const handleReset = async () => {
    if (confirm('Reset all dropdown options to default? This cannot be undone.')) {
        const defaults = await resetOptions();
        onOptionsChange(defaults);
    }
  };

  const refreshOptions = async () => {
    // Force refresh of options from storage
    const opts = await getOptions();
    onOptionsChange(opts);
  };

  return (
    <div className="h-full overflow-y-auto crm-scroll space-y-8 p-1">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">{t.admin.title}</h2>
          <p className="text-slate-400 mt-1">{t.admin.subtitle}</p>
        </div>
        
        {currentUser.role === 'admin' && (
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 bg-red-900/20 px-3 py-2 rounded-lg transition-colors border border-red-900/30"
            >
                <RefreshCw size={14} />
                Reset Config
            </button>
        )}
      </div>

      {/* Grid for Dropdown Managers */}
      {currentUser.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AdminSection 
            title={t.admin.manageOwners} 
            items={options.owners || []} 
            onAdd={(v) => updateList('owners', 'add', v)} 
            onRemove={(v) => updateList('owners', 'remove', v)}
            placeholder="Add Owner..."
            />
            
             <AdminSection 
            title={t.admin.manageProducts} 
            items={options.products || []} 
            onAdd={(v) => updateList('products', 'add', v)} 
            onRemove={(v) => updateList('products', 'remove', v)}
            placeholder="Add Product..."
            />

            <AdminSection 
            title={t.admin.manageCities} 
            items={options.cities || []} 
            onAdd={(v) => updateList('cities', 'add', v)} 
            onRemove={(v) => updateList('cities', 'remove', v)}
            placeholder="Add City..."
            />

            <AdminSection 
            title={t.admin.manageIndustries} 
            items={options.industries || []} 
            onAdd={(v) => updateList('industries', 'add', v)} 
            onRemove={(v) => updateList('industries', 'remove', v)}
            placeholder="Add Industry..."
            />

            <AdminSection 
            title={t.admin.manageStages} 
            items={options.stages || []} 
            onAdd={(v) => updateList('stages', 'add', v)} 
            onRemove={(v) => updateList('stages', 'remove', v)}
            placeholder="Add Stage..."
            />
             
             <AdminSection 
            title="Manage Lead Sources" 
            items={options.leadSources || []} 
            onAdd={(v) => updateList('leadSources', 'add', v)} 
            onRemove={(v) => updateList('leadSources', 'remove', v)}
            placeholder="Add Source..."
            />
        </div>
      )}

      {/* Security Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
        {currentUser.role === 'admin' && <UserManagementSection currentUser={currentUser} onUserUpdated={refreshOptions} />}
        <ChangePasswordSection currentUser={currentUser} />
        {currentUser.role === 'admin' && <AuditLogSection />}
        {currentUser.role === 'admin' && <DataVaultSection />}
      </div>
    </div>
  );
};

export default AdminView;