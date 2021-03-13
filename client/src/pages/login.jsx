/*
 * Login page
 */

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getUserPassword } from "../backend/config";

import ClipfaceLayout from "../components/ClipfaceLayout";

const LoginBox = styled.div`
  margin: 0px auto;
  max-width: 500px;
  margin-top: 25vh;
`;

const Form = styled.form`
  margin-top: 25px;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 48px;
`;

const LoginPage = ({ authEnabled }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const passwordFieldRef = useRef();

  useEffect(() => {
    passwordFieldRef.current.focus();
  });

  const next = "next" in router.query ? router.query["next"] : "/";

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    console.log("Logging in with password", password);

    login(password)
      .then((loggedIn) => {
        if (loggedIn) {
          router.push(next);
        } else {
          setIsLoading(false);
          setError("Invalid user name or password, please try again");
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setError("Login failed due to an unexpected error");
        console.error("Login failed horribly", e);
      });
  };

  return (
    <ClipfaceLayout pageName="login">
      <LoginBox className="box">
        <p className="has-text-centered has-text-weight-bold">
          This page is password protected
        </p>

        <Form onSubmit={onSubmit}>
          <div className="field">
            <p className="control has-icons-left">
              {/* The username field is not used for anything but Chrome
               * complains if it's missing */}
              <input
                name="username"
                value="default"
                autoComplete="username"
                hidden={true}
                readOnly={true}
              />

              <input
                ref={passwordFieldRef}
                className={"input" + (error ? " is-danger" : "")}
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                disabled={isLoading}
                value={password}
                onChange={onPasswordChange}
              />

              {error && <p className="has-text-danger">{error}</p>}

              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <LoginButton className="button is-primary" disabled={isLoading}>
                {isLoading && <i className="fa fa-cog fa-spin" />}
                {!isLoading && "Login"}
              </LoginButton>
            </p>
          </div>
        </Form>
      </LoginBox>
    </ClipfaceLayout>
  );
};

/**
 * Attempts to log in, yields true if login succeeds, false otherwise
 *
 * @param {string} password
 */
async function login(password) {
  const response = await fetch("/api/login", {
    method: "POST",
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: encodeURIComponent(password) }),
  });

  if (response.ok) {
    return true;
  }

  console.error("Failed to log in", response);
  return false;
}

export async function getServerSideProps(context) {
  // If no user authentication is configured, forward to the index page
  if (!getUserPassword()) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default LoginPage;
