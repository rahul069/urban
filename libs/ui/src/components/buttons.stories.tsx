import type { Meta, StoryObj } from "@storybook/react";
import { PrimaryButton, SecondaryButton, DangerButton } from "./buttons";

const meta: Meta<typeof PrimaryButton> = {
  title: "Components/Buttons",
  component: PrimaryButton,
};

export default meta;

type Story = StoryObj<typeof PrimaryButton>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  render: () => <SecondaryButton>Secondary Button</SecondaryButton>,
};

export const Danger: Story = {
  render: () => <DangerButton>Danger Button</DangerButton>,
};