import React from 'react'
import { animated, useSpring} from 'react-spring'
import { useDrag } from '@use-gesture/react'

const width = 300;
const radius = width /2;
const satelliteWidth = 50;
const satelliteRadius = satelliteWidth / 2;

const offSet = radius - satelliteRadius;
const perimeter = 2 * Math.PI * radius;

const badges = [
  {img: `url(${require('../../assets/img/hospital.png')})`, text:"건강이 최고", back: "rgb(243, 164, 164)", top: "10%", left: "50%"},
  {img: `url(${require('../../assets/img/phone.png')})`, text:"데이터 만수르", back: "rgb(250, 250, 210)", top: "25%", left: "28%"},
  {img: `url(${require('../../assets/img/coffee.png')})`, text:"오늘도 커피 수혈", back: "rgb(235, 204, 178)", top: "25%", left: "72%"},
  {img: `url(${require('../../assets/img/car.png')})`, text:"소중한 내 차", back: "rgb(177, 243, 202)", top: "55%", left: "28%"},
  {img: `url(${require('../../assets/img/drink.png')})`, text:"설마 오늘도?", back: "rgb(194, 176, 231)", top: "55%", left: "72%"},
  {img: `url(${require('../../assets/img/education.png')})`, text:"프로 자기계발러", back: "rgb(187, 227, 240)", bottom: "10%", left: "50%"},
];

let isLeft = false;
let isTop = false;
let cumTheta = 0;

export default function BadgeCircularSlideComp() {

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag((state) => animate(state))

  const animate = ({ e, initial: [ix, iy], movement: [dx, dy]}) => {
    isLeft = ix - e.target.offSetLeft < radius;
    isTop = iy - e.target.offSetTop < radius;
    cumTheta += isLeft ? -dy / 30 : dy / 30;
    cumTheta += isTop ? dx / 100 : -dx / 100;
    api.start({ x: 0, y: cumTheta })
  }
  return (
    <div className='imgbox'>
      <div
        className='circular_slide'
        style={{
          width: `${width}px`,
          height: `${width}px`
        }}
        {...bind()}
      >
        {
          badges.map((badge, i)=>(
            <Satellite
              key={"sate" + i}
              index={i}
              theta={y}
              gap={360 / badges.length}
              badge={badge}
            />
          ))
        }
      </div>
    </div>
  )
}

const Satellite = ({ index, theta, gap, badge }) => {
  return (
    <animated.div
      className="satellite"
      style={{
        width: `${satelliteWidth}px`,
        height: `${satelliteWidth}px`,
        x: theta.to(
          (t) => `${
            radius * Math.cos((t + index * gap)) * (Math.PI / 180) + offSet
          }px`
        ),
        y: theta.to(
          (t) => `${
            radius * Math.sin((t + index * gap)) * (Math.PI / 180) + offSet
          }px`
        )
      }}
    >
      <div
        className='img'
        style={{backgroundImage : badge.img}}
      />
      <p>{badge.text}</p>
    </animated.div>
  )
}
