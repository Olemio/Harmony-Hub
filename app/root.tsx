import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { AuthProvider } from "react-oidc-context";

import "./tailwind.css";
import Header from "./components/header";

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_iOhjpQLho",
  client_id: "3frc1dvnve7u0cmrq8loluaraa",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "email openid phone",
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <AuthProvider {...cognitoAuthConfig}>
        <body className="flex flex-col h-svh text-whitePrimary">
          <Header />
          <main className="flex-grow">
            <div className="flex flex-col items-center justify-center h-full gap-16">
              {children}
            </div>
          </main>

          <ScrollRestoration />
          <Scripts />
        </body>
      </AuthProvider>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
