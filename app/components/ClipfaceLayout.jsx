/*
 * The base layout of the application
 */

import { Helmet } from "react-helmet-async";

import "../screen.scss";

export default ({ children, pageName = null }) => {
  const contentClassNames = ["container"];

  if (pageName) {
    contentClassNames.push(`page-${pageName}`);
  }

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.8.2/css/bulma.min.css"
          integrity="sha256-qS+snwBgqr+iFVpBB58C9UCxKFhyL03YHpZfdNUhSEw="
          crossorigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css"
          integrity="sha256-46r060N2LrChLLb5zowXQ72/iKKNiw/lAmygmHExk/o="
          crossorigin="anonymous"
        />
      </Helmet>

      <div id="application" className={contentClassNames.join(" ")}>
        {children}
      </div>
    </>
  );
};
