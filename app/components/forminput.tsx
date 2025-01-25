import { FormInputPorps } from "types";
import clsx from "clsx";

export default function FormInput({
  name,
  label = "",
  defaultValue = "",
  disabled = false,
  type = "text",
  className,
  labelClassName,
}: FormInputPorps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <label className={labelClassName} htmlFor={name}>
        {label}
      </label>
      <input
        name={name}
        id={name}
        defaultValue={defaultValue}
        type={type}
        disabled={disabled}
        className={clsx(
          "rounded py-1 w-48 text-center bg-customBabyBlue text-customGray",
          className
        )}
      />
    </div>
  );
}
