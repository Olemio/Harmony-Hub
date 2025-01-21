import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { FetcherWithComponents, useFetcher } from "@remix-run/react";
import FormInput from "../components/forminput";

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
  const num_songs = formData.get("songAmount");
  const endpointUrl =
    "https://sermgkrheom6gele4rqbui5mlq0ffvan.lambda-url.eu-central-1.on.aws";

  console.log({ genre, tempo, theme, num_songs });

  const params = { genre, tempo, theme, num_songs };

  try {
    const url = new URL(endpointUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return { error: error };
  }
};

type SongData = {
  recommendations: {
    artist: string;
    song: string;
  }[];
};

export default function Home() {
  const fetcher = useFetcher<SongData>();
  const state = fetcher.state;
  const actionData = fetcher.data;
  console.log(actionData);

  return (
    <div className=" flex flex-col items-center justify-center h-full gap-16">
      {state === "submitting" ? (
        <h1 className="text-3xl">Searching...</h1>
      ) : actionData ? (
        <Results data={actionData as SongData} />
      ) : (
        <SearchForm fetcher={fetcher} />
      )}
    </div>
  );
}

function SearchForm({ fetcher }: { fetcher: FetcherWithComponents<SongData> }) {
  return (
    <>
      <h1 className="text-3xl">Fill out form and search!</h1>
      <fetcher.Form method="POST" className="grid grid-cols-2 gap-10 text-xl">
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

function Results({ data }: { data: SongData }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl">Results!</h1>
      <ul className="flex flex-col gap-4 text-xl ">
        {data.recommendations.map((rec, i) => (
          <li key={rec.song} className="flex items-center justify-center gap-4">
            {i + 1}.{" "}
            <div className="flex items-center justify-center bg-greenSecondary rounded h-10 px-8 text-grayPrimary">
              {rec.artist} by {rec.song}
            </div>
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => window.location.reload()}
          className="bg-greenPrimary text-grayPrimary rounded-full m-2 px-16 py-2 text-2xl font-bold"
        >
          Search Again
        </button>
        <button
          onClick={() => console.log("Save button")}
          className="bg-greenPrimary text-grayPrimary rounded-full m-2 px-16 py-2 text-2xl font-bold"
        >
          save
        </button>
      </div>
    </div>
  );
}
