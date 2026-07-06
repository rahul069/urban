import { render, screen } from "@testing-library/react";
import { PrimaryButton, SecondaryButton, DangerButton } from "./buttons";

describe("Buttons", () => {
  it("renders PrimaryButton", () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("renders SecondaryButton", () => {
    render(<SecondaryButton>Click Me</SecondaryButton>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("renders DangerButton", () => {
    render(<DangerButton>Click Me</DangerButton>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });
});