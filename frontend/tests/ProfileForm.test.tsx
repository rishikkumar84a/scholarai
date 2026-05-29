import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileForm } from "@/components/ProfileForm";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock api wrapper
const mockPost = vi.fn().mockResolvedValue({ success: true });
vi.mock("@/lib/api", () => ({
  api: { post: (...args: any[]) => mockPost(...args) },
}));

describe("ProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText("Target Degree")).toBeInTheDocument();
    expect(screen.getByLabelText("Current Major")).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Countries/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Research Interests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GPA/i)).toBeInTheDocument();
  });

  it("submits the form data correctly and redirects", async () => {
    render(<ProfileForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Current Major"), {
      target: { value: "Computer Science" },
    });
    fireEvent.change(screen.getByLabelText(/Target Countries/i), {
      target: { value: "USA, UK, " }, // trailing comma/space to test parsing
    });
    fireEvent.change(screen.getByLabelText(/Research Interests/i), {
      target: { value: "AI, Machine Learning" },
    });
    fireEvent.change(screen.getByLabelText(/GPA/i), {
      target: { value: "3.8" },
    });

    // Submit
    const submitBtn = screen.getByRole("button", { name: "Save Profile" });
    fireEvent.click(submitBtn);

    // Should call API with formatted data
    await vi.waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/api/profiles", {
        target_degree: "Masters",
        current_major: "Computer Science",
        target_countries: ["USA", "UK"],
        research_interests: ["AI", "Machine Learning"],
        gpa: 3.8,
      });
    });

    // Should redirect to dashboard
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("displays error message if API fails", async () => {
    mockPost.mockRejectedValueOnce(new Error("API Error"));

    render(<ProfileForm />);

    fireEvent.change(screen.getByLabelText("Current Major"), {
      target: { value: "CS" },
    });

    const submitBtn = screen.getByRole("button", { name: "Save Profile" });
    fireEvent.click(submitBtn);

    const errorMsg = await screen.findByText("API Error");
    expect(errorMsg).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
