/*
 * Custom app component, used to redirect if authentication is missing
 */

import { useRouter } from "next/router";

import checkLogin from "../checkLogin";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  if (typeof window !== "undefined") {
    checkLogin().then((response) => {
      if (response["status"] != "AUTHENTICATED") {
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

export default MyApp;
