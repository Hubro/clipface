/*
 * Watch page - this is where the video is displayed
 */

import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

import ClipfaceLayout from "../../components/ClipfaceLayout";
import CopyClipLink from "../../components/CopyClipLink";
import useLocalSettings from "../../localSettings";

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
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
  margin-bottom: 10px;
`;

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
    height: calc(100vh - 136px);

    & video {
      width: 100%;
      height: 100%;
    }
  }
`;

const WatchPage = () => {
  const router = useRouter();
  const [localSettings, setLocalSettings] = useLocalSettings();
  const clipName = router.query.name;

  const theaterMode = localSettings.theaterMode;

  if (!clipName) {
    return <div>No clip specified</div>;
  }

  const handleError = (e) => {
    console.log("HANDLING ERROR", e.target.error);
  };

  const toggletheaterMode = () => {
    setLocalSettings({
      ...localSettings,
      theaterMode: !localSettings.theaterMode,
    });
  };

  const videoProps = {
    src: "/api/video/" + clipName,
    controls: true,
    autoPlay: true,
    onError: { handleError },
    style: { outline: "none" },
  };

  return (
    <>
      <ClipfaceLayout pageName="watch">
        <ButtonRow>
          <Link href="/">
            <BackLink>
              <span className="icon">
                <i className="fas fa-arrow-alt-circle-left"></i>
              </span>
              Back to clips
            </BackLink>
          </Link>

          <ButtonRowSpacer />

          <button
            className={"button is-small " + (theaterMode ? "is-info" : "")}
            onClick={toggletheaterMode}
          >
            <span className="icon is-small">
              <i className="fas fa-film"></i>
            </span>
            <span>Theater mode</span>
          </button>

          <ButtonRowSeparator />

          <CopyClipLink clipName={clipName} />
        </ButtonRow>

        <VideoContainer className={theaterMode ? "theater-mode" : ""}>
          <video {...videoProps} />
        </VideoContainer>
      </ClipfaceLayout>
    </>
  );
};

export default WatchPage;
