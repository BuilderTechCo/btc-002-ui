import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, type SkeletonVariant } from "./skeleton";
import { Separator } from "../separator";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: {
    // `centered` shrink-wraps el contenedor y los skeletons (width 100%)
    // quedan con ancho 0. `padded` conserva el ancho disponible.
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "text",
        "rect",
        "circle",
        "card",
        "table-row",
      ] as SkeletonVariant[],
    },
    animated: {
      control: "boolean",
    },
    lines: {
      control: "number",
      min: 1,
      max: 10,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextDefault: Story = {
  args: {
    variant: "text",
  },
};

export const TextMultipleLines: Story = {
  args: {
    variant: "text",
    lines: 3,
  },
};

export const TextManyLines: Story = {
  args: {
    variant: "text",
    lines: 5,
  },
};

export const RectDefault: Story = {
  args: {
    variant: "rect",
    width: "100%",
    height: "120px",
  },
};

export const RectSquare: Story = {
  args: {
    variant: "rect",
    width: "100px",
    height: "100px",
  },
};

export const RectWide: Story = {
  args: {
    variant: "rect",
    width: "300px",
    height: "60px",
  },
};

export const CircleSmall: Story = {
  args: {
    variant: "circle",
    width: "32px",
    height: "32px",
  },
};

export const CircleMedium: Story = {
  args: {
    variant: "circle",
    width: "48px",
    height: "48px",
  },
};

export const CircleLarge: Story = {
  args: {
    variant: "circle",
    width: "80px",
    height: "80px",
  },
};

export const Card: Story = {
  args: {
    variant: "card",
    width: "100%",
    height: "200px",
  },
};

export const CardSmall: Story = {
  args: {
    variant: "card",
    width: "280px",
    height: "160px",
  },
};

export const TableRow: Story = {
  args: {
    variant: "table-row",
    width: "100%",
    height: "48px",
  },
};

export const Static: Story = {
  args: {
    variant: "rect",
    width: "200px",
    height: "100px",
    animated: false,
  },
};

export const CardWithContent: Story = {
  render: () => (
    <div className="w-80 space-y-btc-4">
      <Skeleton variant="rect" width="100%" height="160px" />
      <Skeleton variant="text" lines={1} className="w-3/4" />
      <Skeleton variant="text" lines={3} />
      <div className="flex gap-btc-3 pt-btc-2">
        <Skeleton variant="circle" width="32px" height="32px" />
        <Skeleton variant="text" lines={2} className="flex-1" />
      </div>
    </div>
  ),
};

export const ArticleLayout: Story = {
  render: () => (
    <div className="w-96 space-y-btc-6">
      <Skeleton variant="text" lines={1} className="w-1/3" />
      <Skeleton variant="rect" width="100%" height="240px" />
      <Skeleton variant="text" lines={5} />
      <Skeleton variant="text" lines={4} />
      <Skeleton variant="text" lines={3} />
    </div>
  ),
};

export const ProfileCard: Story = {
  render: () => (
    <div className="w-72">
      <div className="bg-btc-surface border border-btc-border-default rounded-btc-lg p-btc-6 space-y-btc-4">
        <div className="flex items-center gap-btc-4">
          <Skeleton variant="circle" width="56px" height="56px" />
          <div className="flex-1 space-y-btc-2">
            <Skeleton variant="text" lines={1} className="w-1/2" />
            <Skeleton variant="text" lines={1} className="w-1/3" />
          </div>
        </div>
        <Separator />
        <div className="space-y-btc-3">
          <Skeleton variant="text" lines={1} />
          <Skeleton variant="text" lines={1} className="w-5/6" />
          <Skeleton variant="text" lines={2} />
        </div>
        <Separator />
        <div className="flex gap-btc-3">
          <Skeleton variant="rect" width="100px" height="36px" />
          <Skeleton variant="rect" width="100px" height="36px" />
        </div>
      </div>
    </div>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-btc-border-default">
              <th className="text-left p-btc-3 text-btc-caption font-medium text-btc-text-muted">
                Name
              </th>
              <th className="text-left p-btc-3 text-btc-caption font-medium text-btc-text-muted">
                Role
              </th>
              <th className="text-left p-btc-3 text-btc-caption font-medium text-btc-text-muted">
                Status
              </th>
              <th className="text-left p-btc-3 text-btc-caption font-medium text-btc-text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, i) => (
              <tr key={i} className="border-b border-btc-border-subtle">
                <td className="p-btc-3">
                  <Skeleton variant="text" lines={1} className="w-32" />
                </td>
                <td className="p-btc-3">
                  <Skeleton variant="text" lines={1} className="w-24" />
                </td>
                <td className="p-btc-3">
                  <Skeleton variant="rect" width="80px" height="24px" />
                </td>
                <td className="p-btc-3">
                  <Skeleton variant="rect" width="60px" height="28px" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div className="w-80 space-y-btc-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-btc-3 p-btc-3 bg-btc-surface border border-btc-border-default rounded-btc-md"
        >
          <Skeleton variant="circle" width="40px" height="40px" />
          <div className="flex-1 space-y-btc-1">
            <Skeleton variant="text" lines={1} className="w-2/3" />
            <Skeleton variant="text" lines={1} className="w-1/2" />
          </div>
          <Skeleton variant="rect" width="80px" height="32px" />
        </div>
      ))}
    </div>
  ),
};
