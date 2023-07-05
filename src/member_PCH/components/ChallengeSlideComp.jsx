import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';

const Item = styled.div`
  opacity: 1;
  transform: scale(1);
`;

const SlideContainer = styled.div`
  width: 100%;
  height: 600px;

  .center .slick-center ${Item} {
    /* center 모드일때 center에게 강조할 경우 사용 */
    opacity: 1;
    transform: scale(0.9);
    z-index: 100;
  }

  .center .slick-center ${Item}:hover {
    transform: scale(0.95);
  }

  .center ${Item} {
    /* center 모드일때 center 외 속성에게 사용 */
    opacity: 0.8;
    transition: all 300ms ease;
    transform: scale(0.7);
    border-radius: 50px;
    border: 0.5px solid rgba(0,0,0,0.2);
    box-shadow: 0 5px 10px 2px rgba(0,0,0,0.2);
    box-sizing: border-box;
    padding: 50px 20px;
  }

  & div {
    height: inherit;
  }

  & h4 {
    font-size: 23px;
    margin-bottom: 10px;
  }

  & span{
    font-size: 18px;
    font-weight: bold;
  }

  & img {
    width: 90%;
    margin: auto;
  }

  & a, p {
    font-size: 10px;
    color: white;
  }
`;

const SlidePage = styled.div`
  text-align: center;
  padding: ${(props) => props.padding};
  
  ${Item} {
    /* center 옵션의 경우 ITem 속성을 추가로 사용해서 내부 옵션을 추가로 줘야함 */
    font-size: 36px;
    
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
    arrow : true
  };

  return (
    <SlideContainer>
      <Slider {...setting}>
        <SlidePage>
          <Item>
            <h4>STEP 1</h4>
            <span>나만의 챌린지를 만들기</span>
            <img src={require('../../assets/img/create_challenge.png')} alt="챌린지 생성 이미지" />
            <p>
              출처 <a href="https://kr.freepik.com/free-psd/3d-illustration-of-female-graphic-designer-character-with-calendar_29013778.htm#&position=3&from_view=collections">Freepik</a>
            </p>
          </Item>
        </SlidePage>
        <SlidePage>
          <Item >
            <h4>STEP 2</h4>
            <span>다양한 챌린지에 참여하기</span>
            <img src={require('../../assets/img/participate_challenge.png')} alt="챌린지 참여 이미지" />
            <p>
              출처 <a href="https://kr.freepik.com/free-psd/3d-illustration-of-female-graphic-designer-character-working-on-tablet_29013792.htm#page=2&query=3d%20icon%20participation&position=6&from_view=search&track=ais">Freepik</a>
            </p>
          </Item>
        </SlidePage>
        <SlidePage>
          <Item>
            <h4>STEP 3</h4>
            <span>같은 챌린지에 참여하는 유저들과 소통하기</span>
            <img src={require('../../assets/img/comment_challenge.png')} alt="챌린지 댓글 이미지" />
            <p>
              출처 <a href="https://kr.freepik.com/free-psd/3d-illustration-of-female-graphic-designer-character-holding-laptop-with-chat-bubbles_29013791.htm#&position=14&from_view=collections">Freepik</a>
            </p>
          </Item>
        </SlidePage>
        <SlidePage>
          <Item>
            <h4>STEP 4</h4>
            <span>머니베이션에서 제공하는 챌린지를 완료하여 뱃지 받기</span>
            <img src={require('../../assets/img/done_challenge.png')} alt="챌린지 완료 이미지" />
            <p>
              출처 <a href="https://kr.freepik.com/free-psd/3d-illustration-of-female-graphic-designer-character-holding-calendar-with-rocket_29013788.htm#&position=12&from_view=collections">Freepik</a>
            </p>
          </Item>
        </SlidePage>
      </Slider>
    </SlideContainer>
  )
}
