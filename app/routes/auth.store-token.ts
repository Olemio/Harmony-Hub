import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/sessions.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const idToken = formData.get("idToken");
  const userId = formData.get("userId")

  if (typeof idToken !== "string") {
    return redirect("/");
  }
  if (typeof idToken !== "string") {
    return redirect("/");
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("idToken", idToken);
  session.set("userId", userId)

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
