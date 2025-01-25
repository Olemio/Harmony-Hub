import clsx from "clsx";
import { ButtonProps } from "types";

export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
  dark = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        dark
          ? "text-customPink bg-customDarkGray rounded-full border border-customPink"
          : "bg-customPink text-customDarkGray rounded-full",
        className
      )}
    >
      {children}
    </button>
  );
}
