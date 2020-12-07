/*
 * Index page - shows a list of available clips
 */

import { useEffect, useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import TimeAgo from "react-timeago";
import prettyBytes from "pretty-bytes";
import Tippy from "@tippyjs/react";
import partialRight from "lodash/partialRight";

import { formatClipURL } from "../util";
import ClipfaceLayout from "../components/ClipfaceLayout";

const LinkRow = styled.tr`
  cursor: pointer;

  &:hover {
    background-color: #3273dc;
    color: white;
  }
`;

const CopyLinkButton = styled.button`
  float: right;
  margin: -3px;
`;

const IndexPage = ({ videos }) => {
  // Used to show a success message on the "Copy link" button
  const [linkCopied, setLinkCopied] = useState(null);

  useEffect(() => {
    const hideMessageTimeout = setTimeout(() => {
      setLinkCopied(null);
    }, 1000);

    return () => {
      clearTimeout(hideMessageTimeout);
    };
  });

  const handleLinkClick = (clipName) => () => {
    Router.push(`/watch/${clipName}`);
  };

  const handleCopyLinkClick = (e, clipName) => {
    const button = e.currentTarget;

    navigator.clipboard
      .writeText(formatClipURL(clipName))
      .then(() => {
        setLinkCopied(clipName);
      })
      .catch(() => {
        alert("Failed to copy link!");
      });

    e.stopPropagation();
  };

  return (
    <ClipfaceLayout pageName="index" pageTitle="Tomsan clip folder">
      <div>
        <table className="table is-fullwidth is-bordered">
          <thead>
            <tr>
              <th>Saved</th>
              <th>Clip size</th>
              <th>Clip name</th>
            </tr>
          </thead>

          <tbody>
            {videos.map((clip) => (
              <LinkRow key={clip.name} onClick={handleLinkClick(clip.name)}>
                <td>
                  <TimeAgo date={clip.saved} />
                </td>
                <td>{prettyBytes(clip.size)}</td>
                <td>
                  {clip.name}

                  <Tippy
                    content="Link copied!"
                    animation="shift-away-subtle"
                    visible={linkCopied == clip.name}
                  >
                    <CopyLinkButton
                      className="button is-small"
                      title="Copy link to clip"
                      onClick={partialRight(handleCopyLinkClick, clip.name)}
                    >
                      <span className="icon is-small">
                        <i className="fas fa-link"></i>
                      </span>
                    </CopyLinkButton>
                  </Tippy>
                </td>
              </LinkRow>
            ))}
          </tbody>
        </table>
      </div>
    </ClipfaceLayout>
  );
};

export async function getServerSideProps() {
  const listClips = require("../listClips").default;

  return { props: { videos: listClips() } };
}

export default IndexPage;
