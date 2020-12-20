/*
 * The base layout of the application
 */

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

import checkLogin from "../checkLogin";

const ApplicationDiv = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
  position: static;
`;

export default ({
  children,
  pageName = null,
  pageTitle = null,
  pageSubtitle = null,
}) => {
  const router = useRouter();

  // When set to true, a "Log out" button will be displayed
  const [showLogoutButton, setShowLogoutButton] = useState(false);

  useEffect(() => {
    if (!window.location.pathname.startsWith("/login")) {
      // TODO: Fetch this value from state when proper state management
      checkLogin().then((loginStatus) => {
        setShowLogoutButton(loginStatus["status"] != "NO_AUTHENTICATION");
      });
    }
  });

  const contentClassNames = ["container"];

  if (pageName) {
    contentClassNames.push(`page-${pageName}`);
  }

  const onSignOut = () => {
    logout().then((ok) => {
      if (ok) {
        router.push("/login");
      } else {
        alert("Failed to log out, please check your network connection");
      }
    });
  };

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
                  {showLogoutButton && (
                    <a className="navbar-item" onClick={onSignOut}>
                      Log out
                    </a>
                  )}
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

/**
 * Logs out through the API
 */
async function logout() {
  const response = await fetch("/api/logout", { method: "POST" });

  if (response.ok) {
    return true;
  }

  console.error("Failed to log out", response);
  return false;
}
