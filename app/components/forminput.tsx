export default function FormInput({
  name,
  label,
  defaultValue,
  type = "text",
}: {
  name: "songAmount" | "genre" | "tempo" | "theme";
  label: string;
  defaultValue: string | number;
  type?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={name}>{label}:</label>
      <input
        name={name}
        id={name}
        defaultValue={defaultValue}
        type={type}
        className="bg-greenSecondary rounded h-12 p-2 text-center text-grayPrimary"
      />
    </div>
  );
}
