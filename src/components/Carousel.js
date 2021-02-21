import React, {useState, useEffect} from 'react';
import {useSwipeable} from 'react-swipeable';
import PropTypes from 'prop-types';


const calcX = (totalNumOfClicks, numOfCarouselItems, idx, width) => {
  totalNumOfClicks = (totalNumOfClicks) % numOfCarouselItems;
  const totalWidth = numOfCarouselItems * width;
  const xValue = (totalWidth + (totalNumOfClicks + idx + 1) * width) % totalWidth - width;
  return xValue;
};


const setVisibility = (xValuePrev, xValue, width, numOfCarouselItems) =>
  (!xValuePrev || Math.abs(xValuePrev - xValue) < (numOfCarouselItems - 1) * width) ? 1 : 0;

const prevXValues = [];

const Carousel = (props) => {
  const numOfCarouselItems = props.children.length;
  const width = 100;
  const [totalNumOfClicks, setTotalNumOfClicks] = useState(0);


  useEffect(() => {
    const id = setTimeout(() => setTotalNumOfClicks(totalNumOfClicks - 1), 3000);
    return () => clearTimeout(id);
  }, [totalNumOfClicks]);


  const handleNavClick = async (idx) => {
    const activeIdx = (numOfCarouselItems - totalNumOfClicks % numOfCarouselItems) % numOfCarouselItems;
    const diff = activeIdx - idx;
    for (let i = 0; i < Math.abs(); i++) {
      if (diff < 0) {
        await setTotalNumOfClicks((prevTotalNumOfClicks) => prevTotalNumOfClicks - 1);
      } else {
        await setTotalNumOfClicks((prevTotalNumOfClicks) => prevTotalNumOfClicks + 1);
      }
    }

    setTotalNumOfClicks(totalNumOfClicks + (activeIdx - idx));
  };


  const calcActiveIdx = (startIdx, totalNumOfClicks) => {
    totalNumOfClicks = totalNumOfClicks % numOfCarouselItems;
    const activeIdx = (numOfCarouselItems + startIdx - totalNumOfClicks) % numOfCarouselItems;
    return activeIdx;
  };

  const prev = () => setTotalNumOfClicks(totalNumOfClicks + 1);
  const next = () => setTotalNumOfClicks(totalNumOfClicks - 1);

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      next(),
    onSwipedRight: () => prev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const slides =
    props.children.length ?
      props.children.map((x, idx) => {
        const xValue = calcX(totalNumOfClicks, numOfCarouselItems, idx, width);
        const carouselItem = <div {...handlers}
          className='carousel-item'
          key={idx}
          style={{
            transform: `translateX(${xValue}%)`,
            opacity: setVisibility(
              prevXValues[idx],
              xValue,
              width,
              numOfCarouselItems
            )
          }}>
          {x}
        </div>;
        prevXValues[idx] = xValue;
        return carouselItem;
      }) :
      <div
        className='carousel-item'>
        {props.children}
      </div>;


  return <div className="carousel">
    <div className="carousel-content">
      {props.children.length && <div className='prev'
        onClick={prev}
      >
        {/* eslint-disable-next-line no-undef*/}
        <img src={require('../assets/arrow_back.png')} />
      </div>}
      {slides}
      {props.children.length &&
        <div className='next' onClick={next}>
          {/* eslint-disable-next-line no-undef*/}
          <img src={require('../assets/arrow_forward.png')} />
        </div>
      }
    </div>
    <div className='navigation'>
      <div className="navigation-content">
        {props.children.length && props.children.map((x, idx) =>
          <div
            key={idx}
            className={`dot ${idx === calcActiveIdx(0, totalNumOfClicks) ? 'active' : ''}`}
            onClick={() => handleNavClick(idx)}
          > </div >)
        }
      </div>
    </div>
  </div>;
};

Carousel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.object
  ])
};

export default Carousel;
