
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[#FFC928] text-[#21170F] border border-[#FFC928] hover:bg-[#FFE080] hover:text-[#21170F]",
        destructive:
          "bg-red-600 text-white border border-red-600 hover:bg-red-700",
        outline:
          "border border-[#C99A48] bg-transparent text-[#FFF5DF] hover:bg-[#35271B] hover:text-[#FFC928]",
        secondary:
          "bg-[#35271B] text-[#FFF5DF] border border-[#8B6740] hover:bg-[#493522] hover:text-[#FFC928]",
        ghost:
          "bg-transparent text-[#FFF5DF] hover:bg-[#35271B] hover:text-[#FFC928]",
        link:
          "bg-transparent text-[#FFC928] underline-offset-4 hover:text-[#FFE080] hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };