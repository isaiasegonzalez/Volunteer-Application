import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials are missing. Check your .env file.");
    process.exit(1);
}

// ✅ Send Notification & Return Updated Notifications
app.post("/send-notification", async (req: express.Request, res: express.Response) => {
    try {
        const { type, event, message, status } = req.body;

        if (!type || !event || !message) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        // ✅ Use Supabase default status unless provided
        const newNotification: any = { type, event, message };
        if (status) newNotification.status = status;

        // Store the notification in Supabase
        const { error } = await supabase.from("notifications").insert([newNotification]);

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        // ✅ Fetch Updated Notifications & Return Them
        const { data, error: fetchError } = await supabase.from("notifications").select("*");

        if (fetchError) {
            res.status(500).json({ error: fetchError.message });
            return;
        }

        res.status(200).json({ success: true, notifications: data });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Route to Fetch Notifications
app.get("/get-notifications", async (req: express.Request, res: express.Response) => {
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
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log("Notifications server is running.");
