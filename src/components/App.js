import React from 'react';
import Carousel from './Carousel';
import data from '../data.json';

const App = () => {
  return <div>
    <Carousel>
      {data.slides.map((x, idx) =>
        <div className="carousel-item_" key={idx}>
          <h2>{x.title}</h2>
          <p>The poetry of earth is never dead</p>
          <img src={x.src} alt="Nature" height="300px;" />
        </div>)}
    </Carousel>
  </div>;
};

export default App;
