import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';

const Item = styled.div`
  opacity: 1;
  transform: scale(1);
`;

const SlideContainer = styled.div`
  width: 100%;

  .center .slick-center ${Item} {
    /* center 모드일때 center에게 강조할 경우 사용 */
    color: white;
    opacity: 1;
    transform: scale(1);
    z-index: 100;

  }

  .center ${Item} {
    /* center 모드일때 center 외 속성에게 사용 */
    opacity: 0.8;
    transition: all 300ms ease;
    transform: scale(0.8);
  }
`;

const SlidePage = styled.div`
  text-align: center;
  padding: ${(props) => props.padding};
  
  ${Item} {
    /* center 옵션의 경우 ITem 속성을 추가로 사용해서 내부 옵션을 추가로 줘야함 */
    font-size: 36px;
    line-height: 15;
    position: relative;
    text-align: center;
  }
`;

export default function ChallengeSlideComp() {
  const setting = {
    className : "center",
    centerMode : true,
    infinite : true,
    centerPadding : 0,
    slidesToShow: 3,
    speed : 500,
    arrow : false
  };

  return (
    <SlideContainer>
      <Slider {...setting}>
        <SlidePage>
          <Item style={{backgroundColor: "red"}}>1</Item>
        </SlidePage>
        <SlidePage>
          <Item style={{backgroundColor: "green"}}>2</Item>
        </SlidePage>
        <SlidePage>
          <Item style={{backgroundColor: "blue"}}>3</Item>
        </SlidePage>
        <SlidePage>
          <Item style={{backgroundColor: "orange"}}>4</Item>
        </SlidePage>
        <SlidePage>
          <Item style={{backgroundColor: "aqua"}}>5</Item>
        </SlidePage>
        <SlidePage>
          <Item style={{backgroundColor: "purple"}}>6</Item>
        </SlidePage>
      </Slider>
    </SlideContainer>
  )
}
