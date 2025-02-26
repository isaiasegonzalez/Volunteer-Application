"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user-sidebar"; // Import the new UserSidebar

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user) {
        handleRedirect();
      }
    };

    fetchUser();
  }, [handleRedirect]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <UserSidebar /> {/* Replace AppSidebar with UserSidebar */}
      <main className="p-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
