import type { ActionFunction, LoaderFunction } from "@remix-run/node";
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

export const action: ActionFunction = async () => {
  console.log("hello form aciton");
};

export default function Dashboard() {
  const loaderData = useLoaderData<SongData[]>();

  console.log(loaderData);

  const formattedData = loaderData
    .map((item) => ({
      id: item.id,
      name: item.name,
      songList: JSON.parse(item.songList),
      createdAt: item.createdAt,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  console.log(formattedData);

  const [selectedList, setSelectedList] = React.useState<SongData | null>(null);

  function handleSelectList(id: string) {
    const list = formattedData.find((item) => item.id === id);
    if (list) setSelectedList(list);
  }

  return (
    <div className="grid grid-cols-2 w-full items-start px-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Song list</h1>
        {selectedList ? (
          <>
            <p>List name: {selectedList.name}</p>
            <ul className="flex flex-col items-center justify-start gap-4 p-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-greenSecondary scrollbar-track-grayPrimary">
              {selectedList.songList.map((song, index) => (
                <div
                  key={song.song + index}
                  className="flex items-center gap-2 "
                >
                  {index + 1}.
                  <li className="flex items-center justify-center bg-greenSecondary rounded px-4 py-2 text-grayPrimary">
                    {song.song} by {song.artist}
                  </li>
                </div>
              ))}
            </ul>
          </>
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
                onClick={() => handleSelectList(item.id)}
                className={`${
                  item.id === selectedList?.id
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
