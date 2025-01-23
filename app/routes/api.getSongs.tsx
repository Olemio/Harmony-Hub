import { ActionFunction } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const genre = formData.get("genre");
  const tempo = formData.get("tempo");
  const theme = formData.get("theme");
  const num_songs = formData.get("songAmount");
  const claudeUrl =
    "https://sermgkrheom6gele4rqbui5mlq0ffvan.lambda-url.eu-central-1.on.aws";

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
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const id = uuidv4();
    const name = `${genre}, ${tempo}, ${theme}, ${num_songs}`;
    const createdAt = new Date();

    return { id, name, songList: data.recommendations, createdAt };
  } catch (error) {
    console.error("Error fetching data: ", error);
    return { error: error };
  }
};
