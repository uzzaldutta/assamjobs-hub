const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const { JobAssamHubAdapter } = require("./src/lib/ingestion/adapters/JobAssamHubAdapter.ts"); // wait, require on ts won't work easily

// I'll just use tsx
