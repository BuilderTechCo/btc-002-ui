import type { Meta, StoryObj } from "@storybook/react";
import {
  TextField,
  type TextFieldVariant,
  type TextFieldSize,
} from "./textfield";
import { Button } from "../button";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "filled", "outline"] as TextFieldVariant[],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"] as TextFieldSize[],
      description: "Input size",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "Input type",
    },
    disabled: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    clearable: {
      control: "boolean",
    },
    showPasswordToggle: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Email Address",
    placeholder: "you@example.com",
    type: "email",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    value: "invalid-email",
    error: true,
    errorMessage: "Please enter a valid email address",
    type: "email",
  },
};

export const WithHelpText: Story = {
  args: {
    label: "Password",
    type: "password",
    helpText: "Must be at least 8 characters",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    value: "Cannot edit this",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Read Only",
    value: "Pre-filled value",
    readOnly: true,
  },
};

export const Required: Story = {
  args: {
    label: "Required Field",
    placeholder: "This field is required",
    required: true,
  },
};

export const FilledVariant: Story = {
  args: {
    variant: "filled",
    placeholder: "Filled variant",
  },
};

export const OutlineVariant: Story = {
  args: {
    variant: "outline",
    placeholder: "Outline variant",
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    leftIcon: "search",
    leftIconCategory: "nav",
  },
};

export const WithRightIcon: Story = {
  args: {
    label: "Website",
    placeholder: "https://example.com",
    rightIcon: "externalLink",
    rightIconCategory: "action",
  },
};

export const Clearable: Story = {
  args: {
    label: "Clearable",
    placeholder: "Type and clear",
    clearable: true,
    value: "Pre-filled value",
  },
};

export const PasswordWithToggle: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    showPasswordToggle: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-btc-4 w-64">
      {(["sm", "md", "lg"] as TextFieldSize[]).map((size) => (
        <TextField key={size} size={size} placeholder={`Size: ${size}`} />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-btc-4 w-64">
      {(["default", "filled", "outline"] as TextFieldVariant[]).map(
        (variant) => (
          <TextField
            key={variant}
            variant={variant}
            placeholder={`Variant: ${variant}`}
          />
        ),
      )}
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="w-80 space-y-btc-4">
      <TextField label="First Name" placeholder="John" required />
      <TextField label="Last Name" placeholder="Doe" required />
      <TextField
        label="Email"
        type="email"
        placeholder="john@example.com"
        required
      />
      <TextField
        label="Password"
        type="password"
        placeholder="••••••••"
        showPasswordToggle
      />
      <TextField label="Bio" placeholder="Tell us about yourself" />
      <div className="flex gap-btc-2">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>
    </form>
  ),
};
