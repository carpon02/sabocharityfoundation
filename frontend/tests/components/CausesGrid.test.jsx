import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { render } from "../utils/testUtils";
import CausesGrid from "@/components/CausesGrid";
import * as campaignsSlice from "@/features/campaign/campaignsSlice";

// Mock the fetchAllCampaigns action
vi.mock("@/features/campaign/campaignsSlice", async () => {
  const actual = await vi.importActual("@/features/campaign/campaignsSlice");
  return {
    ...actual,
    fetchAllCampaigns: vi.fn(() => ({ type: "campaigns/fetchAll" })),
  };
});

describe("CausesGrid Component", () => {
  const mockCampaigns = [
    {
      _id: "1",
      title: "Education for All",
      description: "Providing quality education to underprivileged children",
      shortDescription: "Education campaign",
      category: "education",
      targetAmount: 100000,
      raisedAmount: 50000,
      images: [{ url: "https://example.com/img1.jpg", isPrimary: true }],
    },
    {
      _id: "2",
      title: "Healthcare Initiative",
      description: "Improving healthcare access in rural areas",
      shortDescription: "Healthcare campaign",
      category: "health",
      targetAmount: 200000,
      raisedAmount: 75000,
      images: [{ url: "https://example.com/img2.jpg", isPrimary: true }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state", () => {
    const preloadedState = {
      campaigns: {
        campaigns: [],
        loading: true,
        error: null,
      },
    };

    render(<CausesGrid />, { preloadedState });

    expect(screen.getByText(/Syncing Mission Data/i)).toBeInTheDocument();
  });

  it("should dispatch fetchAllCampaigns on mount", () => {
    const preloadedState = {
      campaigns: {
        campaigns: [],
        loading: false,
        error: null,
      },
    };

    render(<CausesGrid />, { preloadedState });

    expect(campaignsSlice.fetchAllCampaigns).toHaveBeenCalledWith({ limit: 4 });
  });

  it("should render campaigns when loaded", async () => {
    const preloadedState = {
      campaigns: {
        campaigns: mockCampaigns,
        loading: false,
        error: null,
      },
    };

    render(<CausesGrid />, { preloadedState });

    await waitFor(() => {
      expect(screen.getByText("Education for All")).toBeInTheDocument();
      expect(screen.getByText("Healthcare Initiative")).toBeInTheDocument();
    });
  });

  it("should display campaign progress percentage", async () => {
    const preloadedState = {
      campaigns: {
        campaigns: mockCampaigns,
        loading: false,
        error: null,
      },
    };

    render(<CausesGrid />, { preloadedState });

    await waitFor(() => {
      // Education campaign: 50000/100000 = 50%
      expect(screen.getByText("50%")).toBeInTheDocument();
      // Healthcare campaign: 75000/200000 = 37.5% rounded to 38%
      expect(screen.getByText("38%")).toBeInTheDocument();
    });
  });

  it("should display raised amount", async () => {
    const preloadedState = {
      campaigns: {
        campaigns: mockCampaigns,
        loading: false,
        error: null,
      },
    };

    render(<CausesGrid />, { preloadedState });

    await waitFor(() => {
      expect(screen.getByText(/₦50,000/)).toBeInTheDocument();
      expect(screen.getByText(/₦75,000/)).toBeInTheDocument();
    });
  });

  it("should display category labels", async () => {
    const preloadedState = {
      campaigns: {
        campaigns: mockCampaigns,
        loading: false,
        error: null,
      },
    };

    render(<CausesGrid />, { preloadedState });

    await waitFor(() => {
      expect(screen.getByText("education")).toBeInTheDocument();
      expect(screen.getByText("health")).toBeInTheDocument();
    });
  });

  it("should render link to view all campaigns", () => {
    const preloadedState = {
      campaigns: {
        campaigns: mockCampaigns,
        loading: false,
        error: null,
      },
    };

    render(<CausesGrid />, { preloadedState });

    const link = screen.getByText(/Access Full Directory/i).closest("a");
    expect(link).toHaveAttribute("href", "/campaigns");
  });

  it("should limit display to 4 campaigns", () => {
    const manyCampaigns = Array.from({ length: 10 }, (_, i) => ({
      _id: `${i + 1}`,
      title: `Campaign ${i + 1}`,
      description: `Description ${i + 1}`,
      category: "education",
      targetAmount: 100000,
      raisedAmount: 10000,
      images: [{ url: `https://example.com/img${i}.jpg`, isPrimary: true }],
    }));

    const preloadedState = {
      campaigns: {
        campaigns: manyCampaigns,
        loading: false,
        error: null,
      },
    };

    const { container } = render(<CausesGrid />, { preloadedState });

    // Should only render 4 campaign cards
    const campaignCards = container.querySelectorAll('a[href^="/campaigns/"]');
    expect(campaignCards).toHaveLength(4);
  });

  it("should handle empty campaigns array", () => {
    const preloadedState = {
      campaigns: {
        campaigns: [],
        loading: false,
        error: null,
      },
    };

    const { container } = render(<CausesGrid />, { preloadedState });

    const campaignCards = container.querySelectorAll('a[href^="/campaigns/"]');
    expect(campaignCards).toHaveLength(0);
  });

  it("should use fallback category icon for unknown categories", async () => {
    const campaignWithUnknownCategory = {
      _id: "1",
      title: "Unknown Category Campaign",
      description: "Test",
      category: "unknown-category",
      targetAmount: 100000,
      raisedAmount: 50000,
      images: [{ url: "https://example.com/img.jpg", isPrimary: true }],
    };

    const preloadedState = {
      campaigns: {
        campaigns: [campaignWithUnknownCategory],
        loading: false,
        error: null,
      },
    };

    render(<CausesGrid />, { preloadedState });

    await waitFor(() => {
      expect(screen.getByText("Unknown Category Campaign")).toBeInTheDocument();
    });
  });
});
