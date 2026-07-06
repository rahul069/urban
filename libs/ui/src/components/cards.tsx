"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";

export const ProfileCard = ({
  title,
  description,
  content,
  footer,
}: {
  title: string;
  description?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export const BookingCard = ({
  title,
  description,
  content,
  footer,
}: {
  title: string;
  description?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};