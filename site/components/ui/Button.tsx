import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 duration-200 active:scale-95",
          {
            "bg-primary text-white hover:bg-primary-dark": variant === "default",
            "border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent": variant === "outline",
            "hover:bg-black/5": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "h-12 px-6 py-2": size === "default",
            "h-10 rounded-md px-4": size === "sm",
            "h-14 rounded-xl px-10 text-base font-bold": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
