import { ActionFunction } from "@remix-run/node";
import { getSession } from "~/sessions.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const idToken = session.get("idToken") as string | undefined;
  const userId = session.get("userId") as string | undefined;

  if (!idToken) {
    return new Response("Not logged in", { status: 400 });
  }

  const formData = await request.formData();
  const songList = formData.get("songList");
  const name = formData.get("name");
  const id = formData.get("id");
  const createdAt = new Date();

  if (!id || !name || !songList || !userId || !createdAt) {
    return new Response("Invalid data", { status: 400 });
  }

  try {
    const formattedData = {
      id,
      name,
      songList,
      userId,
      createdAt,
    };

    const response = await fetch(
      "https://8tp0caiqc0.execute-api.eu-central-1.amazonaws.com/dev-harmony-hub/items",
      {
        method: "PUT",
        headers: {
          Authorization: idToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to make PUT request:", errorText);
      return new Response("Failed to save data", { status: 500 });
    }

    return "Saved";
  } catch (error) {
    console.error("Error:", error);
    return new Response("An error occurred while processing the data", {
      status: 500,
    });
  }
};
