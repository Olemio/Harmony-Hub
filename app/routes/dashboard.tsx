import type { LoaderFunction } from "@remix-run/node";
import {
  FetcherWithComponents,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Item, SongData } from "../../types";
import React from "react";
import Button from "~/components/button";

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
  const fetcher = useFetcher();

  const formattedData = loaderData
    .map((item) => ({
      id: item.id,
      name: item.name,
      songList: JSON.parse(String(item.songList)),
      createdAt: item.createdAt,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt as Date).getTime() -
        new Date(a.createdAt as Date).getTime()
    );

  const [selectedList, setSelectedList] = React.useState<SongData | null>(null);

  function handleSelectList(id: string) {
    const list = formattedData.find((item) => item.id === id);
    if (list) setSelectedList(list);
  }

  return (
    <div className="grid grid-cols-2 gap-10 mt-4">
      <SongList list={selectedList} />
      <SavedList
        fetcher={fetcher}
        data={formattedData}
        handleSelectList={handleSelectList}
        id={selectedList?.id}
      />
    </div>
  );
}

function SongList({ list }: { list: SongData | null }) {
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-3xl">Songs</h1>

      {list ? (
        <ul className="flex flex-col overflow-y-auto h-80 min-w-80 bg-customDarkGray rounded px-16 py-16 text-customPink text-center gap-2 scrollbar-thin scrollbar-thumb-customPink scrollbar-track-transparent">
          {list.songList.map((item, i) => (
            <li key={item.song + i} className="">
              {item.song} - {item.artist}
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex justify-center h-80 min-w-80 bg-customDarkGray px-16 py-16 text-customPink rounded">
          No list selected. Please select a list.
        </p>
      )}
    </div>
  );
}

function SavedList({
  fetcher,
  data,
  handleSelectList,
  id,
}: {
  fetcher: FetcherWithComponents<unknown>;
  data: SongData[];
  handleSelectList: (id: string) => void;
  id?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-3xl">Lists</h1>
      {data[0] ? (
        <ul className="flex flex-col overflow-y-auto h-80 min-w-80 gap-6 scrollbar-thin scrollbar-thumb-customPink scrollbar-track-transparent">
          {data.map((item) => (
            <li
              key={item.id}
              className="flex gap-2 px-4 items-center justify-center"
            >
              <Button
                type="button"
                onClick={() => handleSelectList(item.id)}
                disabled={item.id === id}
              >
                {item.name}
              </Button>
              <fetcher.Form method="DELETE" action="/api/deleteSong">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="text-red-500 text-2xl">
                  X
                </button>
              </fetcher.Form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex justify-center h-80 min-w-80 bg-customDarkGray px-16 py-16 text-customPink rounded">
          No saved lists. Search and save a list.
        </p>
      )}
    </div>
  );
}
