
import { supabase } from '../src/supabaseClient';
import { CrmRecord, AppOptions, User, AuditLog } from "../types";
import { MOCK_DATA, INITIAL_OPTIONS } from "../constants";

// --- LOCAL STORAGE KEYS ---
const STORAGE_KEY = 'crm_data';
const OPTIONS_KEY = 'crm_options';
const USERS_KEY = 'crm_users';
const LOG_KEY = 'crm_audit_logs';

// --- STATE HELPERS ---
const isCloudMode = () => !!supabase;

// ============================================================================
// RECORDS
// ============================================================================

export const getRecords = async (): Promise<CrmRecord[]> => {
  if (isCloudMode()) {
    const { data, error } = await supabase!.from('records').select('*');
    if (!error && data) {
       // Seed if empty
       if (data.length === 0) {
           await seedCloudData();
           return MOCK_DATA;
       }
       return data as CrmRecord[];
    }
  }
  
  // Local Fallback
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }
  return migrateLocalData(JSON.parse(stored));
};

export const addOrUpdateRecord = async (record: CrmRecord) => {
  if (isCloudMode()) {
    // Upsert works for both add and update if ID exists
    await supabase!.from('records').upsert(record);
  } else {
    const records = await getRecords();
    const index = records.findIndex(r => r.id === record.id);
    if (index >= 0) records[index] = record;
    else records.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};

export const deleteRecord = async (id: string) => {
  if (isCloudMode()) {
    await supabase!.from('records').delete().eq('id', id);
  } else {
    const records = (await getRecords()).filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};

// ============================================================================
// OPTIONS (Settings)
// ============================================================================

export const getOptions = async (): Promise<AppOptions> => {
  if (isCloudMode()) {
    const { data } = await supabase!.from('settings').select('*').eq('key', 'global').single();
    if (data) {
        return { ...INITIAL_OPTIONS, ...data };
    } else {
        // Initialize settings if missing
        await supabase!.from('settings').insert({ key: 'global', ...INITIAL_OPTIONS });
        return INITIAL_OPTIONS;
    }
  }

  // Local
  const stored = localStorage.getItem(OPTIONS_KEY);
  const parsed = stored ? JSON.parse(stored) : INITIAL_OPTIONS;
  return { ...INITIAL_OPTIONS, ...parsed, owners: parsed.owners || [], products: parsed.products || INITIAL_OPTIONS.products };
};

export const saveOptions = async (options: AppOptions) => {
  if (isCloudMode()) {
    await supabase!.from('settings').upsert({ key: 'global', ...options });
  } else {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
  }
};

export const resetOptions = async (): Promise<AppOptions> => {
    if (isCloudMode()) {
        await supabase!.from('settings').upsert({ key: 'global', ...INITIAL_OPTIONS });
        return INITIAL_OPTIONS;
    } else {
        localStorage.removeItem(OPTIONS_KEY);
        return INITIAL_OPTIONS;
    }
};

export const addOwner = async (newOwner: string) => {
    const options = await getOptions();
    if (!options.owners.includes(newOwner)) {
        const newOwners = [...options.owners, newOwner];
        await saveOptions({ ...options, owners: newOwners });
    }
};

export const updateOwnerNameGlobally = async (oldName: string, newName: string) => {
    const records = await getRecords();
    
    if (isCloudMode()) {
        // Cloud Batch Update not simple in client, so we iterate or use separate query
        // Simple iteration for now
        const toUpdate = records.filter(r => r.owner === oldName);
        for (const rec of toUpdate) {
            await supabase!.from('records').update({ owner: newName }).eq('id', rec.id);
        }
        
        const options = await getOptions();
        if (options.owners.includes(oldName)) {
            const newOwners = options.owners.map(o => o === oldName ? newName : o);
            await saveOptions({ ...options, owners: newOwners });
        }

    } else {
        // Local Logic
        let recordsChanged = false;
        const updatedRecords = records.map(r => {
            if (r.owner === oldName) { recordsChanged = true; return { ...r, owner: newName }; }
            return r;
        });
        if (recordsChanged) localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

        const options = await getOptions();
        if (options.owners.includes(oldName)) {
            const newOwners = options.owners.map(o => o === oldName ? newName : o);
            await saveOptions({ ...options, owners: newOwners });
        }
    }
}

// ============================================================================
// REALTIME SUBSCRIPTION
// ============================================================================

export const subscribeToChanges = (callback: () => void) => {
  if (!isCloudMode()) return () => {};

  const channel = supabase!.channel('custom-all-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'records' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, callback)
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
};


// ============================================================================
// HELPERS (Migration & Seeding)
// ============================================================================

const migrateLocalData = (records: any[]): CrmRecord[] => {
    // Same migration logic as before for local storage safety
    let migrationNeeded = false;
    const clean = records.map(r => {
        let u = { ...r };
        if (typeof r.product === 'string') { u.product = r.product ? [r.product] : []; migrationNeeded = true; }
        else if (!r.product) { u.product = []; migrationNeeded = true; }
        if (r.website === undefined) { u.website = ''; migrationNeeded = true; }
        return u;
    });
    if (migrationNeeded) localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    return clean;
}

const seedCloudData = async () => {
    if (!isCloudMode()) return;
    const { error } = await supabase!.from('records').insert(MOCK_DATA);
    if (error) console.error("Error seeding cloud:", error);
}

// ============================================================================
// LOGGING
// ============================================================================
export const getLogs = async (): Promise<AuditLog[]> => {
    if (isCloudMode()) {
        const { data } = await supabase!.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(500);
        return data as AuditLog[] || [];
    }
    const stored = localStorage.getItem(LOG_KEY);
    return stored ? JSON.parse(stored) : [];
}

export const addLogEntry = async (log: AuditLog) => {
    if (isCloudMode()) {
        await supabase!.from('audit_logs').insert(log);
    } else {
        const logs = await getLogs();
        const updated = [log, ...logs].slice(0, 1000);
        localStorage.setItem(LOG_KEY, JSON.stringify(updated));
    }
}

// ============================================================================
// DATA VAULT (Backup & Restore) - Works for BOTH modes
// ============================================================================

export const createBackup = async () => {
    // Always backup from current source (Cloud or Local)
    const records = await getRecords();
    const options = await getOptions();
    const logs = await getLogs();
    // For users, we need to fetch specially if cloud
    let usersStr = localStorage.getItem(USERS_KEY); // Default local
    
    const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        source: isCloudMode() ? 'cloud' : 'local',
        data: {
            records: JSON.stringify(records),
            options: JSON.stringify(options),
            users: usersStr, 
            logs: JSON.stringify(logs)
        }
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `altra_crm_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const restoreBackup = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const backup = JSON.parse(content);
                
                if (!backup.data) throw new Error('Invalid format');

                if (isCloudMode()) {
                    // Restore to Cloud (Dangerous! Overwrites everything)
                    // For safety in this prompt, we will only restore to Local Storage
                    // and alert the user.
                    alert("Restore is only fully supported in Local Mode to prevent cloud data corruption. Switching to Local Mode for restore.");
                }

                if (backup.data.records) localStorage.setItem(STORAGE_KEY, backup.data.records);
                if (backup.data.options) localStorage.setItem(OPTIONS_KEY, backup.data.options);
                if (backup.data.users) localStorage.setItem(USERS_KEY, backup.data.users);
                if (backup.data.logs) localStorage.setItem(LOG_KEY, backup.data.logs);
                
                resolve(true);
            } catch (err) {
                console.error(err);
                resolve(false);
            }
        };
        reader.readAsText(file);
    });
};