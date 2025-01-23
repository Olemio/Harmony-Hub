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

  console.log(actionData);

  return action === "/api/getSongs" ? (
    <h1 className="text-3xl">Searching...</h1>
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
      className="flex flex-col items-center gap-20 text-xl"
    >
      <h1 className="text-3xl">Personalize your song list</h1>

      <div className="grid grid-cols-2 gap-10">
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

      <Button type="submit" className="text-2xl px-14">
        Search
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
      className="flex flex-col items-center gap-10"
    >
      <input type="hidden" name="id" defaultValue={data.id} />
      <input
        name="songList"
        type="hidden"
        defaultValue={JSON.stringify(data.songList)}
      />

      <FormInput
        name="name"
        defaultValue={data.name}
        label="List name"
        className="w-96"
      />

      <ul className="flex flex-col gap-4 py-8 px-20 min-w-96 rounded bg-customDarkGray text-customPink">
        {data.songList.map((item, i) => (
          <li key={i} className="text-center">
            {item.song} - {item.artist}
          </li>
        ))}
      </ul>

      <div className="flex gap-10">
        <Button onClick={() => window.location.reload()}>Back</Button>
        <Button type="submit">Save</Button>
      </div>
    </fetcher.Form>
  ) : (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-3xl">
        {(typeof data === "string" && data) || "Search failed..."}
      </h1>

      <div className="flex gap-10">
        <Button onClick={() => window.location.reload()}>Home</Button>
        <Button>
          <Link to="/dashboard">Saved lists</Link>
        </Button>
      </div>
    </div>
  );
}
