import type { Meta, StoryObj } from "@storybook/react";
import { NavTabs, SidebarDropdown } from "./navigation";
import { Button } from "./ui/button";

const meta: Meta<typeof NavTabs> = {
  title: "Components/Navigation",
  component: NavTabs,
};

export default meta;

type Story = StoryObj<typeof NavTabs>;

export const Tabs: Story = {
  args: {
    defaultValue: "tab1",
    tabs: [
      { value: "tab1", label: "Tab 1" },
      { value: "tab2", label: "Tab 2" },
    ],
  },
};

export const Dropdown: Story = {
  render: () => (
    <SidebarDropdown
      trigger={<Button>Open Menu</Button>}
      items={[
        { value: "item1", label: "Item 1" },
        { value: "item2", label: "Item 2" },
      ]}
    />
  ),
};