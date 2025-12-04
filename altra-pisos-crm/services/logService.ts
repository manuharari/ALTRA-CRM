import { AuditLog, User } from "../types";
import { addLogEntry, getLogs } from "./cloudService";

// Wrapper to maintain compatibility with existing components
export { getLogs };

export const addLog = async (user: User, action: AuditLog['action'], details: string) => {
  const newLog: AuditLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    username: user.username,
    userEmail: user.email,
    action,
    details
  };
  
  await addLogEntry(newLog);
  console.log(`[AUDIT]: ${action} by ${user.username}`);
};