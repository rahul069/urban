"use client";

import { Input } from "./ui/input";

export const TextInput = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <Input type="text" {...props} />;
};

export const EmailInput = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <Input type="email" {...props} />;
};

export const PasswordInput = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <Input type="password" {...props} />;
};

export const FileUploadInput = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <Input type="file" {...props} />;
};