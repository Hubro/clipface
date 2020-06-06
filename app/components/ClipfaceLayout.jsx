/*
 * The base layout of the application
 */

import { Helmet } from "react-helmet-async";

import "../screen.scss";

export default ({
  children,
  pageName = null,
  pageTitle = null,
  pageSubtitle = null,
}) => {
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

      <section className="hero is-dark">
        <div className="hero-head">
          <nav className="navbar">
            <div className="container">
              <div className="navbar-brand">
                <a className="navbar-item">
                  <h1 className="title is-4">Clippy Mc. Clipface</h1>
                </a>
              </div>
              <div className="navbar-menu">
                <div className="navbar-end">
                  <a className="navbar-item is-active" href="/">
                    Tomsan clip folder
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {pageTitle && (
          <div className="hero-body">
            <div className="container has-text-centered">
              <p className="title">{pageTitle}</p>

              {pageSubtitle && <p className="subtitle">{subtitle}</p>}
            </div>
          </div>
        )}
      </section>

      <div id="application" className={contentClassNames.join(" ")}>
        {children}
      </div>
    </>
  );
};
