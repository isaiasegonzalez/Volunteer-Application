"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BackgroundImage: React.FC = () => (
  <img
    loading="lazy"
    src="/Dot Grid.svg"
    className="object-cover absolute inset-0 size-full"
    alt="Background"
  />
);

const Bubble: React.FC<{ position: string }> = ({ position }) => (
  <div
    className={`absolute ${position} w-40 h-40 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full opacity-50`}
  ></div>
);

const SignInIllustration: React.FC = () => (
  <img
    loading="lazy"
    src="/Sign in and sign up Graphic.svg"
    className="object-contain w-48 mb-6"
    alt="Sign In illustration"
  />
);

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
}) => (
  <div className="box-border flex relative flex-col shrink-0 mt-6">
    <label htmlFor={id} className="sr-only">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={label}
      className="px-6 py-3 w-full text-lg font-medium rounded-3xl bg-gray-100 shadow-md text-gray-700"
      aria-label={label}
    />
  </div>
);

const SignInForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login Error:", error.message);
        setMessage(error.message);
        setLoading(false);
        return;
      }

      console.log("Login Success! User:", data.user);

      // ✅ Ensure the user is authenticated before redirecting
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay to avoid race conditions

      const { data: session } = await supabase.auth.getUser(); // Verify logged-in user

      if (session?.user?.email === "admin@vola.com") {
        console.log("Redirecting to /admin");
        router.push("/admin");
      } else {
        console.log("Redirecting to /dashboard");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6 text-gray-800 rounded-xl shadow-lg w-[400px] relative">
      <SignInIllustration />
      <div className="text-4xl font-bold mb-6 text-gray-900">Sign In</div>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <InputField
          label="Email"
          id="signin-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="px-6 py-3 text-lg font-semibold text-white bg-pink-400 rounded-3xl hover:bg-pink-500"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      <div className="mt-4 text-gray-700 text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-pink-500 font-semibold hover:underline">
          Create one
        </a>
      </div>
    </div>
  );
};

const SignInPage: React.FC = () => (
  <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 to-purple-200">
    <BackgroundImage />
    <Bubble position="top-0 right-0" />
    <Bubble position="bottom-0 left-0" />
    <SignInForm />
  </div>
);

export default SignInPage;
