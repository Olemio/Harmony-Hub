export default function FormInput({
  name,
  label,
  defaultValue,
  srOnlyLabel,
  disabled,
  type = "text",
}: {
  name: "songAmount" | "genre" | "tempo" | "theme" | "name" | "songList";
  label: string;
  defaultValue: string | number;
  srOnlyLabel?: boolean;
  disabled?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={name} className={srOnlyLabel ? "sr-only" : ""}>
        {label}:
      </label>
      <input
        name={name}
        id={name}
        defaultValue={defaultValue}
        type={type}
        disabled={disabled}
        className="rounded h-10 p-2 text-center bg-customBabyBlue text-customGrayText"
      />
    </div>
  );
}
