import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardActions,
  type CardVariant,
  type CardPadding,
} from "./card";
import { Button } from "../button";
import { Icon } from "../../lib/icon";
import { useState } from "react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outlined",
        "elevated",
        "elevated-bordered",
      ] as CardVariant[],
      description: "Visual variant of the card",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"] as CardPadding[],
      description: "Internal padding",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: "Card content",
  },
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a card description providing additional context.
        </CardDescription>
      </CardHeader>
      <CardContent>Card content goes here</CardContent>
    </Card>
  ),
};

export const WithHeaderClosable: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    if (!open)
      return <div className="text-btc-text-muted text-sm">Card closed</div>;
    return (
      <Card>
        <CardHeader
          onClose={() => setOpen(false)}
          closeAriaLabel="Cerrar tarjeta"
        >
          <CardTitle>Closable Card</CardTitle>
          <CardDescription>
            Click the × button to close this card.
          </CardDescription>
        </CardHeader>
        <CardContent>Card content goes here</CardContent>
      </Card>
    );
  },
};

export const WithIcon: Story = {
  args: {
    variant: "elevated-bordered",
    padding: "lg",
  },

  render: () => (
    <Card>
      <CardHeader
        leftIcon={
          <Icon name="user" category="nav" size="md" aria-hidden="true" />
        }
      >
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent>Profile content goes here</CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardContent>Card content goes here</CardContent>
      <CardFooter>
        <CardActions>
          <Button size="sm">Action</Button>
        </CardActions>
      </CardFooter>
    </Card>
  ),
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: "Outlined card content",
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: "Elevated card content",
  },
};

export const ElevatedBordered: Story = {
  args: {
    variant: "elevated-bordered",
    children: "Elevated bordered card content",
  },
};

export const NoPadding: Story = {
  args: {
    padding: "none",
    children: "No padding card",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-btc-4 max-w-2xl">
      {(
        [
          "default",
          "outlined",
          "elevated",
          "elevated-bordered",
        ] as CardVariant[]
      ).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardTitle>
              {variant.charAt(0).toUpperCase() +
                variant.slice(1).replace("-", " ")}
            </CardTitle>
          </CardHeader>
          <CardContent>This is a {variant} card variant.</CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const ComplexCard: Story = {
  render: () => (
    <Card variant="elevated" className="w-[350px]">
      <CardHeader>
        <CardTitle>Complex Card Example</CardTitle>
        <CardDescription>
          This card demonstrates all sub-components working together.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-btc-text-primary">
          Card content with multiple paragraphs and elements.
        </p>
        <div className="mt-btc-4 p-btc-3 bg-btc-raised rounded-btc-md">
          <strong>Highlighted section</strong> with additional context.
        </div>
      </CardContent>
      <CardFooter className="border-t border-btc-border-default">
        <CardActions className="justify-end gap-btc-2">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </CardActions>
      </CardFooter>
    </Card>
  ),
};
