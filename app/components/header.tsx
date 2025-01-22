import { Link, useLocation } from "@remix-run/react";
import { useAuth } from "react-oidc-context";
import Button from "./button";

export default function Header() {
  const { pathname } = useLocation();
  const auth = useAuth();

  console.log(auth.isAuthenticated);

  return (
    <header className="flex justify-between items-center py-8  px-16 text-customPink bg-customDarkGray">
      <h1 className="text-3xl">Harmony Hub</h1>
      <div className="flex gap-8">
        {!auth.isAuthenticated ? (
          <Button
            className="text-customPink bg-transparent px-0 py-0"
            onClick={() => auth.signinRedirect()}
          >
            <span className="text-2xl">Sign in</span>
          </Button>
        ) : (
          <Button
            className="text-customPink bg-transparent px-0 py-0"
            onClick={() => signOutRedirect()}
          >
            <span className="text-2xl">Sign out</span>
          </Button>
        )}

        <Link
          className="bg-customPink text-customDarkGray px-8 py-2 rounded-full text-xl"
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
