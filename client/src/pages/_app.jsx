/*
 * Custom app component, used to redirect if authentication is missing
 */

import * as cookie from "cookie";
import { createGlobalStyle } from "styled-components";

import { setLocalSettings } from "../localSettings";

const GlobalStyle = createGlobalStyle`
  html {
    font-family: "Roboto", sans-serif;
  }

  body {
    position: relative;
    font-family: inherit;
    min-height: 100vh;
    box-sizing: border-box;
    padding-bottom: 33px;
  }
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
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
