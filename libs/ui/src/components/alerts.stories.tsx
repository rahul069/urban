import type { Meta, StoryObj } from "@storybook/react";
import { NotificationAlert, ErrorAlert } from "./alerts";

const meta: Meta<typeof NotificationAlert> = {
  title: "Components/Alerts",
  component: NotificationAlert,
};

export default meta;

type Story = StoryObj<typeof NotificationAlert>;

export const Notification: Story = {
  args: {
    title: "Notification",
    description: "This is a notification message.",
  },
};

export const Error: Story = {
  render: () => (
    <ErrorAlert title="Error" description="Something went wrong!" />
  ),
};