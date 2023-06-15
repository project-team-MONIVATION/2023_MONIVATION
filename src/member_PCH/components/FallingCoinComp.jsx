import React, { useState } from 'react';
import styled, { css, keyframes} from 'styled-components';

const fall = (moveHeight) => keyframes`
  0% {
    opacity: 0;
    transform: translateY(-180px);
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
    transform: translateY(52vh);
  }
  88% {
    opacity: 1;
    transform: translateY(48vh);
  }
  100% {
    opacity: 1;
    transform: translateY(${moveHeight}vh);
  }
`;


const pop = (moveHeight) => keyframes`
  0% {
    opacity: 1;
    transform: translateY(${moveHeight}vh);
  }
  50%{
    opacity: 1;
    transform: translateY(${moveHeight - 15}vh);
  }
  100% {
    opacity: 1;
    transform: translateY(${moveHeight}vh);
  }
`;


const LeftContainer = styled.div`
  position: absolute;
  width: ${props => props.customWidth}%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  left: ${props => props.customLeft}%;
`;

const RightContainer = styled.div`
  position: absolute;
  width: ${props => props.customWidth}%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  right: ${props => props.customRight}%;
`

const CoinImg = styled.div`
  background-position: bottom;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 1;
  top: -180px;
  transform: translateY(${props => props.moveHeight}vh);

  &.start {
    opacity: 0;
    animation: ${props => fall(props.moveHeight)} 1.5s ease-in 1 forwards;
    animation-delay: ${props => (Math.random() * 1).toFixed(2)}s;
  }

  ${props => props.onlyPop && css`
    animation: ${pop(props.moveHeight)} 0.5s ease-in 1 forwards;
    animation-delay: 0;
  `};
`;

const Coin = ({ style, moveHeight }) => {
  const [startFall, setStartFall] = useState(true);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [onlyPop, setOnlyPop] = useState(false);

  const handleMouseEnter = () => {
    setStartFall(false);
    setIsMouseEnter(true);
    setOnlyPop(true);
  };
  
  const handleAnimationEnd = () => {
    setOnlyPop(false);
  };

  return (
    <CoinImg
      style={style}
      className={startFall && "start"}
      moveHeight={moveHeight}
      onMouseEnter={handleMouseEnter}
      onAnimationEnd={handleAnimationEnd}
      onlyPop={onlyPop}
    ></CoinImg>
  );
};


export default function FallingCoinComp(style = { style }) {
  const makeCoinAnimation = (mh=52) => {
    let width = "128px";
    let height = "128px";
    let backgroundImage = `url(${require('../../assets/img/coin.png')})`;
    const arr = Array.from("1234567890");

  
    return arr.map((coin, i) => {
      width = `${Math.floor(Math.random() * 50) + 50}px`;
      height = `${Math.floor(Math.random() * 50) + 50}px`;

      const style = {
        width,
        height,
        backgroundImage
      };
      return (<Coin key={i} style={style} moveHeight={mh}/>);
    });
  };
  
  return (
    <div>
      <div>
        <LeftContainer style={style} customWidth={25} customLeft={4.4}>{makeCoinAnimation(46)}</LeftContainer>
        <LeftContainer style={style} customWidth={28} customLeft={4}>{makeCoinAnimation(46)}</LeftContainer>
        <LeftContainer style={style} customWidth={29} customLeft={3.6}>{makeCoinAnimation(48)}</LeftContainer>
        <LeftContainer style={style} customWidth={30} customLeft={3.2}>{makeCoinAnimation(50)}</LeftContainer>
        <LeftContainer style={style} customWidth={31} customLeft={2.8}>{makeCoinAnimation()}</LeftContainer>
        <LeftContainer style={style} customWidth={32} customLeft={2.4}>{makeCoinAnimation()}</LeftContainer>
        <LeftContainer style={style} customWidth={33} customLeft={2}>{makeCoinAnimation()}</LeftContainer>
        <LeftContainer style={style} customWidth={33} customLeft={2}>{makeCoinAnimation()}</LeftContainer>
      </div>
      <div>
        <RightContainer style={style} customWidth={25} customRight={4.4}>{makeCoinAnimation(46)}</RightContainer>
        <RightContainer style={style} customWidth={28} customRight={4}>{makeCoinAnimation(46)}</RightContainer>
        <RightContainer style={style} customWidth={29} customRight={3.6}>{makeCoinAnimation(48)}</RightContainer>
        <RightContainer style={style} customWidth={30} customRight={3.2}>{makeCoinAnimation(50)}</RightContainer>
        <RightContainer style={style} customWidth={31} customRight={2.8}>{makeCoinAnimation()}</RightContainer>
        <RightContainer style={style} customWidth={32} customRight={2.4}>{makeCoinAnimation()}</RightContainer>
        <RightContainer style={style} customWidth={33} customRight={2}>{makeCoinAnimation()}</RightContainer>
        <RightContainer style={style} customWidth={33} customRight={2}>{makeCoinAnimation()}</RightContainer>
      </div>
    </div>
  )
};
