import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Harmony Hub" },
    { name: "description", content: "Welcome to Harmony Hub!" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const genre = formData.get("genre");
  const tempo = formData.get("tempo");
  const theme = formData.get("theme");
  const songAmount = formData.get("songAmount");

  console.log({ genre, tempo, theme, songAmount });

  return { success: true };
};

export default function Home() {
  const fetcher = useFetcher();
  return (
    <div className=" flex flex-col items-center justify-center h-full gap-16">
      <h1 className="text-3xl">Fill out form and search!</h1>
      <fetcher.Form method="POST" className="grid grid-cols-2 gap-10 text-xl">
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="genre">Genre:</label>
          <input
            name="genre"
            id="genre"
            className="bg-greenSecondary rounded h-12 p-2 text-center text-grayPrimary"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="genre">Tempo:</label>
          <input
            name="tempo"
            className="bg-greenSecondary rounded h-12 p-2 text-center text-grayPrimary"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="genre">Theme:</label>
          <input
            name="theme"
            className="bg-greenSecondary rounded h-12 p-2 text-center text-grayPrimary"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="genre">Amount of songs:</label>
          <input
            type="number"
            name="songAmount"
            className="bg-greenSecondary rounded h-12 p-2 text-center text-grayPrimary"
          />
        </div>
        <div className="col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-greenPrimary text-grayPrimary rounded-full m-2 px-16 py-2 text-2xl font-bold"
          >
            Search
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}
