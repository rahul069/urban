"use client";

import { Button } from "./ui/button";

export const PrimaryButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button variant="default" {...props}>
      {children}
    </Button>
  );
};

export const SecondaryButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button variant="secondary" {...props}>
      {children}
    </Button>
  );
};

export const DangerButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button variant="destructive" {...props}>
      {children}
    </Button>
  );
};