import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
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
    await waitFor(async () => {
      render(<EventManagementPage />);
      expect(await screen.findByText("Sample Event")).toBeInTheDocument();
      expect(await screen.findByText("Houston")).toBeInTheDocument();
      expect(await screen.findByText("Active")).toBeInTheDocument();
    });
  });

  test("renders form title", async () => {
    await waitFor(async () => {
      render(<EventManagementPage />);
      const titles = await screen.findAllByText(/create event/i);
      expect(titles.length).toBeGreaterThan(0);
    });
  });

  
  test("shows error when fetchEvents fails", async () => {
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: "Failed to fetch" }),
    })
  );
  render(<EventManagementPage />);
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  await waitFor(() => {
    expect(errorSpy).toHaveBeenCalledWith(
      "Error fetching events:", "Failed to fetch"
    );
  });
  errorSpy.mockRestore();
});


  test("deletes an event successfully", async () => {
    render(<EventManagementPage />);
    
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );
    
    const deleteButton = await screen.findByText(/delete/i);
    window.alert = jest.fn();
    deleteButton.click();
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Event deleted successfully!");
    });
  });


  test("shows error alert on failed delete", async () => {
    render(<EventManagementPage />);
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );
    const deleteButton = await screen.findByText(/delete/i);
    window.alert = jest.fn();
    deleteButton.click();
    await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Error deleting event.");
    });
  });

  
});