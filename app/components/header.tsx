import { Link, useLocation } from "@remix-run/react";
import { useAuth } from "react-oidc-context";
import Button from "./button";

export default function Header() {
  const { pathname } = useLocation();
  const auth = useAuth();
  const isSignedIn = auth.isAuthenticated;

  console.log(isSignedIn);

  return (
    <header className="flex justify-between items-center py-8  px-16 text-customPink bg-customDarkGray">
      <h1 className="text-3xl">Harmony Hub</h1>
      <div className="flex gap-8">
        <Button
          className="text-customPink bg-transparent px-0 py-0 text-2xl"
          onClick={() => (isSignedIn ? signOutRedirect : auth.signinRedirect())}
        >
          {!isSignedIn ? "Sign in" : "Sign out"}
        </Button>

        <Link
          className="bg-customPink text-customDarkGray px-8 py-1 rounded-full"
          to={pathname !== "/" ? "/" : "/dashboard"}
        >
          {pathname === "/" ? "Saved lists" : "Go back"}
        </Link>
      </div>
    </header>
  );
}

const signOutRedirect = () => {
  const clientId = "3frc1dvnve7u0cmrq8loluaraa";
  const logoutUri = "http://localhost:5173";
  const cognitoDomain =
    "https://eu-central-1iohjpqlho.auth.eu-central-1.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
};
