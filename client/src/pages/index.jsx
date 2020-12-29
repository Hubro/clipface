/*
 * Index page - shows a list of available clips
 */

import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import TimeAgo from "react-timeago";
import prettyBytes from "pretty-bytes";
import debounce from "lodash/debounce";

import ClipfaceLayout from "../components/ClipfaceLayout";
import CopyClipLink from "../components/CopyClipLink";

const ClearFilterButton = styled.span`
  cursor: pointer;
  pointer-events: initial !important;
`;

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

const IndexPage = ({ videos, title }) => {
  const [filter, setFilter] = useState("");
  const filterBox = useRef();

  // Focus filter box on load
  useEffect(() => {
    filterBox.current.focus();
  });

  // Setting the filter text for every keypress is terrible for performance, so
  // we only do it 250ms after the user stops typing
  const debouncedSetFilter = debounce((text) => {
    setFilter(text);
  }, 250);

  const onFilterChange = (e) => {
    debouncedSetFilter(e.target.value);
  };

  const onClearFilterClick = () => {
    filterBox.current.value = "";
    setFilter("");
  };

  const handleLinkClick = (clipName) => {
    Router.push(`/watch/${clipName}`);
  };

  /**
   * Returns true if the filter matches the input clip
   *
   * Always returns true if no filter is set.
   *
   * @param {string} clipName
   * @returns {boolean}
   */
  const filterMatch = (clipName) => {
    if (filter == "") return true;

    return clipName.toLowerCase().includes(filter);
  };

  return (
    <ClipfaceLayout pageName="index" pageTitle={title}>
      <div>
        <div className="field">
          <label className="label">Filter</label>

          <div className="control has-icons-right">
            <input
              type="text"
              className="input"
              ref={filterBox}
              onChange={onFilterChange}
            />

            <ClearFilterButton
              className="icon is-right"
              onClick={onClearFilterClick}
            >
              <i className="fas fa-times" />
            </ClearFilterButton>
          </div>
        </div>

        <table className="table is-fullwidth is-bordered">
          <thead>
            <tr>
              <th>Saved</th>
              <th>Clip size</th>
              <th>Clip name</th>
            </tr>
          </thead>

          <tbody>
            {videos.map(
              (clip) =>
                filterMatch(clip.name) && (
                  <LinkRow
                    key={clip.name}
                    onClick={() => {
                      handleLinkClick(clip.name);
                    }}
                  >
                    <td>
                      <TimeAgo date={clip.saved} />
                    </td>
                    <td>{prettyBytes(clip.size)}</td>
                    <td>
                      {clip.name}

                      <CopyLinkButton clipName={clip.name} noText />
                    </td>
                  </LinkRow>
                )
            )}
          </tbody>
        </table>
      </div>
    </ClipfaceLayout>
  );
};

export async function getServerSideProps(context) {
  const { checkAuth } = require("../backend/auth");
  const { getClipsPageTitle } = require("../backend/config");

  let videos = [];

  if (await checkAuth(context.req)) {
    const listClips = require("../backend/listClips").default;

    videos = listClips();
  }

  return { props: { videos, title: getClipsPageTitle() } };
}

export default IndexPage;
