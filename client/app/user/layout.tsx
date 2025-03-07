"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SidebarProvider } from "@/components/ui/sidebar"; // Keep SidebarProvider
import { UserSidebar } from "@/components/user-sidebar"; // Import UserSidebar

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState<any>(null);
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
        setLoading(false);
        if (!user) handleRedirect();
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [handleRedirect]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider> {/* Keep the SidebarProvider */}
      <div className="flex h-screen w-screen">
        <UserSidebar className="w-64" /> {/* Sidebar is always visible */}
        <main className="flex-grow w-full h-full p-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
