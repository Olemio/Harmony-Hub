import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/sessions.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset("idToken");
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};