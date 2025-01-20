import { Link, useLocation } from "@remix-run/react";

export default function Header() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      {" "}
      <header className="py-8 px-16 text-greenPrimary">
        <div className="flex justify-between items-center">
          <h1 className="text-5xl">Harmony Hub</h1>
          <h2 className="text-3xl hover:underline">
            {path === "/" ? (
              <Link to="/dashboard">Go to Dashboard</Link>
            ) : (
              <Link to="/">Go home</Link>
            )}
          </h2>
        </div>
      </header>
    </>
  );
}
