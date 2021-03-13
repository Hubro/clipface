/* Convenience wrapper for getServerSideProps to enforce authentication */

import { checkAuth } from "./backend/auth";
import { getUserPassword } from "./backend/config";

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
    const userPassword = getUserPassword();
    const authenticated = await checkAuth(context.req);

    console.log(context.req.url);

    if (!authenticated && context.req.url != "/login") {
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

      if (!userPassword) {
        authStatus = "NO_AUTHENTICATION";
      } else if (authenticated) {
        authStatus = "AUTHENTICATED";
      } else {
        // TODO: Implement single page authentication
      }

      props.props.authInfo = { status: authStatus };
    }

    return props;
  };
}
