import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/Sidebar";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/dashboard"),
  useRouter: () => ({ push: mockPush }),
}));

// Mock Supabase
const mockSignOut = vi.fn().mockResolvedValue({ error: null });
vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: vi.fn(() => ({
    auth: { signOut: mockSignOut },
  })),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders navigation items", () => {
    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Scholarships")).toBeInTheDocument();
    expect(screen.getByText("Papers")).toBeInTheDocument();
    expect(screen.getByText("SOP Analyzer")).toBeInTheDocument();
    expect(screen.getByText("Roadmap")).toBeInTheDocument();
  });

  it("calls logout and redirects to home when logout button is clicked", async () => {
    render(<Sidebar />);

    const logoutBtn = screen.getByText("Log out");
    fireEvent.click(logoutBtn);

    expect(mockSignOut).toHaveBeenCalled();
    // Wait for the async signOut to finish (in a real test we'd await, but here we can just check if push was called if it's sync enough, but since it's async we should use findBy or wait)
    // For this simple mock, we can just use a timeout or assume it resolves
    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
