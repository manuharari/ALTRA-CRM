
import { User } from "../types";
import { addLogEntry } from "./cloudService";
import { updateOwnerNameGlobally } from "./cloudService";
import { supabase } from '../src/supabaseClient';

const USERS_KEY = 'crm_users';

const defaultAdmin: User = {
  username: 'mharari',
  email: 'manuel@harari.mx',
  password: 'admin',
  name: 'Manuel Harari',
  role: 'admin'
};

const isCloud = () => !!supabase;

// Helper to get users from correct source
const fetchUsersInternal = async (): Promise<User[]> => {
    if (isCloud()) {
        const { data } = await supabase!.from('users').select('*');
        return data as User[] || [];
    }
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
}

const saveUsersInternal = async (users: User[]) => {
    if (isCloud()) {
        // Cloud usually handles insert/update individually, but for simple migration sync:
        // We won't batch overwrite cloud users here to avoid complexity.
        // Individual functions handle cloud writes.
    } else {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
}

export const initializeAuth = async () => {
  const users = await fetchUsersInternal();
  const admin = users.find(u => u.username === 'mharari');
  
  if (!admin) {
      if (isCloud()) {
          await supabase!.from('users').insert(defaultAdmin);
      } else {
          users.push(defaultAdmin);
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
  } else {
      // Force update details if changed
      if (admin.name !== defaultAdmin.name || admin.email !== defaultAdmin.email) {
          if (isCloud()) {
               await supabase!.from('users').update({ name: defaultAdmin.name, email: defaultAdmin.email }).eq('username', 'mharari');
          } else {
              const idx = users.findIndex(u => u.username === 'mharari');
              users[idx] = { ...users[idx], name: defaultAdmin.name, email: defaultAdmin.email };
              localStorage.setItem(USERS_KEY, JSON.stringify(users));
          }
      }
  }
};

export const getUsers = async (): Promise<User[]> => {
  return await fetchUsersInternal();
};

export const login = async (identifier: string, p: string): Promise<User | null> => {
  const users = await fetchUsersInternal();
  const user = users.find(u => 
    (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()) 
    && u.password === p
  );
  
  if (user) {
    await addLogEntry({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        username: user.username,
        userEmail: user.email,
        action: 'LOGIN',
        details: 'Logged in'
    });
  }
  return user || null;
};

export const createUser = async (newUser: User, creator: User): Promise<boolean> => {
  if (isCloud()) {
      const { error } = await supabase!.from('users').insert(newUser);
      if (error) return false;
  } else {
      const users = await fetchUsersInternal();
      if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) return false;
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  
  await addLogEntry({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      username: creator.username,
      userEmail: creator.email,
      action: 'ADMIN_ACTION',
      details: `Created user ${newUser.username}`
  });
  return true;
};

export const updateUser = async (originalUsername: string, updatedUser: User, performer: User): Promise<boolean> => {
  const users = await fetchUsersInternal();
  const oldUser = users.find(u => u.username === originalUsername);
  
  if (!oldUser) return false;
  const oldName = oldUser.name;

  if (isCloud()) {
      const { error } = await supabase!.from('users').update(updatedUser).eq('username', originalUsername);
      if (error) return false;
  } else {
      const index = users.findIndex(u => u.username === originalUsername);
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Global Owner Rename
  if (oldName !== updatedUser.name) {
      await updateOwnerNameGlobally(oldName, updatedUser.name);
  }

  await addLogEntry({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      username: performer.username,
      userEmail: performer.email,
      action: 'ADMIN_ACTION',
      details: `Updated user ${originalUsername}`
  });
  return true;
};

export const deleteUser = async (username: string, performer: User): Promise<boolean> => {
  if (username === 'mharari') return false;

  if (isCloud()) {
      const { error } = await supabase!.from('users').delete().eq('username', username);
      if (error) return false;
  } else {
      let users = await fetchUsersInternal();
      const initialLen = users.length;
      users = users.filter(u => u.username !== username);
      if (users.length === initialLen) return false;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  await addLogEntry({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      username: performer.username,
      userEmail: performer.email,
      action: 'ADMIN_ACTION',
      details: `Deleted user ${username}`
  });
  return true;
};

export const changePassword = async (username: string, newPass: string, performer: User) => {
   if (isCloud()) {
       await supabase!.from('users').update({ password: newPass }).eq('username', username);
   } else {
       const users = await fetchUsersInternal();
       const u = users.find(u => u.username === username);
       if (u) {
           u.password = newPass;
           localStorage.setItem(USERS_KEY, JSON.stringify(users));
       }
   }
   await addLogEntry({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      username: performer.username,
      userEmail: performer.email,
      action: 'DATA_UPDATE',
      details: `Changed password for ${username}`
  });
};