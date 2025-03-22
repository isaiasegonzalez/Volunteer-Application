import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom"; // needed for toBeInTheDocument
import EventManagementPage from "@/app/admin/events/page";

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          events: [
            {
              id: "1",
              title: "Sample Event",
              description: "Test description",
              location: "Houston",
              urgency: "High",
              date: "2025-03-21",
              volunteers: 5,
              status: "Active",
            },
          ],
        }),
    })
  ) as jest.Mock;
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks(); // restore fetch
});

describe("EventManagementPage", () => {
  test("renders loading initially", async () => {
    render(<EventManagementPage />);
    expect(screen.getByText(/loading events/i)).toBeInTheDocument();
  });

  test("renders event data after fetch", async () => {
    render(<EventManagementPage />);
    await waitFor(() =>
      expect(screen.getByText("Sample Event")).toBeInTheDocument()
    );
    expect(screen.getByText("Houston")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  test("renders form title", () => {
    render(<EventManagementPage />);
    const titles = screen.getAllByText(/create event/i);
    expect(titles.length).toBeGreaterThan(0); // button and header both show it
  });
});
