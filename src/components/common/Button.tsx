import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  const variantClass = {
    primary: "cybrez-button-primary",
    secondary: "cybrez-button-secondary",
    ghost: "cybrez-button-ghost",
    danger: "cybrez-button-danger",
  }[variant];

  return (
    <button
      className={`${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}