import React from 'react';
import { render, screen, waitFor, fireEvent, prettyDOM} from '@testing-library/react';
import VolunteerDashboard from '../app/user/page'; // Adjust path if needed
import '@testing-library/jest-dom';


// Mock useRouter from App Router
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockEvents = [
    {
      id: 1,
      date: "2099-12-31T23:59:59.999Z",
      facility: 'Houston Food Bank',
      user_id: '123',
    },
  ];

  const mockHistory = [
    {
      id: 1,
      date: new Date().toISOString(),
      facility: 'Community Center',
      points: 5,
      user_id: '123',
    },
    {
      id: 2,
      date: new Date().toISOString(),
      facility: 'Shelter',
      points: 3,
      user_id: '123',
    },
    {
      id: 3,
      date: new Date().toISOString(),
      facility: 'Park Cleanup',
      points: 2,
      user_id: '123',
    },
  ];

  return {
    createClient: () => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: '123' } },
          error: null,
        }),
      },
      from: jest.fn((table) => {
        const base = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gt: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn(),
          single: jest.fn(),
        };

        switch (table) {
          case 'profile':
            return {
              ...base,
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: { full_name: 'John Doe' },
                error: null,
              }),
            };
          case 'volunteer_events':
            return {
              ...base,
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              gt: jest.fn().mockReturnThis(),
              order: jest.fn().mockResolvedValue({
                data: mockEvents,
                error: null,
              }),
            };
          case 'volunteer_history':
            return {
              ...base,
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              order: jest.fn().mockReturnThis(),
              limit: jest.fn().mockResolvedValue({
                data: mockHistory,
                error: null,
              }),
            };
          default:
            return base;
        }
      }),
    }),
  };
});

describe('VolunteerDashboard', () => {

    beforeEach(() => {
        mockPush.mockClear();
      });

  it('renders user name after loading', async () => {
    render(<VolunteerDashboard />);
    await screen.findByText(/John Doe/i);
  });

  it('renders upcoming events', async () => {
    await waitFor(async () => {
      render(<VolunteerDashboard />);
      expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  it('renders first two volunteer history entries only when collapsed', async () => {
    await waitFor(async () => {
      render(<VolunteerDashboard />);
      expect(await screen.findByText(/Community Center/i)).toBeInTheDocument();
      expect(await screen.findByText(/Shelter/i)).toBeInTheDocument();
      expect(screen.queryByText(/Park Cleanup/i)).not.toBeInTheDocument();
    });
  });

  it('expands volunteer history when toggle clicked', async () => {
    await waitFor(async () => {
      render(<VolunteerDashboard />);
      const toggleBtn = await screen.findByTestId('toggle-history');
      fireEvent.click(toggleBtn);
      expect(await screen.findByText(/Park Cleanup/i)).toBeInTheDocument();
    });
  });

  it('navigates to notifications page when bell is clicked', async () => {
    await waitFor(async () => {
      render(<VolunteerDashboard />);
      const bellButton = await screen.findAllByRole('button');
      fireEvent.click(bellButton[0]);
      expect(mockPush).toHaveBeenCalledWith('/user/notifications');
    });
  });
  
});
