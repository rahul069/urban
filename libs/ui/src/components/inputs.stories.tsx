import type { Meta, StoryObj } from "@storybook/react";
import { TextInput, EmailInput, PasswordInput, FileUploadInput } from "./inputs";

const meta: Meta<typeof TextInput> = {
  title: "Components/Inputs",
  component: TextInput,
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Text: Story = {
  args: {
    placeholder: "Enter text",
  },
};

export const Email: Story = {
  render: () => <EmailInput placeholder="Enter email" />,
};

export const Password: Story = {
  render: () => <PasswordInput placeholder="Enter password" />,
};

export const FileUpload: Story = {
  render: () => <FileUploadInput />,
};