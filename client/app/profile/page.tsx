"use client";

import React, { useState, useEffect, useRef } from "react";
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

const UserProfileForm: React.FC = () => {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [preferences, setPreferences] = useState("");
  const [availability, setAvailability] = useState("");
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load User ID from localStorage (Temporary Storage Before Auth)
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        alert("Session expired. Please sign up again.");
        router.push("/signup");
        return;
      }
      setUserId(data.user.id);
    };

    fetchUser();
  }, []);
  

  const allSkills = [
    "Tutoring",
    "Mentoring",
    "Food Service",
    "Event Planning",
    "Fundraising",
    "Technical Support",
    "Social Media Management",
    "Crisis Support",
    "Elder Care",
  ];

  const handleSkillChange = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("Error: No user ID found. Please sign up again.");
      router.push("/signup");
      return;
    }

    const { error } = await supabase
      .from("profile")
      .upsert([
        {
          id: userId,
          full_name: name,
          address,
          city,
          state,
          zip_code: zip,
          skills,
          preferences,
          availability,
          role: "user",
        },
      ]);

    if (error) {
      console.error("Error updating profile:", error);
      alert(`Failed to save profile: ${error.message}`);
      return;
    }

    alert("Profile updated successfully! You are now registered as a user.");
    router.push("/user");
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-gray-800 rounded-xl shadow-lg w-full max-w-lg relative overflow-visible">
      <div className="text-4xl font-bold mb-6 text-gray-900">Create Profile</div>
      <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 w-full px-4">
        <InputField label="Name" id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
        <InputField label="Address" id="profile-address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <InputField label="City" id="profile-city" value={city} onChange={(e) => setCity(e.target.value)} />
        <InputField label="State" id="profile-state" value={state} onChange={(e) => setState(e.target.value)} />
        <InputField label="Zip Code" id="profile-zip" value={zip} onChange={(e) => setZip(e.target.value)} />

        <div className="relative" ref={dropdownRef}>
          <label className="text-gray-700 font-semibold">Skills</label>
          <button
            type="button"
            className="px-4 py-2 w-full bg-gray-100 rounded-md text-left mt-2"
            onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
          >
            {skills.length > 0 ? skills.join(", ") : "Select skills"}
          </button>
          {showSkillsDropdown && (
            <div className="absolute bg-white border rounded-md shadow-md w-full mt-1 max-h-40 overflow-y-auto z-50 overflow-visible">
              {allSkills.map((skill) => (
                <label key={skill} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                    className="mr-2"
                  />
                  {skill}
                </label>
              ))}
            </div>
          )}
        </div>

        <label className="text-gray-700 font-semibold">Preferences</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Enter your preferences (optional)"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
        ></textarea>

        <label className="text-gray-700 font-semibold">Availability *</label>
        <input
          type="date"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />

        <button
          type="submit"
          className="px-6 py-3 text-lg font-semibold text-white bg-pink-400 rounded-3xl hover:bg-pink-500 w-full"
        >
          Save
        </button>
      </form>
    </div>
  );
};

const UserProfilePage: React.FC = () => (
  <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 overflow-visible">
    <BackgroundImage />
    <Bubble position="top-0 right-0" />
    <Bubble position="bottom-0 left-0" />
    <UserProfileForm />
  </div>
);

export default UserProfilePage;
