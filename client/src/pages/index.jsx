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
import requireAuth from "../backend/requireAuth";

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

const RowButtons = styled.div`
  float: right;
  margin: -3px;
  display: flex;
  flex-direction: row;

  * {
    margin-right: 5px;

    &:last-child {
      margin-right: 0px;
    }
  }
`;

const NoVideosPlaceholder = styled.div`
  background-color: #eee;
  text-align: center;
  padding: 50px;
`;

const IndexPage = ({ videos, title, authInfo }) => {
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
    <ClipfaceLayout authInfo={authInfo} pageName="index" pageTitle={title}>
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

        <table
          className="table is-fullwidth is-bordered"
          style={{ marginBottom: 0 }} // Remove bottom margin added by Bulma
        >
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
                      {clip.title || clip.name}

                      <RowButtons>
                        <CopyClipLink clipName={clip.name} noText />

                        {authInfo.status == "AUTHENTICATED" && (
                          // There's no point in showing the "Copy public link"
                          // button if Clipface is not password protected
                          <CopyClipLink
                            clipName={clip.name}
                            noText
                            publicLink
                          />
                        )}
                      </RowButtons>
                    </td>
                  </LinkRow>
                )
            )}
          </tbody>
        </table>

        {videos.length == 0 && (
          <NoVideosPlaceholder>No clips here yet</NoVideosPlaceholder>
        )}
      </div>
    </ClipfaceLayout>
  );
};

export const getServerSideProps = requireAuth(async (context) => {
  const config = require("config");

  const { checkAuth } = require("../backend/auth");

  let videos = [];

  if (await checkAuth(context.req)) {
    const listClips = require("../backend/listClips").default;

    videos = listClips();
  }

  return {
    props: {
      videos,
      title: config.has("clips_page_title")
        ? config.get("clips_page_title")
        : null,
    },
  };
});

export default IndexPage;
