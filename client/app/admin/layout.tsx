"use client"

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user || user.email !== "admin@vola.com") {
        redirect("/"); // Redirect if user is not authenticated or not admin
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    // Optionally, you can show a loading spinner while the user data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
