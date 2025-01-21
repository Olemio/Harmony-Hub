import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const songList = formData.get("songList");
  const name = formData.get("name");
  console.log(name);
  console.log(songList);
  const formatData = { name, songList };

  console.log(formatData);
  return null;
};
