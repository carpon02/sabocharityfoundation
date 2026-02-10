import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { render } from "../utils/testUtils";
import Payments from "../../src/component/pages/Payments";
import * as adminPaymentsSlice from "../../src/features/payment/adminPaymentsSlice";

// Mock the components used in Payments
vi.mock("../../src/component/shared", () => ({
  StatsCard: ({ label, value }) => (
    <div data-testid="stats-card">
      {label}: {value}
    </div>
  ),
}));

// Mock the slice actions
vi.mock("../../src/features/payment/adminPaymentsSlice", async () => {
  const actual = await vi.importActual(
    "../../src/features/payment/adminPaymentsSlice",
  );
  return {
    ...actual,
    fetchPaymentStats: vi.fn(() => ({ type: "adminPayments/fetchStats" })),
    fetchAllPayments: vi.fn(() => ({ type: "adminPayments/fetchAll" })),
    approvePayment: vi.fn(() => ({ type: "adminPayments/approve" })),
    setFilters: vi.fn((filters) => ({
      type: "adminPayments/setFilters",
      payload: filters,
    })),
  };
});

// Mock ThemeContext
vi.mock("../../src/context/ThemeContext", () => ({
  useTheme: () => ({ darkMode: false }),
}));

describe("Admin Payments Page", () => {
  const mockPayments = [
    {
      _id: "p1",
      donationId: "DON-001",
      amount: 5000,
      donor: { fullName: "Alice Doe" },
      campaign: { title: "Education Project" },
      approvalStatus: "pending",
      paymentMethod: "bank_transfer",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "p2",
      donationId: "DON-002",
      amount: 10000,
      donor: { fullName: "Bob Smith" },
      campaign: { title: "Health Mission" },
      approvalStatus: "approved",
      paymentMethod: "paystack",
      createdAt: new Date().toISOString(),
    },
  ];

  const initialState = {
    adminPayments: {
      payments: mockPayments,
      stats: {
        overview: {
          totalPayments: 15000,
          successful: { count: 1 },
          pending: { count: 1 },
        },
      },
      pagination: { page: 1, pages: 1, total: 2, limit: 20 },
      filters: { search: "" },
      loading: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the payments page title", () => {
    render(<Payments />, { preloadedState: initialState });
    expect(screen.getByText(/Financial Stewardship/i)).toBeInTheDocument();
  });

  it("should display payment statistics", () => {
    render(<Payments />, { preloadedState: initialState });
    expect(screen.getByText(/Mobilized Capital/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Missions/i)).toBeInTheDocument();
  });

  it("should render the list of payments", () => {
    render(<Payments />, { preloadedState: initialState });
    expect(screen.getByText("Education Project")).toBeInTheDocument();
    expect(screen.getByText("Health Mission")).toBeInTheDocument();
    expect(screen.getByText("Alice Doe")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
  });

  it("should show pending status for pending payments", () => {
    render(<Payments />, { preloadedState: initialState });
    expect(screen.getByText(/Awaiting Verification/i)).toBeInTheDocument();
  });

  it("should open approval modal when clicking approve button", async () => {
    render(<Payments />, { preloadedState: initialState });

    // Find the approve button (the one with Check icon)
    // In our component, it's a button with only icons
    const approveButtons = screen.getAllByRole("button").filter((btn) => {
      // We can check classes or icons if we mocks them differently, but here we'll just use the first one for pending payments
      return btn.querySelector("svg") !== null;
    });

    // The first Check button is likely the one we want
    fireEvent.click(approveButtons[1]); // Skipping Export Fiscal Dossier button

    await waitFor(() => {
      expect(screen.getByText("Validate Signature?")).toBeInTheDocument();
    });
  });

  it("should dispatch setFilters when typing in search", () => {
    render(<Payments />, { preloadedState: initialState });
    const searchInput = screen.getByPlaceholderText(
      /Scanning transaction signatures/i,
    );

    fireEvent.change(searchInput, { target: { value: "Alice" } });

    expect(adminPaymentsSlice.setFilters).toHaveBeenCalledWith({
      search: "Alice",
      page: 1,
    });
  });

  it("should dispatch fetchAllPayments on mount", () => {
    render(<Payments />, { preloadedState: initialState });
    expect(adminPaymentsSlice.fetchAllPayments).toHaveBeenCalled();
  });
});
