import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Item, SongData } from "../../types";
import React from "react";

export const loader: LoaderFunction = async () => {
  const url = "https://eau8opmlk7.execute-api.eu-central-1.amazonaws.com/items";

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    const data: Item[] = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching items:", error);

    return new Response(
      JSON.stringify({ error: "Unable to fetch items from the database" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export default function Dashboard() {
  const loaderData = useLoaderData<SongData[]>();

  console.log(loaderData);

  const formattedData = loaderData.map((item) => ({
    id: item.id,
    name: item.name,
    songList: JSON.parse(item.songList),
  }));

  console.log(formattedData);

  const [selectedList, setSelectedList] = React.useState<SongData | null>(null);

  function handleSelectList(name: string) {
    setSelectedList(null);
    const list = formattedData.find((item) => item.name === name);
    setSelectedList(list || null);
  }

  return (
    <div className="flex gap-8 w-full justify-around px-16 items-start">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Songs</h1>
        {selectedList ? (
          <ul className="flex flex-col items-center justify-start gap-4 p-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-greenSecondary scrollbar-track-grayPrimary">
            {selectedList.songList.map((song, index) => (
              <div key={selectedList.id} className="flex items-center gap-2 ">
                {index + 1}.
                <li className="flex items-center justify-center bg-greenSecondary rounded h-10 px-4 text-grayPrimary">
                  {song.song} by {song.artist}
                </li>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No list selected. Please select a list.
          </p>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Saved lists</h1>
        <ul className="flex flex-col items-center justify-start gap-4 p-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-greenSecondary scrollbar-track-grayPrimary">
          {formattedData.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleSelectList(item.name)}
                className={`${
                  item.name === selectedList?.name
                    ? "bg-greenSecondary"
                    : "bg-greenPrimary"
                } text-grayPrimary rounded-full px-8 py-1 text-xl`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
