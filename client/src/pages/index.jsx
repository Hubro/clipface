/*
 * Index page - shows a list of available clips
 */

import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import TimeAgo from "react-timeago";
import prettyBytes from "pretty-bytes";
import debounce from "lodash/debounce";

import Pagination from "../components/Pagination";
import ClipfaceLayout from "../components/ClipfaceLayout";
import CopyClipLink from "../components/CopyClipLink";
import useLocalSettings from "../localSettings";
import requireAuth from "../backend/requireAuth";
import Container from "../components/Container";

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

const IndexPage = ({ videos, title, pagination, authInfo }) => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [localSettings, setLocalSettings] = useLocalSettings();
  const filterBox = useRef();

  // Focus filter box on load
  useEffect(() => {
    filterBox.current.focus();
  }, []);

  const { clipsPerPage } = localSettings;

  /*
   * Filter clips
   */

  if (filter) {
    videos = videos.filter((clip) => clip.name.toLowerCase().includes(filter));
  }

  /*
   * Paginate clips
   */

  const totalClipCount = videos.length;
  const pageCount = Math.ceil(totalClipCount / clipsPerPage);

  if (pagination) {
    videos = videos.slice(
      currentPage * clipsPerPage,
      currentPage * clipsPerPage + clipsPerPage
    );
  }

  // Setting the filter text for every keypress is terrible for performance, so
  // we only do it 50ms after the user stops typing
  const debouncedSetFilter = debounce((text) => {
    setFilter(text);
  }, 50);

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

  const handleChangeClipsPerPage = (newClipsPerPage) => {
    setLocalSettings({ ...localSettings, clipsPerPage: newClipsPerPage });
  };

  return (
    <ClipfaceLayout authInfo={authInfo} pageName="index" pageTitle={title}>
      <Container padded>
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

        {pagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            totalClips={totalClipCount}
            clipsPerPage={clipsPerPage}
            onChangePage={(newPageNumber) => setCurrentPage(newPageNumber)}
            onChangeClipsPerPage={handleChangeClipsPerPage}
            showLabel
          />
        )}

        <table
          className="table is-fullwidth is-bordered"
          style={{ marginBottom: 0 }} // Remove bottom margin added by Bulma
        >
          <thead>
            <tr>
              <th width="150px">Saved</th>
              <th width="100px">Clip size</th>
              <th>Clip name</th>
            </tr>
          </thead>

          <tbody>
            {videos.map((clip) => (
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
                      <CopyClipLink clipName={clip.name} noText publicLink />
                    )}
                  </RowButtons>
                </td>
              </LinkRow>
            ))}
          </tbody>
        </table>

        {videos.length == 0 && (
          <NoVideosPlaceholder>No clips here yet</NoVideosPlaceholder>
        )}

        {pagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            totalClips={totalClipCount}
            clipsPerPage={clipsPerPage}
            onChangeClipsPerPage={handleChangeClipsPerPage}
            onChangePage={(newPageNumber) => setCurrentPage(newPageNumber)}
          />
        )}
      </Container>
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
      pagination: config.get("pagination"),
      title: config.has("clips_page_title")
        ? config.get("clips_page_title")
        : null,
    },
  };
});

export default IndexPage;
