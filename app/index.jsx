/*
 * Index page - shows a list of available clips
 */

import React from "react";

import ClipfaceLayout from "./components/ClipfaceLayout";

const IndexPage = ({ videos }) => {
  const handleLinkClick = (clipName) => () => {
    window.location = `/watch/${clipName}`;
  };

  return (
    <ClipfaceLayout pageName="index" pageTitle="Tomsan clip folder">
      <div className="clip-list">
        <table className="table is-fullwidth is-bordered">
          <thead>
            <tr>
              <th>Saved</th>
              <th>Clip name</th>
            </tr>
          </thead>

          <tbody>
            {videos.map((info) => (
              <tr key={info.filename} onClick={handleLinkClick(info.filename)}>
                <td>{info.saved_relative}</td>
                <td>{info.filename}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClipfaceLayout>
  );
};

IndexPage.getInitialProps = async () => {
  const videos = await fetch("/list-videos").then((resp) => resp.json());

  return { videos };
};

export default IndexPage;
