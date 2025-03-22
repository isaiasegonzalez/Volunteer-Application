jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: () => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "mock-user-id" } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { full_name: "Jane Doe" },
              error: null,
            }),
          })),
        })),
      })),
    }),
  };
});


import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import VolunteerDashboard from "@/app/user/page"; // update this path to your actual component
import { vi } from "vitest";


describe("VolunteerDashboard", () => {
  test("renders loading then user profile name", async () => {
    render(<VolunteerDashboard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    );
  });

  test("renders upcoming events", () => {
    render(<VolunteerDashboard />);
    expect(screen.getByText("GoodWill")).toBeInTheDocument();
    expect(screen.getByText("Gagas Animal Shelter")).toBeInTheDocument();
  });

  test("shows more volunteer history after expanding", async () => {
    render(<VolunteerDashboard />);
    await waitFor(() => screen.getByText("Volunteer History"));

    const heading = screen.getByText("Volunteer History");
    const expandBtn = heading.parentElement?.querySelector("button");
    if (!expandBtn) throw new Error("Expand button not found");

    fireEvent.click(expandBtn);

    await waitFor(() => {
      expect(screen.getByText("Animal Shelter")).toBeInTheDocument();
      expect(screen.getByText("GoodWill")).toBeInTheDocument();
    });
  });
});