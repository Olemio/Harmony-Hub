import React from "react";
import { Link, useLocation } from "@remix-run/react";
import { useAuth } from "react-oidc-context";
import Button from "./button";

export default function Header() {
  const { pathname } = useLocation();
  const auth = useAuth();

  React.useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      auth.signinSilent().catch((err) => {
        console.error("Silent signin failed", err);
      });
    }
  }, [auth]);

  React.useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id_token) {
      const formData = new FormData();
      formData.append("idToken", auth.user?.id_token);

      fetch("/auth/store-token", {
        method: "POST",
        body: formData,
      }).catch((err) => console.error(err));
    }
  }, [auth.isAuthenticated, auth.user]);

  const handleSignOut = async () => {
    if (auth.isAuthenticated) {
      try {
        await fetch("/auth/clear-token", { method: "POST" });
        await auth.signoutSilent();
      } catch (err) {
        console.error("Sign out failed:", err);
      }
    } else {
      auth.signinRedirect();
    }
  };

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
          onClick={handleSignOut}
        >
          {!auth.isAuthenticated ? "Sign in" : "Sign out"}
        </Button>

        <Link to={pathname !== "/" ? "/" : "/dashboard"}>
          <Button>{pathname === "/" ? "Saved lists" : "Home"}</Button>
        </Link>
      </div>
    </header>
  );
}
