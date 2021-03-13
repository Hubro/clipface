/*
 * Reusable button component for copying clip link
 */

import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";

import { formatClipURL } from "../util";
import { useEffect, useState } from "react";
import createSingleClipToken from "../createSingleClipToken";

export default function CopyClipLink(props) {
  const [linkCopied, setLinkCopied] = useState(false);

  // Hide confirmation message after 1 second
  useEffect(() => {
    const hideMessageTimeout = setTimeout(() => {
      setLinkCopied(false);
    }, 500);

    return () => {
      clearTimeout(hideMessageTimeout);
    };
  });

  const { clipName, className, noText = false, publicLink = false } = props;

  const classNames = ["button", "is-small"];

  if (className) {
    classNames.push(className);
  }

  const onClick = async (e) => {
    var clipURL = formatClipURL(clipName);

    // If we're making a public link, we need to append a single clip
    // authentication token
    if (publicLink) {
      const token = await createSingleClipToken(clipName);
      clipURL.searchParams.append("token", btoa(token));
    }

    try {
      await navigator.clipboard.writeText(clipURL.href);
      setLinkCopied(true);
    } catch (e) {
      console.error(e);
      alert("Failed to copy link!");
    }
  };

  return (
    <Tippy
      content={publicLink ? "Public link copied" : "Link copied"}
      animation="shift-away-subtle"
      arrow={false}
      visible={linkCopied}
    >
      <Tippy content={publicLink ? "Copy public link" : "Copy link"}>
        <button
          className={classNames.join(" ")}
          onClick={(e) => {
            onClick();
            e.stopPropagation();
          }}
        >
          <span className="icon is-small">
            {!publicLink && <i className="fas fa-link"></i>}
            {publicLink && <i className="fas fa-globe"></i>}
          </span>
          {!noText && !publicLink && <span>Copy link</span>}
          {!noText && publicLink && <span>Copy public link</span>}
        </button>
      </Tippy>
    </Tippy>
  );
}

CopyClipLink.propTypes = {
  clipName: PropTypes.string,
  className: PropTypes.string,
  noText: PropTypes.bool,
  publicLink: PropTypes.bool,
};
