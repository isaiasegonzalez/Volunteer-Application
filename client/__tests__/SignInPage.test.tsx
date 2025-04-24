import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInPage from "../app/signin/page";
import '@testing-library/jest-dom';

const mockGetUser = jest.fn();

jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: () => ({
      auth: {
        signInWithPassword: jest.fn(({ email, password }) => {
          if (email === "admin@vola.com") {
            return Promise.resolve({
              data: { user: { email } },
              error: null,
            });
          }
          if (email === "fail@vola.com") {
            return Promise.resolve({
              data: {},
              error: { message: "Invalid login" },
            });
          }
          return Promise.resolve({
            data: { user: { email } },
            error: null,
          });
        }),
        getUser: (...args: any[]) => mockGetUser(...args),
      },
    }),
  };
});

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("SignInPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGetUser.mockReset();
  });

  it("renders form fields", () => {
    render(<SignInPage />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it("shows error message on invalid login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { email: "fail@vola.com" } } });
    render(<SignInPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "fail@vola.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid login/i)).toBeInTheDocument();
    });
  });

  it("redirects admin to /admin", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { email: "admin@vola.com" } } });
    render(<SignInPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "admin@vola.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "any" } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
  });

  it("redirects non-admin to /user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { email: "normal@vola.com" } } });
    render(<SignInPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "normal@vola.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "any" } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/user");
    });
  });  
});
