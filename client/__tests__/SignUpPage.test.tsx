import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';

// ---- SETUP SHARED MOCKS FIRST ----
const mockSetSession = jest.fn();
const mockSignUp = jest.fn();

jest.mock("@/supabaseClient", () => ({
    supabase: {
      auth: {
        signUp: mockSignUp,
        setSession: mockSetSession,  // <-- Use the SHARED mock here!
      }
    }
  }));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

import SignUpPage from "../app/signup/page";

// Mock fetch to simulate signup API
global.fetch = jest.fn((url, opts) => {
  const body = JSON.parse(opts.body);
  if (body.email === "fail@vola.com") {
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: "Signup failed" }),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ userId: "testid", session: { access_token: "abc" } }),
  });
}) as any;

// ---- Import the component after mocks are set up ----


describe("SignUpPage", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
    mockSetSession.mockClear();
    localStorage.clear();
  });

  it("renders all form fields", () => {
    render(<SignUpPage />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("shows error if passwords do not match", async () => {
    render(<SignUpPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@site.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "abc123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "abc124" } });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("shows error from API if signup fails", async () => {
    render(<SignUpPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "fail@vola.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "abc123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "abc123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/signup failed/i)).toBeInTheDocument();
    });
  });

  it("redirects and stores info on success", async () => {
    render(<SignUpPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "me@vola.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "abc123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "abc123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(localStorage.getItem("tempUserId")).toBe("testid");
      expect(screen.getByText(/account created/i)).toBeInTheDocument();
    });
  });
});
