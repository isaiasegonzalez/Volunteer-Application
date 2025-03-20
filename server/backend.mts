
import "dotenv/config";

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
