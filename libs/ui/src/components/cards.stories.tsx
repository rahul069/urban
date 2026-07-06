import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard, BookingCard } from "./cards";

const meta: Meta<typeof ProfileCard> = {
  title: "Components/Cards",
  component: ProfileCard,
};

export default meta;

type Story = StoryObj<typeof ProfileCard>;

export const Profile: Story = {
  args: {
    title: "Provider Profile",
    description: "Experienced professional",
    content: <p>Service details here.</p>,
  },
};

export const Booking: Story = {
  render: () => (
    <BookingCard
      title="Booking Request"
      description="New request from customer"
      content={<p>Booking details here.</p>}
    />
  ),
};