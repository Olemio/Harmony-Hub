import type { MetaFunction } from "@remix-run/node";
import { FetcherWithComponents, useFetcher } from "@remix-run/react";
import { SongData } from "../../types";
import { v4 as uuidv4 } from "uuid";
import Button from "~/components/button";
import FormInput from "../components/forminput";

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
        <ResultsForm fetcher={fetcher} data={actionData as SongData} />
      ) : (
        <SearchForm fetcher={fetcher} />
      )}
    </>
  );
}

function SearchForm({ fetcher }: { fetcher: FetcherWithComponents<SongData> }) {
  return (
    <fetcher.Form
      method="POST"
      action="/api/getSongs"
      className="flex flex-col items-center gap-20 text-xl"
    >
      <h1 className="text-3xl">Personalize your search</h1>

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
  fetcher: FetcherWithComponents<SongData>;
  data: SongData;
}) {
  console.log(data);
  return (
    <fetcher.Form
      method="POST"
      action="/api/saveSongs"
      className="flex flex-col items-center gap-10"
    >
      <h1 className="text-3xl">Result</h1>

      <input type="hidden" name="id" defaultValue={uuidv4()} />
      <input
        name="songList"
        type="hidden"
        defaultValue={JSON.stringify(data.recommendations)}
      />

      <FormInput
        name="name"
        defaultValue={data.name}
        label="Name"
        className="w-96"
      />

      <ul className="flex flex-col gap-4 py-8 px-20 min-w-96 rounded bg-customDarkGray text-customPink">
        {data.recommendations.map((item) => (
          <li key={item.song} className="text-center">
            {item.song} - {item.artist}
          </li>
        ))}
      </ul>

      <div className="flex gap-10">
        <Button onClick={() => window.location.reload()}>Back</Button>
        <Button type="submit">Save</Button>
      </div>
    </fetcher.Form>
  );
}
