/*
 * Index page - shows a list of available clips
 */

import React from "react";

import ClipfaceLayout from "./components/ClipfaceLayout";

const IndexPage = ({ videos }) => {
  return (
    <ClipfaceLayout pageName="index">
      <div className="clip-list">
        <ul>
          {videos.map((name) => (
            <li key={name}>
              <a href={"/watch/" + name}>{name}</a>
            </li>
          ))}
        </ul>
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
