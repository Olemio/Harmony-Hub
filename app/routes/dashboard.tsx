import type { LoaderFunction } from "@remix-run/node";
import {
  FetcherWithComponents,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Item, SongData } from "../../types";
import React from "react";
import Button from "~/components/button";
import { getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const idToken = session.get("idToken") as string | undefined;
  const userId = session.get("userId") as string | undefined;

  if (!idToken || !userId) {
    return [];
  }

  const url = new URL(
    "https://8tp0caiqc0.execute-api.eu-central-1.amazonaws.com/dev-harmony-hub/items"
  );
  url.searchParams.append("userId", userId);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: idToken,
      },
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

    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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

  const [selectedList, setSelectedList] = React.useState<SongData | null>(
    formattedData[0] ?? null
  );

  function handleSelectList(id: string) {
    const list = formattedData.find((item) => item.id === id);
    if (list) setSelectedList(list);
  }

  return (
    <div className="flex justify-evenly items-center w-full h-full">
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
    <div className="flex flex-col items-center gap-10 w-1/3 h-1/2">
      <h1 className="text-4xl">Songs</h1>

      {list ? (
        <div className="w-full h-full rounded border border-black bg-customDarkGray text-2xl  overflow-y-auto scrollbar-thin scrollbar-thumb-customBabyBlue scrollbar-track-transparent">
          <ul className="flex flex-col items-center gap-4 text-customBabyBlue text-center my-4">
            {list.songList.map((item, i) => (
              <li key={item.song + i} className="p-2">
                {item.song} - {item.artist}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="flex justify-center h-80 bg-customDarkGray px-16 py-16 text-customBabyBlue rounded">
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
    <div className="flex flex-col items-center gap-10 w-1/3 h-1/2">
      <h1 className="text-4xl">Lists</h1>
      {data[0] ? (
        <div className="w-full h-full rounded border border-black bg-customDarkGray text-2xl  overflow-y-auto scrollbar-thin scrollbar-thumb-customPink scrollbar-track-transparent">
          <ul className="flex flex-col items-center gap-6 my-4">
            {data.map((item) => (
              <li key={item.id} className="flex items-center w-2/3 gap-4">
                <Button
                  type="button"
                  onClick={() => handleSelectList(item.id)}
                  dark={item.id === id}
                  className="w-full p-2 truncate"
                >
                  {item.name}
                </Button>
                <fetcher.Form method="DELETE" action="/api/deleteSong">
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="text-red-400 text-2xl">
                    X
                  </button>
                </fetcher.Form>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="flex justify-center h-80 min-w-80 bg-customDarkGray px-16 py-16 text-customPink rounded">
          No saved lists. Search and save a list.
        </p>
      )}
    </div>
  );
}
