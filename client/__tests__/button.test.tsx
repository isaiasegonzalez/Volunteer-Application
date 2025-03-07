
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../components/ui/button";
import "@testing-library/jest-dom";

describe("Button Component", () => {
  test("renders button with default text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("applies the correct variant and size classes", () => {
    render(<Button variant="destructive" size="lg">Delete</Button>);
    
    const button = screen.getByText("Delete");
    
    expect(button).toHaveClass("bg-destructive"); // Ensures the `destructive` class is applied
    expect(button).toHaveClass("h-11"); // Ensures the `lg` size class is applied
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText("Click Me"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
