/*
 * Index page - shows a list of available clips
 */

import { useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import TimeAgo from "react-timeago";
import prettyBytes from "pretty-bytes";

import ClipfaceLayout from "../components/ClipfaceLayout";
import CopyClipLink from "../components/CopyClipLink";

const LinkRow = styled.tr`
  cursor: pointer;

  &:hover {
    background-color: #3273dc;
    color: white;
  }
`;

const CopyLinkButton = styled(CopyClipLink)`
  float: right;
  margin: -3px;
`;

const IndexPage = ({ videos }) => {
  // Used to show a success message on the "Copy link" button
  const [linkCopied, setLinkCopied] = useState(null);

  const handleLinkClick = (clipName) => () => {
    Router.push(`/watch/${clipName}`);
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

                  <CopyLinkButton clipName={clip.name} noText />
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
