import React from 'react';

const Coin = ({style}) => {
  return (
    <div className='coin' style={style}></div>
  )
};

export default function FallingCoin({ style }) {
  const makeCoinAnimation = () => {
    let animationDelay = "0s";
    let width = "128px";
    let height = "128px";
    const arr = Array.from("1234567890");
  
    return arr.map((coin, i) => {
      animationDelay = `${(Math.random() * 1).toFixed(2)}s`;
      width = `${Math.floor(Math.random() * 50) + 50}px`;
      height = `${Math.floor(Math.random() * 50) + 50}px`;
      const style = {
        animationDelay,
        width,
        height,
      };
      return (<Coin key={i} style={style}/>);
    });
  };
  
  return (
    <div className='coin-container' style={style}>
      {makeCoinAnimation()}
    </div>
  )
};