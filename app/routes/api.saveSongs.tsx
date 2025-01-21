import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const songList = formData.get("songList");
  const name = formData.get("name");
  const id = formData.get("id");
  const userId = "ailurus842@gmail.com";
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
      "https://eau8opmlk7.execute-api.eu-central-1.amazonaws.com/items",
      {
        method: "PUT",
        headers: {
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

    return new Response("Data saved successfully", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("An error occurred while processing the data", {
      status: 500,
    });
  }
};
