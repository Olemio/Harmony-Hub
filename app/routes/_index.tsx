import type { MetaFunction } from "@remix-run/node";
import { FetcherWithComponents, useFetcher } from "@remix-run/react";
import FormInput from "../components/forminput";
import { SongData } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "react-oidc-context";

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
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "3frc1dvnve7u0cmrq8loluaraa";
    const logoutUri = "http://localhost:5173";
    const cognitoDomain =
      "https://eu-central-1iohjpqlho.auth.eu-central-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  };

  console.log(auth.isAuthenticated);

  return (
    <>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
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
            className="bg-customPnk text-customDarkGray rounded-full m-2 px-16 py-2 text-2xl font-bold"
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
        <input type="hidden" name="id" defaultValue={uuidv4()} />

        <div className="flex flex-col gap-4">
          {data.recommendations.map((rec, i) => (
            <li
              key={rec.song}
              className="flex items-center justify-center gap-4"
            >
              {i + 1}.{" "}
              <div className="flex items-center justify-center rounded h-10 px-8">
                {rec.song} by {rec.artist}
              </div>
            </li>
          ))}
        </div>

        <div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full m-2 px-16 py-2 text-2xl font-bold"
          >
            Search Again
          </button>
          <button
            type="submit"
            className="rounded-full m-2 px-16 py-2 text-2xl font-bold"
          >
            save
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}
