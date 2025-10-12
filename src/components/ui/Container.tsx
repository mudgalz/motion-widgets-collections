import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const containerVariants = cva("mx-auto px-4 sm:px-6 lg:px-8 h-full w-full", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-7xl",
      xl: "max-w-9xl",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

type ContainerElement = "div" | "main" | "header" | "section" | "footer";

interface ContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> {
  children?: React.ReactNode;
  as?: ContainerElement;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={twMerge(containerVariants({ size, className }))}
      {...props}>
      {children}
    </Component>
  );
};

export { Container, containerVariants };
