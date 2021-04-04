/*
 * Watch page - this is where the video is displayed
 */

import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import TimeAgo from "react-timeago";
import prettyBytes from "pretty-bytes";
import ReactMarkdown from "react-markdown";

import ClipfaceLayout from "../../components/ClipfaceLayout";
import CopyClipLink from "../../components/CopyClipLink";
import useLocalSettings from "../../localSettings";
import requireAuth from "../../backend/requireAuth";
import { getPublicURL } from "../../util";

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;
`;

const ButtonRowSpacer = styled.div`
  width: 1px;
  margin-left: auto;
`;

const ButtonRowSeparator = styled.div`
  width: 5px;
`;

const BackLink = styled.a`
  display: inline-block;
`;

const SingleClipAuthNotice = styled.div`
  opacity: 0.5;
`;

const InlineIcon = styled.i`
  position: relative;
  top: 1px;
  margin-right: 5px;
`;

// The height of the video container when in theatre mode
const videoContainerTheatreHeight = "calc(100vh - 136px - 150px)";

const VideoContainer = styled.div`
  margin: 0px auto;
  max-width: 1344px;

  &.theater-mode {
    background-color: black;
    position: absolute;
    left: 0px;
    right: 0px;
    max-width: initial;
    margin: 0px;
    height: ${videoContainerTheatreHeight};

    & video {
      width: 100%;
      height: 100%;
    }
  }
`;

// Spacer to push the contents behind the video container down
const VideoSpacer = styled.div`
  height: ${videoContainerTheatreHeight};
`;

const VideoInfo = styled.div`
  margin-top: 25px;
  padding-bottom: 50px;
`;

const VideoDescription = styled.div`
  margin-top: 25px;
`;

const WatchPage = ({ clipMeta, authInfo, currentURL }) => {
  const router = useRouter();
  const videoRef = useRef();
  const [localSettings, setLocalSettings] = useLocalSettings();

  // The video volume can't be set directly on the element for some reason, so
  // we set it immediately after rendering
  useEffect(() => {
    videoRef.current.volume = localSettings.videoVolume;
  });

  // Rehydrate serialized value from getServerSideProps
  currentURL = new URL(currentURL);

  const clipName = router.query.name;
  const theaterMode = localSettings.theaterMode;

  if (!clipName) {
    return <div>No clip specified</div>;
  }

  if (!clipMeta) {
    return <div>Clip doesn't exist</div>;
  }

  const handleBackClick = () => {
    videoRef.current.pause();

    router.push("/");
  };

  const handleVideoError = (e) => {
    console.log("VIDEO ERROR", e.target.error);
  };

  const handleVolumeChange = (e) => {
    setLocalSettings({
      ...localSettings,
      videoVolume: videoRef.current.volume,
    });
  };

  const toggleTheaterMode = () => {
    setLocalSettings({
      ...localSettings,
      theaterMode: !localSettings.theaterMode,
    });
  };

  var videoSrc = "/api/video/" + clipName;

  // Forward the single clip auth token to the clip URL
  if (authInfo.status == "SINGLE_PAGE_AUTHENTICATED") {
    videoSrc += "?token=" + Buffer.from(authInfo.token).toString("base64");
  }

  const videoProps = {
    src: videoSrc,
    controls: true,
    autoPlay: true,
    onError: handleVideoError,
    onVolumeChange: handleVolumeChange,
    style: { outline: "none" },
    ref: videoRef,
  };

  return (
    <>
      <Head>
        <meta
          property="og:video"
          value={`${currentURL.protocol}//${currentURL.host}${videoSrc}`}
        />
      </Head>

      <ClipfaceLayout authInfo={authInfo} pageName="watch">
        <ButtonRow>
          {/* Only show "Back to clips" button to authenticated users */}
          {authInfo.status == "AUTHENTICATED" && (
            <BackLink onClick={handleBackClick}>
              <span className="icon">
                <i className="fas fa-arrow-alt-circle-left"></i>
              </span>
              Back to clips
            </BackLink>
          )}

          {authInfo.status == "SINGLE_PAGE_AUTHENTICATED" && (
            <SingleClipAuthNotice>
              <InlineIcon className="fas fa-info-circle" />
              You are using a public link for this clip
            </SingleClipAuthNotice>
          )}

          <ButtonRowSpacer />

          <button
            className={"button is-small " + (theaterMode ? "is-info" : "")}
            onClick={toggleTheaterMode}
          >
            <span className="icon is-small">
              <i className="fas fa-film"></i>
            </span>
            <span>Theater mode</span>
          </button>

          {/* Only show link copying buttons to authenticated users */}
          {authInfo.status == "AUTHENTICATED" && (
            <>
              <ButtonRowSeparator />

              <CopyClipLink clipName={clipName} />

              <ButtonRowSeparator />

              <CopyClipLink clipName={clipName} publicLink />
            </>
          )}
        </ButtonRow>

        <VideoContainer className={theaterMode ? "theater-mode" : ""}>
          <video {...videoProps} />
        </VideoContainer>

        {theaterMode && <VideoSpacer />}

        <VideoInfo>
          <h1 className="title is-4">{clipMeta.title || clipMeta.name}</h1>
          <h2 className="subtitle is-6">
            Saved <TimeAgo date={clipMeta.saved} />
            <span style={{ margin: "0px 10px" }}>•</span>
            {prettyBytes(clipMeta.size)}
          </h2>

          {clipMeta.title && <em>Filename: {clipMeta.name}</em>}

          <hr />

          {clipMeta.description && (
            <VideoDescription className="content">
              <ReactMarkdown>{clipMeta.description}</ReactMarkdown>
            </VideoDescription>
          )}
        </VideoInfo>
      </ClipfaceLayout>
    </>
  );
};

export const getServerSideProps = requireAuth(async ({ query, req }) => {
  const getMeta = require("../../backend/getMeta").default;

  const clipName = query.name;
  const clipMeta = getMeta(clipName);

  return {
    props: { clipMeta, currentURL: getPublicURL(req).toString() },
  };
});

export default WatchPage;
