/*
 * Watch page - this is where the video is displayed
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

import ClipfaceLayout from "../../components/ClipfaceLayout";

const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 10px;
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
      <Link href="/">
        <BackLink>
          <span className="icon">
            <i className="fas fa-arrow-alt-circle-left"></i>
          </span>
          Back to clips
        </BackLink>
      </Link>
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
