"use client";
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";


const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

const SKILLS_OPTIONS = [
  "Tutoring",
  "Mentoring",
  "Food Service",
  "Administrative Support",
  "Event Planning",
  "Fundraising",
  "Community Outreach",
  "Social Media Management",
  "Language Translation",
  "Crisis Support",
  "Elder Care",
  "Youth Programs",
  "Arts and Crafts",
  "Music/Performance",
  "Sports Coaching",
  "Environmental Work",
  "Animal Care",
  "First Aid/CPR",
  "Disaster Relief",
  "Mental Health Support",
  "Transportation",
  "Technical Support",
  "Grant Writing",
  "Teaching/Education",
];

interface ProfileFormData {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  skills: string[];
  preferences: string;
  availability: string[];
}

const EditProfilePage = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    skills: [],
    preferences: "",
    availability: [],
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.fullName || formData.fullName.length > 50) {
      newErrors.fullName =
        "Full name is required and must be under 50 characters";
    }

    if (!formData.address1 || formData.address1.length > 100) {
      newErrors.address1 =
        "Address 1 is required and must be under 100 characters";
    }

    if (formData.address2 && formData.address2.length > 100) {
      newErrors.address2 = "Address 2 must be under 100 characters";
    }

    if (!formData.city || formData.city.length > 100) {
      newErrors.city = "City is required and must be under 100 characters";
    }

    if (!formData.state) {
      newErrors.state = "State selection is required";
    }

    if (!formData.zipCode || !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Valid 5 or 9 digit zip code is required";
    }

    if (!formData.skills.length) {
      newErrors.skills = ["At least one skill must be selected"];
    }

    if (!formData.availability.length) {
      newErrors.availability = ["At least one date must be selected"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Updating profile:", formData);
    }
  };

  const handleSkillChange = (skill: string) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill];
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleDateAdd = (date: string) => {
    if (!formData.availability.includes(date)) {
      setFormData({
        ...formData,
        availability: [...formData.availability, date],
      });
    }
  };

  const handleDateRemove = (dateToRemove: string) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter(
        (date) => date !== dateToRemove
      ),
    });
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>

        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                maxLength={50}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Address 1 */}
            <div>
              <label
                htmlFor="address1"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address 1 *
              </label>
              <input
                id="address1"
                type="text"
                value={formData.address1}
                onChange={(e) =>
                  setFormData({ ...formData, address1: e.target.value })
                }
                maxLength={100}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your primary address"
              />
              {errors.address1 && (
                <p className="mt-1 text-sm text-red-600">{errors.address1}</p>
              )}
            </div>

            {/* Address 2 */}
            <div>
              <label
                htmlFor="address2"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address 2
              </label>
              <input
                id="address2"
                type="text"
                value={formData.address2}
                onChange={(e) =>
                  setFormData({ ...formData, address2: e.target.value })
                }
                maxLength={100}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Apartment, suite, unit, etc. (optional)"
              />
              {errors.address2 && (
                <p className="mt-1 text-sm text-red-600">{errors.address2}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                City *
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                maxLength={100}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                State *
              </label>
              <select
                id="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select a state</option>
                {US_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            {/* Zip Code */}
            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Zip Code *
              </label>
              <input
                id="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                maxLength={10}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your zip code"
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills *
              </label>
              <div className="space-y-2">
                {SKILLS_OPTIONS.map((skill) => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillChange(skill)}
                      className="mr-2"
                    />
                    {skill}
                  </label>
                ))}
              </div>
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
              )}
            </div>

            {/* Preferences */}
            <div>
              <label
                htmlFor="preferences"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preferences
              </label>
              <textarea
                id="preferences"
                value={formData.preferences}
                onChange={(e) =>
                  setFormData({ ...formData, preferences: e.target.value })
                }
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32"
                placeholder="Enter your preferences (optional)"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability *
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  onChange={(e) => handleDateAdd(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.availability.map((date) => (
                    <div
                      key={date}
                      className="flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-1 rounded-md"
                    >
                      {date}
                      <button
                        type="button"
                        onClick={() => handleDateRemove(date)}
                        className="text-pink-600 hover:text-pink-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.availability}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-pink-100 text-pink-600 py-2 px-4 rounded-md hover:bg-pink-200 transition-colors"
            >
              Update Profile
            </button>
          </form>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Danger Zone
            </h2>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-md hover:bg-red-100 transition-colors"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-md">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-600">
                    This action cannot be undone. Your account and all
                    associated data will be permanently deleted.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => console.log("Deleting account")}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
