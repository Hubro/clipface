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
        <table className="table is-fullwidth is-hoverable is-bordered">
          <thead>
            <tr>
              <th>Clip name</th>
            </tr>
          </thead>

          <tbody>
            {videos.map((name) => (
              <tr key={name} onClick={handleLinkClick(name)}>
                <td>{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClipfaceLayout>
  );
};

IndexPage.getInitialProps = async () => {
  let videos = await fetch("/list-videos").then((resp) => resp.json());

  videos = videos.sort().reverse();

  return { videos };
};

export default IndexPage;
