/*
 * The base layout of the application
 */

import styled from "styled-components";

const ApplicationDiv = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
`;

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

      <ApplicationDiv className={contentClassNames.join(" ")}>
        {children}
      </ApplicationDiv>
    </>
  );
};
