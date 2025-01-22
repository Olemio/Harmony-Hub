import clsx from "clsx";
import { ButtonProps } from "types";

export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "bg-customPink text-customDarkGray px-8 py-2 rounded-full",
        className
      )}
    >
      {children}
    </button>
  );
}
