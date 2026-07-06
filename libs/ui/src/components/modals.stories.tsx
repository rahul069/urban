import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmationModal, FormModal } from "./modals";
import { useState } from "react";

const meta: Meta<typeof ConfirmationModal> = {
  title: "Components/Modals",
  component: ConfirmationModal,
};

export default meta;

type Story = StoryObj<typeof ConfirmationModal>;

export const Confirmation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <ConfirmationModal
        title="Confirm Action"
        description="Are you sure?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <p>This action cannot be undone.</p>
      </ConfirmationModal>
    );
  },
};

export const Form: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <FormModal
        title="Contact Form"
        description="Fill out the form"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <form className="space-y-4">
          <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </form>
      </FormModal>
    );
  },
};