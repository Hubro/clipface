/*
 * Reusable button component for copying clip link
 */

import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";
import partialRight from "lodash/partialRight";
import styled from "styled-components";

import { formatClipURL } from "../util";
import { useEffect, useState } from "react";

// const CopyLinkButton = styled.button`
//   float: right;
//   margin: -3px;
// `;

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

  const { clipName, className, noText = false } = props;

  const classNames = ["button", "is-small"];

  if (className) {
    classNames.push(className);
  }

  const onClick = (e) => {
    navigator.clipboard
      .writeText(formatClipURL(clipName))
      .then(() => {
        setLinkCopied(true);
      })
      .catch(() => {
        alert("Failed to copy link!");
      });

    e.stopPropagation();
  };

  return (
    <Tippy
      content="Link copied"
      animation="shift-away-subtle"
      arrow={false}
      visible={linkCopied}
    >
      <button className={classNames.join(" ")} onClick={onClick}>
        <span className="icon is-small">
          <i className="fas fa-link"></i>
        </span>
        {!noText && <span>Copy link</span>}
      </button>
    </Tippy>
  );
}

CopyClipLink.propTypes = {
  clipName: PropTypes.string,
  className: PropTypes.string,
  noText: PropTypes.bool,
};
