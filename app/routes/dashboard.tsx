import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import { mockData } from "../../mock";
import { Item } from "../../types";

export const loader: LoaderFunction = async () => {
  const url = "https://sobp5p7w82.execute-api.eu-central-1.amazonaws.com/items";

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    const data: Item[] = await response.json();
    console.log(data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching items:", error);

    return new Response(
      JSON.stringify({ error: "Unable to fetch items from the database" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export default function Dashboard() {
  const loaderData = useLoaderData<Item[]>();

  console.log(loaderData);

  return (
    <div>
      <h1>Items in Database</h1>
      <ul>
        {loaderData[0].map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.price} NOK
          </li>
        ))}
      </ul>
    </div>
  );
}
