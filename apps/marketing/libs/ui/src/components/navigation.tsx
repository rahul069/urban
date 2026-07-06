"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../@/components/ui/dropdown-menu";

export const NavTabs = ({
  tabs,
  defaultValue,
}: {
  tabs: { value: string; label: string }[];
  defaultValue: string;
}) => {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export const SidebarDropdown = ({
  trigger,
  items,
}: {
  trigger: React.ReactNode;
  items: { value: string; label: string }[];
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuItem key={item.value} onSelect={() => {}}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};