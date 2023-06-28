import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { useDrag } from '@use-gesture/react'


const WIDTH = 370;
const RADIUS = WIDTH / 2;
const SATELLITE_WIDTH = 125;
const SATELLITE_RADIUS = SATELLITE_WIDTH / 2;

const OFFSET = RADIUS - SATELLITE_RADIUS - 2;
const PERIMETER = 2 * Math.PI * RADIUS;

const DATA = [
  {img: `url(${require('../../assets/img/hospital.png')})`, title:"건강이 최고", back: "rgb(243, 164, 164)"},
  {img: `url(${require('../../assets/img/phone.png')})`, title:"데이터 만수르", back: "rgb(250, 250, 210)"},
  {img: `url(${require('../../assets/img/coffee.png')})`, title:"카페인 덕후", back: "rgb(235, 204, 178)"},
  {img: `url(${require('../../assets/img/car.png')})`, title:"소중한 내 차", back: "rgb(177, 243, 202)"},
  {img: `url(${require('../../assets/img/drink.png')})`, title:"설마 오늘도?", back: "rgb(213, 199, 240)"},
  {img: `url(${require('../../assets/img/education.png')})`, title:"프로 자기계발러", back: "rgb(187, 227, 240)"},
];
var isLeft = false;
var isTop = false;
var cumTheta = 0;


export default function CircularSlider() {

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag((state) => animate(state));

  const animate = ({ event, initial: [ix, iy], movement: [dx, dy] }) => {
    isLeft = ix - event.target.offsetLeft < RADIUS;
    isTop = iy - event.target.offsetTop < RADIUS;
    cumTheta += isLeft ? -dy / 30 : dy / 30;
    cumTheta += isTop ? dx / 100 : -dx / 100;
    api.start({ x: 0, y: cumTheta });
  };

  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const handleHover = (index) => {
    setHoveredIndex(index);
  };

  const handleLeave = () => {
    setHoveredIndex(-1);
  };


  return (
    <div className="wrapper">
      <div
        className="circle"
        style={{
          width: `${WIDTH}px`,
          height: `${WIDTH}px`
        }}
        {...bind()}
      >
        {
          DATA.map((item, i) => (
            <Satellite
              key={"sate" + i}
              index={i}
              theta={y}
              gap={360 / DATA.length}
              item={item}
              isHovered={hoveredIndex === i}
              handleHover={handleHover}
              handleLeave={handleLeave}
            />
          ))
        }
        <div className='explain'>
          {hoveredIndex === 0 && (<p><span>의료</span> 카테고리<br />지출 <span>5만원</span> 이상</p>)}
          {hoveredIndex === 1 && (<p><span>통신</span> 카테고리<br />고정지출 <span>8만원</span> 이상</p>)}
          {hoveredIndex === 2 && (<p><span>카페</span> 카테고리<br />지출 <span>5번</span> 이상</p>)}
          {hoveredIndex === 3 && (<p><span>차량</span> 카테고리<br />지출 <span>20만원</span> 이상</p>)}
          {hoveredIndex === 4 && (<p><span>음주</span> 카테고리<br />지출 <span>10만원</span> 이상</p>)}
          {hoveredIndex === 5 && (<p><span>교육</span> 카테고리<br />고정지출 <span>10만원</span> 이상</p>)}
        </div>
      </div>
    </div>
  )
}


const Satellite = ({ index, theta, gap, item, isHovered, handleHover, handleLeave }) => {
  const scale = isHovered ? 1.2 : 1;

  return (
    <animated.div
      className="satellite"
      style={{
        width: `${SATELLITE_WIDTH}px`,
        height: `${SATELLITE_WIDTH}px`,
        x: theta.to(
          (t) =>
            `${
              RADIUS * Math.cos((t + index * gap) * (Math.PI / 180)) + OFFSET
            }px`
        ),
        y: theta.to(
          (t) =>
            `${
              RADIUS * Math.sin((t + index * gap) * (Math.PI / 180)) + OFFSET
            }px`
        ),
        transform: `scale(${scale})`,
        // transition: "all 0.2s",
        backgroundColor: item.back
      }}
      onMouseEnter={() => handleHover(index)}
      onMouseLeave={handleLeave}
    >
      <div
        style={{
          width :"50%",
          height : "50%",
          backgroundImage: item.img,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          marginBottom: "7px"
        }}
      />
      <p>{item.title}</p>
    </animated.div>
  );
}