import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

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
        "bg-customPink text-customDarkGray px-8 py-2 rounded-full text-xl",
        className
      )}
    >
      {children}
    </button>
  );
}
