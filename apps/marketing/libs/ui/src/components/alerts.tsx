"use client";

import { Alert, AlertTitle, AlertDescription } from "../../@/components/ui/alert";

export const NotificationAlert = ({ title, description }: { title: string; description?: string }) => {
  return (
    <Alert>
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};

export const ErrorAlert = ({ title, description }: { title: string; description?: string }) => {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};