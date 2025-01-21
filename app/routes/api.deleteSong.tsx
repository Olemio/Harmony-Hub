import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (!id) {
    return new Response("No id was found", { status: 400 });
  }

  try {
    const response = await fetch(
      `https://eau8opmlk7.execute-api.eu-central-1.amazonaws.com/items/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to make DELETE request:", errorText);
      return new Response("Failed to delete data", { status: 500 });
    }

    return new Response("Item deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("An error occurred while processing the data", {
      status: 500,
    });
  }
};
