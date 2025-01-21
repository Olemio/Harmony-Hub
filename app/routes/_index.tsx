import type { ActionFunction, MetaFunction } from "@remix-run/node";
import {
  FetcherWithComponents,
  useActionData,
  useFetcher,
} from "@remix-run/react";
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

export default function Home() {
  const fetcher = useFetcher();
  const state = fetcher.state;
  const actionData = useActionData();
  console.log(actionData);

  return (
    <div className=" flex flex-col items-center justify-center h-full gap-16">
      {state === "submitting" ? (
        <h1 className="text-3xl">Searching...</h1>
      ) : actionData && !actionData.error ? (
        <Results data={actionData} />
      ) : (
        <SearchForm fetcher={fetcher} />
      )}
    </div>
  );
}

function SearchForm({ fetcher }: { fetcher: FetcherWithComponents<any> }) {
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

function Results({ data }: { data: any }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl">Recommendations</h1>
      <ul className="text-xl text-grayPrimary">
        {data.recommendations.map((rec: any, index: number) => (
          <li key={index} className="mb-2">
            {rec.artist} - {rec.song}
          </li>
        ))}
      </ul>
      <button
        onClick={() => window.location.reload()}
        className="bg-greenPrimary text-grayPrimary rounded-full m-2 px-16 py-2 text-2xl font-bold"
      >
        Search Again
      </button>
    </div>
  );
}
