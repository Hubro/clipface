/*
 * Watch page - this is where the video is displayed
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

import ClipfaceLayout from "../../components/ClipfaceLayout";
import CopyClipLink from "../../components/CopyClipLink";

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 10px;
`;

const CopyLinkButton = styled(CopyClipLink)`
  // Pushes the button to the right of the screen
  margin-left: auto;
`;

const WatchPage = () => {
  const router = useRouter();
  const clipName = router.query.name;

  if (!clipName) {
    return <div>No clip specified</div>;
  }

  const handleError = (e) => {
    console.log("HANDLING ERROR", e.target.error);
  };

  return (
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
        <CopyLinkButton clipName={clipName} />
      </ButtonRow>
      <video
        src={"/api/video/" + clipName}
        controls
        autoPlay
        onError={handleError}
        style={{ width: "100%" }}
      />
    </ClipfaceLayout>
  );
};

export default WatchPage;
