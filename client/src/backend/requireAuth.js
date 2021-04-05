/* Convenience wrapper for getServerSideProps to enforce authentication */

import config from "config";

import { checkAuth, checkSingleClipAuth, getToken } from "./auth";

/**
 * Wrapper around getServerSideProps to enforce authentication
 *
 * This handles regular user authentication as well as single page
 * authentication.
 *
 * @param {function} fn
 * @returns {function}
 */
export default function (fn) {
  return async (context) => {
    const authenticated = await checkAuth(context.req);
    const singlePageAuthenticated = await checkSingleClipAuth(context.req);

    if (
      !authenticated &&
      !singlePageAuthenticated &&
      context.req.url != "/login"
    ) {
      return {
        redirect: {
          destination: "/login?next=" + encodeURIComponent(context.req.url),
          permanent: false,
        },
      };
    }

    const props = await fn(context);

    if (props.props) {
      var authStatus;

      if (!config.has("user_password")) {
        authStatus = "NO_AUTHENTICATION";
      } else if (authenticated) {
        authStatus = "AUTHENTICATED";
      } else if (singlePageAuthenticated) {
        authStatus = "SINGLE_PAGE_AUTHENTICATED";
      } else {
        throw "Unexpected situation";
      }

      props.props.authInfo = { status: authStatus };

      if (singlePageAuthenticated) {
        props.props.authInfo.token = getToken(context.req);
      }
    }

    return props;
  };
}
