import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Harmony Hub" },
    { name: "description", content: "Welcome to Harmony Hub!" },
  ];
};

export default function Home() {
  return (
    <div className=" flex items-center justify-center h-full">
      <h1>Fill out form and search!</h1>
    </div>
  );
}
