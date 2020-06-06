/*
 * Watch page - this is where the video is displayed
 */

import { useState } from "react";

import ClipfaceLayout from "../components/ClipfaceLayout";

const WatchPage = ({ videoName }) => {
  const [error, setError] = useState(null);

  const handleError = (e) => {
    console.log("HANDLING ERROR", e.target.error);
  };

  return (
    <ClipfaceLayout pageName="watch">
      <a href="/" className="back-link">
        <span className="icon">
          <i className="fas fa-arrow-alt-circle-left"></i>
        </span>
        Back to clips
      </a>
      <video
        src={"/video/" + videoName}
        controls
        autoPlay
        onError={handleError}
      />
    </ClipfaceLayout>
  );
};

WatchPage.getInitialProps = ({ url }) => {
  return { videoName: url.params.name };
};

export default WatchPage;
