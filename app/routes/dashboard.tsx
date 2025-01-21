import type { LoaderFunction } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
import { mockData } from "../../mock";
import { Item, SongData } from "../../types";
import React from "react";

export const loader: LoaderFunction = async () => {
  const url = "https://sobp5p7w82.execute-api.eu-central-1.amazonaws.com/items";

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    const data: Item[] = await response.json();
    console.log(data);

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
  // const loaderData = useLoaderData<Item[]>();
  const [selectedList, setSelectedList] = React.useState<SongData | null>(null);

  function handleSelectList(name: string) {
    const list = mockData.find((item) => item.name === name);
    setSelectedList(list || null);
  }

  return (
    <div className="flex gap-8 w-full justify-around px-16 items-start">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Songs</h1>
        {selectedList ? (
          <ul className="flex flex-col items-center justify-start gap-4 p-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-greenSecondary scrollbar-track-grayPrimary">
            {selectedList.recommendations.map((song, index) => (
              <div key={index} className="flex items-center gap-2 ">
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
          {mockData.map((item, index) => (
            <li key={index}>
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
