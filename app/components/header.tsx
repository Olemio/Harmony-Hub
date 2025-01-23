import { Link, useLocation } from "@remix-run/react";
import { useAuth } from "react-oidc-context";
import Button from "./button";

export default function Header() {
  const { pathname } = useLocation();
  const auth = useAuth();
  const isSignedIn = auth.isAuthenticated;

  console.log(auth);

  return (
    <header className="flex justify-between items-center py-8 px-16 text-customPink bg-customDarkGray">
      <div className="flex items-center gap-12">
        <h1 className="text-2xl">Harmony Hub</h1>
        <h1 className=" text-customBabyBlue text-3xl">
          {pathname === "/" ? "Home" : "Saved lists"}
        </h1>
      </div>
      <div className="flex">
        <Button
          className="text-customPink bg-transparent px-0 py-0 text-2xl"
          onClick={() =>
            isSignedIn ? auth.signoutSilent() : auth.signinRedirect()
          }
        >
          {!isSignedIn ? "Sign in" : "Sign out"}
        </Button>

        <Link to={pathname !== "/" ? "/" : "/dashboard"}>
          <Button>{pathname === "/" ? "Saved lists" : "Home"}</Button>
        </Link>
      </div>
    </header>
  );
}
