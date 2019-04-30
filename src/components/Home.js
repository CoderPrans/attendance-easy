import React from 'react';
import img from '../shot.png';
import img1 from '../shot1.png';

const Home = props => (
  <div>
    <h1>To use Attendance Recorder: </h1>
    <h2>Step 1</h2>
    <p>Get the spreadSheet Id of your attendance sheet from the URL</p>
    <img src={img} alt="screenshot" />
    <p>Get the sheet Name of your attendance sheet, bottom left corner.</p>
    <img src={img1} alt="screenshot1" />
  </div>
);

export default Home;
