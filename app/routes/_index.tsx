import type { MetaFunction } from "@remix-run/node";
import { FetcherWithComponents, Link, useFetcher } from "@remix-run/react";
import { SongData } from "../../types";
import Button from "~/components/button";
import FormInput from "../components/forminput";

export const meta: MetaFunction = () => {
  return [
    { title: "Harmony Hub" },
    { name: "description", content: "Welcome to Harmony Hub!" },
  ];
};

export default function Home() {
  const fetcher = useFetcher<SongData | string>();
  const actionData = fetcher.data;
  const action = fetcher.formAction;

  return action === "/api/getSongs" ? (
    <h1 className="text-5xl">Searching...</h1>
  ) : actionData ? (
    <ResultsForm fetcher={fetcher} data={actionData} />
  ) : (
    <SearchForm fetcher={fetcher} />
  );
}

function SearchForm({
  fetcher,
}: {
  fetcher: FetcherWithComponents<SongData | string>;
}) {
  return (
    <fetcher.Form
      method="POST"
      action="/api/getSongs"
      className="flex flex-col items-center gap-20"
    >
      <h1 className="text-4xl">Personalize your song list</h1>

      <div className="grid grid-cols-2 gap-x-32 gap-y-20 bg-customDarkGray py-8 px-16 border border-black rounded">
        <FormInput name="genre" label="Genre" defaultValue="Pop" />
        <FormInput name="tempo" label="Tempo" defaultValue="Upbeat" />
        <FormInput name="theme" label="Theme" defaultValue="Happy" />
        <FormInput
          name="songAmount"
          label="Amount"
          defaultValue="5"
          type="number"
        />
      </div>

      <Button type="submit" className="text-3xl px-16 py-2">
        Get list
      </Button>
    </fetcher.Form>
  );
}

function ResultsForm({
  fetcher,
  data,
}: {
  fetcher: FetcherWithComponents<SongData | string>;
  data: SongData | string;
}) {
  return typeof data !== "string" && data.songList ? (
    <fetcher.Form
      method="POST"
      action="/api/saveSongs"
      className="flex items-center h-full w-full"
    >
      <div className="flex h-4/5 w-full flex-col items-center justify-evenly gap-4">
        <input type="hidden" name="id" defaultValue={data.id} />
        <input
          name="songList"
          type="hidden"
          defaultValue={JSON.stringify(data.songList)}
        />
        <h1 className="text-4xl">Name your new song list</h1>
        <div className="flex flex-col items-center justify-center px-16 py-4 max-h-1/2 gap-10 rounded border border-black bg-customDarkGray overflow-y-auto scrollbar-thin scrollbar-thumb-customPink scrollbar-track-transparent">
          <FormInput
            name="name"
            defaultValue={data.name}
            label="Name"
            className="w-80 py-2 truncate"
            labelClassName=""
          />

          <ul className="flex flex-col items-center gap-4 text-customBabyBlue text-center my-4">
            {data.songList.map((item, i) => (
              <li key={i} className="text-center text-2xl">
                {item.song} - {item.artist}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-10">
          <Button
            className="px-12 py-2 text-2xl"
            dark={true}
            onClick={() => window.location.reload()}
          >
            Back
          </Button>
          <Button className="px-12 py-2 text-2xl" type="submit">
            Save
          </Button>
        </div>
      </div>
    </fetcher.Form>
  ) : (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-3xl">
        {(typeof data === "string" && data) || "Search failed..."}
      </h1>

      <div className="grid grid-cols-2 gap-10">
        <Button className="px-10 py-2" onClick={() => window.location.reload()}>
          Home
        </Button>
        <Button className="px-10 py-2">
          <Link to="/dashboard">Saved lists</Link>
        </Button>
      </div>
    </div>
  );
}
