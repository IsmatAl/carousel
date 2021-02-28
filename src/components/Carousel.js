import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';


const calcX = (totalNumOfClicks, numOfCarouselItems, idx, width) => {
  totalNumOfClicks = (totalNumOfClicks) % numOfCarouselItems;
  const totalWidth = numOfCarouselItems * width;
  const xValue = (totalWidth + (totalNumOfClicks + idx + 1) * width) % totalWidth - width;
  return xValue;
};


const setOpacity = (xValuePrev, xValue, width, numOfCarouselItems) =>
  (!xValuePrev || Math.abs(xValuePrev - xValue) < (numOfCarouselItems - 1) * width) ? 1 : 0;

const prevXValues = [];

const Carousel = (props) => {
  const numOfCarouselItems = props.children ? props.children.length : 0;
  const width = 100;
  const [totalNumOfClicks, setTotalNumOfClicks] = useState(0);
  const [isSwiping, setSwiping] = useState(false);
  const [startX, setStartX] = useState(0);


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


  const slides = props.children &&
    props.children.map((child, idx) => {
      const xValue = calcX(totalNumOfClicks, numOfCarouselItems, idx, width);
      const carouselItem = <div
        className='carousel-item'
        key={idx}
        style={{
          transform: `translateX(${xValue}%)`,
          opacity: setOpacity(
            prevXValues[idx],
            xValue,
            width,
            numOfCarouselItems
          )
        }}
      >

        {child}

      </div>;
      prevXValues[idx] = xValue;
      return carouselItem;
    });

  return <div className="carousel"


    onMouseDown={(e) => {
      setStartX(e.clientX);
    }}
    onMouseMove={() => {
      if (!isSwiping) setSwiping(true);
    }}
    onMouseUp={(e) => {
      if (isSwiping || !e.button === 0) {
        const endX = e.clientX;
        if (endX - startX > 0) prev();
        if (endX - startX < 0) next();
      }
      setStartX(0);
    }}


    onTouchStart={(e) => {
      setStartX(e.changedTouches ? e.changedTouches[0].clientX : startX);
      setSwiping(false);
    }}
    onTouchMove={() => {
      setSwiping(true);
    }}
    onTouchEnd={(e) => {
      e.preventDefault();
      if (isSwiping) {
        const endX = e.changedTouches ? e.changedTouches[0].clientX : startX;
        if (endX - startX > 0) prev();
        if (endX - startX < 0) next();
      }
      setSwiping(false);
      setStartX(0);
    }}>


    {props.children &&
      <div className="carousel-content">
        <div className='prev'
          onClick={prev}
        >
          <img src='../../public/imgs/arrow_back.png' draggable={false} />
        </div>
        {slides}
        <div className='next' onClick={next}>
          <img src='../../public/imgs/arrow_forward.png' draggable={false} />
        </div>
      </div>
    }


    <div className='navigation'>
      <div className="navigation-content">
        {props.children && props.children.map((x, idx) =>
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
