import type { MetaFunction } from "@remix-run/node";
import { FetcherWithComponents, useFetcher } from "@remix-run/react";
import FormInput from "../components/forminput";
import { SongData } from "../../types";

export const meta: MetaFunction = () => {
  return [
    { title: "Harmony Hub" },
    { name: "description", content: "Welcome to Harmony Hub!" },
  ];
};

export default function Home() {
  const fetcher = useFetcher<SongData>();
  const state = fetcher.state;
  const actionData = fetcher.data;

  return (
    <>
      {state === "submitting" ? (
        <h1 className="text-3xl">Searching...</h1>
      ) : actionData ? (
        <Results fetcher={fetcher} data={actionData as SongData} />
      ) : (
        <SearchForm fetcher={fetcher} />
      )}
    </>
  );
}

function SearchForm({ fetcher }: { fetcher: FetcherWithComponents<SongData> }) {
  return (
    <>
      <h1 className="text-3xl">Fill out form and search!</h1>

      <fetcher.Form
        method="POST"
        action="/api/getSongs"
        className="grid grid-cols-2 gap-10 text-xl"
      >
        <FormInput name="genre" label="Genre" defaultValue="pop" />
        <FormInput name="tempo" label="Tempo" defaultValue="upbeat" />
        <FormInput name="theme" label="Theme" defaultValue="happy" />
        <FormInput
          name="songAmount"
          label="Amount of songs"
          defaultValue="2"
          type="number"
        />

        <div className="col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-greenPrimary text-grayPrimary rounded-full m-2 px-16 py-2 text-2xl font-bold"
          >
            Search
          </button>
        </div>
      </fetcher.Form>
    </>
  );
}

function Results({
  fetcher,
  data,
}: {
  fetcher: FetcherWithComponents<SongData>;
  data: SongData;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl">Results!</h1>

      <fetcher.Form
        method="POST"
        action="/api/saveSongs"
        className="flex flex-col gap-8"
      >
        <FormInput
          name="name"
          defaultValue={data.name}
          label="Name of your song list"
        />
        <input
          name="songList"
          type="hidden"
          defaultValue={JSON.stringify(data.recommendations)}
        />

        <div className="flex flex-col gap-4">
          {data.recommendations.map((rec, i) => (
            <li
              key={rec.song}
              className="flex items-center justify-center gap-4"
            >
              {i + 1}.{" "}
              <div className="flex items-center justify-center bg-greenSecondary rounded h-10 px-8 text-grayPrimary">
                {rec.song} by {rec.artist}
              </div>
            </li>
          ))}
        </div>

        <div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-greenPrimary text-grayPrimary rounded-full m-2 px-16 py-2 text-2xl font-bold"
          >
            Search Again
          </button>
          <button
            type="submit"
            className="bg-greenPrimary text-grayPrimary rounded-full m-2 px-16 py-2 text-2xl font-bold"
          >
            save
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}
