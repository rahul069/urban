import type { Meta, StoryObj } from "@storybook/react";
import { LocationMap } from "./maps";

const meta: Meta<typeof LocationMap> = {
  title: "Components/Maps",
  component: LocationMap,
};

export default meta;

type Story = StoryObj<typeof LocationMap>;

export const Map: Story = {
  args: {
    onLocationSelect: (lat, lng) => console.log({ lat, lng }),
  },
};