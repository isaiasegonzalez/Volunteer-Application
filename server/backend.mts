import "dotenv/config";

console.log("Debug: SUPABASE_URL =", process.env.SUPABASE_URL || "MISSING");
console.log(
  "Debug: SUPABASE_KEY =",
  process.env.SUPABASE_ANON_KEY || "MISSING"
);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:");
  console.error(reason);
  if (reason instanceof Error) {
    console.error("Error Message:", reason.message);
    console.error("Stack Trace:", reason.stack);
  }
});

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials are missing. Check your .env file.");
  process.exit(1);
}

// Send Notification & Return Updated Notifications
app.post("/send-notification", async (req, res) => {
  try {
    console.log("Debug: Incoming request data:", req.body);

    const { type, event, message, status } = req.body;
    if (!type || !event || !message) {
      throw new Error("Missing required fields: type, event, message");
    }

    const newNotification = { type, event, message, status };
    console.log("Debug: New Notification Data:", newNotification);

    // Insert into Supabase
    const { error } = await supabase
      .from("notifications")
      .insert([newNotification]);
    if (error) {
      console.error("Supabase Insert Error:", JSON.stringify(error, null, 2));
      throw error;
    }

    // Fetch updated notifications
    const { data, error: fetchError } = await supabase
      .from("notifications")
      .select("*");
    if (fetchError) {
      console.error(
        "Supabase Fetch Error:",
        JSON.stringify(fetchError, null, 2)
      );
      throw fetchError;
    }

    console.log("Debug: Successfully fetched notifications:", data);
    res.status(200).json({ success: true, notifications: data });
  } catch (err) {
    console.error("ERROR in /send-notification:", JSON.stringify(err, null, 2));
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
});

// Route to Fetch Notifications
app.get(
  "/get-notifications",
  async (req: express.Request, res: express.Response) => {
    try {
      const { data, error } = await supabase.from("notifications").select("*");

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({ notifications: data });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("Server is running.");

// Routes for volunteer events
app.post("/volunteer-events", async (req: express.Request, res: express.Response) => {
  try {
    const { user_id, facility, date } = req.body;
    
    if (!user_id || !facility || !date) {
      return res.status(400).json({ 
        error: "Missing required fields: user_id, facility, date" 
      });
    }

    const { data, error } = await supabase
      .from("volunteer_events")
      .insert([{ user_id, facility, date }])
      .select();

    if (error) {
      console.error("Error creating volunteer event:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ success: true, event: data[0] });
  } catch (error) {
    console.error("Server error creating volunteer event:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
});

// Route to get upcoming volunteer events for a user
app.get("/volunteer-events/:userId", async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.params.userId;
    
    const { data, error } = await supabase
      .from("volunteer_events")
      .select("*")
      .eq("user_id", userId)
      .gt("date", new Date().toISOString())
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching volunteer events:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ events: data });
  } catch (error) {
    console.error("Server error fetching volunteer events:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
});

// Route to log new volunteer history
app.post("/volunteer-history", async (req: express.Request, res: express.Response) => {
  try {
    const { user_id, facility, date, points } = req.body;
    
    if (!user_id || !facility || !date || points === undefined) {
      return res.status(400).json({ 
        error: "Missing required fields: user_id, facility, date, points" 
      });
    }

    const { data, error } = await supabase
      .from("volunteer_history")
      .insert([{ user_id, facility, date, points }])
      .select();

    if (error) {
      console.error("Error logging volunteer history:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ success: true, history: data[0] });
  } catch (error) {
    console.error("Server error logging volunteer history:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
});

// Route to get volunteer history for a user
app.get("/volunteer-history/:userId", async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.params.userId;
    
    const { data, error } = await supabase
      .from("volunteer_history")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching volunteer history:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ history: data });
  } catch (error) {
    console.error("Server error fetching volunteer history:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
});
