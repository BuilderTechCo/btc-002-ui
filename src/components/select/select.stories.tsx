import type { Meta, StoryObj } from "@storybook/react";
import { Select, type SelectOption, type SelectGroup } from "./select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Select size",
    },
    multiple: {
      control: "boolean",
    },
    clearable: {
      control: "boolean",
    },
    searchable: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const simpleOptions: SelectOption[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

const groupedOptions: SelectGroup[] = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
    ],
  },
];

export const Default: Story = {
  args: {
    options: simpleOptions,
    placeholder: "Select an option...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Choose Option",
    options: simpleOptions,
    placeholder: "Select...",
  },
};

export const WithValue: Story = {
  args: {
    label: "Preselected",
    options: simpleOptions,
    value: "2",
  },
};

export const WithError: Story = {
  args: {
    label: "With Error",
    options: simpleOptions,
    error: true,
    errorMessage: "Please select a valid option",
  },
};

export const WithHelpText: Story = {
  args: {
    label: "With Help",
    options: simpleOptions,
    helpText: "Choose one of the available options",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    options: simpleOptions,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    label: "Loading",
    options: simpleOptions,
    loading: true,
  },
};

export const Multiple: Story = {
  args: {
    label: "Multiple Select",
    options: simpleOptions,
    multiple: true,
    defaultValue: ["1", "2"],
    placeholder: "Select multiple...",
  },
};

export const MultipleSearchable: Story = {
  args: {
    label: "Multiple & Searchable",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
      { value: "grape", label: "Grape" },
      { value: "mango", label: "Mango" },
      { value: "pineapple", label: "Pineapple" },
    ],
    multiple: true,
    searchable: true,
    defaultValue: ["apple", "mango"],
    clearable: true,
  },
};

export const Clearable: Story = {
  args: {
    label: "Clearable",
    options: simpleOptions,
    value: "1",
    clearable: true,
  },
};

export const Searchable: Story = {
  args: {
    label: "Searchable",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
      { value: "grape", label: "Grape" },
      { value: "mango", label: "Mango" },
      { value: "pineapple", label: "Pineapple" },
    ],
    searchable: true,
    placeholder: "Search fruits...",
  },
};

export const Grouped: Story = {
  args: {
    label: "Grouped Options",
    options: groupedOptions,
    placeholder: "Select a category...",
  },
};

export const GroupedSearchable: Story = {
  args: {
    label: "Grouped & Searchable",
    options: groupedOptions,
    searchable: true,
    placeholder: "Search all...",
  },
};

export const Required: Story = {
  args: {
    label: "Required Field",
    options: simpleOptions,
    required: true,
  },
};

export const Small: Story = {
  args: {
    label: "Small",
    options: simpleOptions,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    label: "Large",
    options: simpleOptions,
    size: "lg",
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: "Some Disabled",
    options: [
      { value: "1", label: "Available Option 1" },
      { value: "2", label: "Disabled Option", disabled: true },
      { value: "3", label: "Available Option 2" },
      { value: "4", label: "Another Disabled", disabled: true },
    ],
    placeholder: "Select...",
  },
};
