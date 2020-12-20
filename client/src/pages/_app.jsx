/*
 * Custom app component, used to redirect if authentication is missing
 */

import { useRouter } from "next/router";
import * as cookie from "cookie";

import checkLogin from "../checkLogin";
import { setLocalSettings } from "../localSettings";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  if (typeof window !== "undefined") {
    checkLogin().then((response) => {
      if (response["status"] == "NOT_AUTHENTICATED") {
        // Don't redirect if we are on the login page
        if (window.location.pathname.startsWith("/login")) {
          return;
        }

        router.push(
          "/login?next=" + encodeURIComponent(window.location.pathname)
        );
      }
    });
  }

  return <Component {...pageProps} />;
}

// This applies local settings when server side rendering if provided by the
// localSettings cookie
MyApp.getInitialProps = async ({ ctx }) => {
  const parsedCookie = cookie.parse(ctx.req?.headers.cookie || "");
  let localSettings;

  if ("localSettings" in parsedCookie) {
    try {
      localSettings = JSON.parse(parsedCookie["localSettings"]);
    } catch {
      // No local settings for us :(
    }
  }

  if (localSettings) {
    setLocalSettings(localSettings);
  }

  return {};
};

export default MyApp;
