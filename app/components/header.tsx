import React from "react";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useAuth } from "react-oidc-context";
import Button from "./button";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      auth.signinSilent().catch((err) => {
        console.error("Silent signin failed", err);
      });
    }
  }, [auth]);

  React.useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id_token) {
      const idToken = auth.user.id_token;
      const userId = auth.user.profile.email || "unknown";
      const formData = new FormData();
      formData.append("idToken", idToken);
      formData.append("userId", userId);

      fetch("/auth/store-token", {
        method: "POST",
        body: formData,
      }).catch((err) => console.error(err));
    }
  }, [auth.isAuthenticated, auth.user]);

  const handleSignOut = async () => {
    try {
      await fetch("/auth/clear-token", { method: "POST" });
      await auth.signoutSilent();
      pathname === "/dashboard" && navigate("/");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <header className="flex justify-between items-center h-20 px-16 text-customPink bg-customDarkGray border-b border-black">
      <div className="flex items-center gap-12">
        <Link to="/">
          <h1 className="text-2xl">Harmony Hub</h1>
        </Link>
      </div>
      <div className="relative">
        <div className="flex gap-10 items-center">
          {!auth.isAuthenticated ? (
            <Button
              className="text-customPink bg-transparent"
              onClick={() => auth.signinRedirect()}
            >
              Sign in
            </Button>
          ) : (
            <>
              <div className="relative">
                <Button
                  className="text-customPink bg-transparent"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  {auth.user?.profile.email?.split("@")[0]}
                </Button>

                {isOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 w-40 bg-customDarkGray rounded-lg border border-black text-lg">
                    <Button
                      className="w-full text-center px-4 py-2 text-red-400 bg-transparent"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                    <Button
                      className="w-full text-center px-4 py-2 text-customPink bg-transparent border-t border-black rounded-none"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          <Link to={pathname !== "/" ? "/" : "/dashboard"}>
            <Button className="text-lg px-4 py-1">
              {pathname === "/" ? "Saved lists" : "Home"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
