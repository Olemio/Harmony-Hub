import clsx from "clsx";
import { ButtonProps } from "types";

export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        disabled
          ? "text-customPink bg-customDarkGray px-8 py-2 rounded-full"
          : "bg-customPink text-customDarkGray px-8 py-2 rounded-full",
        className
      )}
    >
      {children}
    </button>
  );
}
