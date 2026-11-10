// @buildertech/ui - Slot Component
// Primitive de composición (Radix Slot pattern) para composición de componentes

import {
  forwardRef,
  type ElementType,
  type ComponentPropsWithRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type PropsWithoutRef,
} from "react";

export type SlotProps<T extends ElementType = "div"> = {
  /** Componente o elemento a renderizar */
  as?: T;

  /** Clases adicionales */
  className?: string;

  /** Props del elemento hijo */
  children?: React.ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "ref">;

// Internal type for the default div element
type DefaultSlotProps = SlotProps<"div">;

// Slot por defecto como div - implementación simple
const SlotInternal = forwardRef<HTMLDivElement, DefaultSlotProps>(
  ({ as: Component = "div", className = "", children, ...props }, ref) => {
    return (
      <Component ref={ref} className={className} {...props}>
        {children}
      </Component>
    );
  },
);

SlotInternal.displayName = "Slot";

// Slot con soporte polimórfico para `as` prop
export const Slot = SlotInternal as ForwardRefExoticComponent<
  PropsWithoutRef<DefaultSlotProps> & RefAttributes<HTMLDivElement>
> &
  (<T extends ElementType>(
    props: SlotProps<T> & { as: T },
    ref: React.Ref<ComponentPropsWithRef<T>["ref"]>,
  ) => React.ReactElement | null);
