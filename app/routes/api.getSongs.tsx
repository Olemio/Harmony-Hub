import { ActionFunction } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "~/sessions.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const idToken = session.get("idToken");

  if (!idToken) {
    return new Response("Log in to search");
  }

  const formData = await request.formData();
  const genre = formData.get("genre");
  const tempo = formData.get("tempo");
  const theme = formData.get("theme");
  const num_songs = formData.get("songAmount");
  const claudeUrl =
    "https://8tp0caiqc0.execute-api.eu-central-1.amazonaws.com/dev-harmony-hub/claude";

  const params = { genre, tempo, theme, num_songs };

  try {
    const url = new URL(claudeUrl);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: idToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const id = uuidv4();
    const name = `${genre}, ${tempo}, ${theme}, ${num_songs}`;

    return { id, name, songList: data.recommendations };
  } catch (error) {
    console.error("Error fetching data: ", error);
    return { error: error };
  }
};
