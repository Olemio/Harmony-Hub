import { FormInputPorps } from "types";

export default function FormInput({
  name,
  label = "",
  defaultValue = "",
  disabled = false,
  type = "text",
}: FormInputPorps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        id={name}
        defaultValue={defaultValue}
        type={type}
        disabled={disabled}
        className="rounded py-1 w-48 text-center bg-customBabyBlue text-customGrayText"
      />
    </div>
  );
}
