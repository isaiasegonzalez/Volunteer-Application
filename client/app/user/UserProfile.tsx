interface User {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    profile_picture_url: string;
    role: string;
    bio: string;
    created_at: string;
  }
  
"use client";
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";

export default function UserProfile() {
  const session = useSession();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data);
    }
    if (session) fetchUser();
  }, [session]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user?.full_name}</h1>
      <p>Email: {user?.email}</p>
      <p>Phone: {user?.phone_number}</p>
      <p>Role: {user?.role}</p>
      <p>Bio: {user?.bio}</p>
      {user?.profile_picture_url && <img src={user.profile_picture_url} alt="Profile" width={100} />}
    </div>
  );
  
}

