
# Altra CRM

A robust, React-based CRM application with hybrid storage (Local + Cloud).
By default, it runs in **Local Mode** (Offline). If configured, it syncs to **Supabase** (Cloud).

## 🚀 How to Deploy (Netlify)

The easiest way to put this online for free is **Netlify**.

### Step 1: Prepare the Cloud Database (Supabase) - Optional
*If you skip this, the app works in "Offline Mode" perfectly.*
1.  Go to [Supabase.com](https://supabase.com) -> New Project.
2.  Go to SQL Editor -> New Query.
3.  Run the SQL script found in `sql_setup.txt` (or ask the AI for it).
4.  Go to Settings -> API. Copy **Project URL** and **anon/public Key**.

### Step 2: Build the App
1.  Open your terminal in the project folder.
2.  Run `npm run build`.
3.  This creates a `dist` folder.

### Step 3: Deploy to Netlify
1.  Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2.  Drag the `dist` folder onto the page.
3.  Your site is live!

### Step 4: Connect to Cloud (Optional)
To turn on Cloud Sync:
1.  In Netlify, go to **Site settings** -> **Environment variables**.
2.  Add:
    *   `VITE_SUPABASE_URL` = (Your URL)
    *   `VITE_SUPABASE_ANON_KEY` = (Your Key)
    *   `VITE_API_KEY` = (Your Gemini API Key)
3.  Go to Deploys -> Trigger Deploy.

## 🔑 Login Credentials
*   **User:** `mharari` (or `manuel@harari.mx`)
*   **Password:** `admin`

## ✨ Features
- **Hybrid Storage:** Works offline (Local Storage) or online (Supabase) automatically.
- **Data Vault:** Backup/Restore JSON files manually.
- **AI Power:** Gemini integration for analysis and briefings.
- **PWA:** Installable as a desktop/mobile app.