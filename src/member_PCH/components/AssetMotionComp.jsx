import React from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components';
import Slider from "react-slick";
import { useHref, useNavigate } from 'react-router-dom';

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: auto;
  margin-top: 11vh;
`

const Card = styled.div`
  width: 100%;
  height: 25vh;
  margin: auto;
  background-color: #e6e6e6;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: inset 0 0 10px 0px rgba(0,0,0,0.1);
`

const Title = styled.p`
  box-sizing: border-box;
  padding: 3vh;
  width: 100%;
  height: 7vh;
  text-align: left;
  font-family: 'Cafe24Ssurround';
  font-size: 22px;
`

const BookImg = styled.div`
  width: 90px;
  height: 140px;
  background-position: center;
  background-size: cover;
`

const AboutBook = styled.p`
  font-size: 14px;
  margin-top: 5px;
`


const cardVariants = {
  offscreen: {
    y: 200
  },
  onscreen: {
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};


export default function AssetMotionComp() {
  
  const booklist = [
    {
      title: "돈의 속성", 
      author: "김승호",
      publisher: "스노우폭스북스",
      date: "2020.06.15",
      img: `url(${require('../../assets/img/bookcover/돈의속성.jpg')})`,
      link: "https://product.kyobobook.co.kr/detail/S000001913217"
    },
    {
      title: "박태웅의 AI 강의", 
      author: "박태웅",
      publisher: "한빛비즈",
      date: "2023.06.20",
      img: `url(${require('../../assets/img/bookcover/박태웅의AI강의.jpg')})`,
      link: "https://product.kyobobook.co.kr/detail/S000202610587"
    },
    {
      title: "부자 아빠 가난한 아빠 1", 
      author: "로버트 기요사키",
      publisher: "민음인",
      date: "2022.10.28",
      img: `url(${require('../../assets/img/bookcover/부자아빠가난한아빠1.jpg')})`,
      link: "https://product.kyobobook.co.kr/detail/S000001772245"
    },
    {
      title: "여의도 선수들의 비밀", 
      author: "이대호",
      publisher: "트러스트북스",
      date: "2023.07.15",
      img: `url(${require('../../assets/img/bookcover/여의도선수들의비밀.jpg')})`,
      link: "https://product.kyobobook.co.kr/detail/S000202673131"
    },
    {
      title: "돈은 너로부터다", 
      author: "김종봉 외",
      publisher: "다산북스",
      date: "2023.05.10",
      img: `url(${require('../../assets/img/bookcover/돈은너로부터다.jpg')})`,
      link: "https://product.kyobobook.co.kr/detail/S000202000699"
    },
    {
      title: "부자의 그릇", 
      author: "이즈미 마사토",
      publisher: "다산북스",
      date: "2020.12.14",
      img: `url(${require('../../assets/img/bookcover/부자의그릇.jpg')})`,
      link: "https://product.kyobobook.co.kr/detail/S000001687079"
    },
    {
      title: "세력주 투자 기술", 
      author: "디노(백새봄)",
      publisher: "경향BP",
      date: "2023.07.05",
      img: `url(${require('../../assets/img/bookcover/세력주투자기술.jpg')})`,
      link: "https://product.kyobobook.co.kr/detail/S000202801361"
    },
    {
      title: "레버리지", 
      author: "롭 무어",
      publisher: "다산북스",
      date: "2023.02.15",
      img: `url(${require('../../assets/img/bookcover/레버리지.jpg')})`,
      link: "https://product.kyobobook.co.kr/detail/S000200940784"
    },
  ];

  const videolist = [
    {
      title: "3분30초만에 알아보는 자산관리방법 PICK 6",
      src: "https://www.youtube.com/embed/hikmv2mSVxo"
    },
    {
      title: "평범한 직장인으로 20억 자산까지 딱 10년!!! 누구의 도움없이도 가능한 돈에 대한 예의를 갖추자! (자산관리 1편)",
      src: "https://www.youtube.com/embed/EnZpz8SgM4U",
    },
    {
      title: "월급의 몇%를 저축하고 있나요? 사회 초년생 월급관리 10분 정리!",
      src: "https://www.youtube.com/embed/kQZSeJXq7lE"
    },
    {
      title: "삼성전자 말고 ‘이 주식’을 사모으세요. 정말 유일합니다 (이종우)",
      src: "https://www.youtube.com/embed/GJorguPKRTk"
    },
    {
      title: "24살. 즐기면서 6,600만원 모은 법! (저축 방향성, 20대 재테크 책, 돈 아끼는 일상습관)",
      src: "https://www.youtube.com/embed/6PPEpa8iz68"
    },
    {
      title: "우선 1억 모아서 이렇게 하세요. 노후 걱정 끝입니다. “가장 확실한 노후 준비 1가지” | 강창희 대표 3부",
      src: "https://www.youtube.com/embed/s7pPfCYs9_M"
    },
    {
      title: "슈카가 인정한 이승기, 전형적인 부자의 포트폴리오 [집사부일체| SBS 210228방송]",
      src: "https://www.youtube.com/embed/RvRBURbkEvE"
    },
    {
      title: "골프의 신과 투자의 신이 모였다! 자산관리편",
      src: "https://www.youtube.com/embed/xLWoNhpIlMQ"
    }
  ]
  const allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";


  const truncateText = (text, limit) => {
    if (text.length <= limit) {
      return text; 
    }
    
    return text.slice(0, limit) + '...';
  }
  

  const settings = {
    dots: false,
    arrow: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4
  }

  

  return (
    <CardContainer>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        style={{ width: "inherit", marginBottom: "20px" }}
      >
        <motion.div 
          variants={cardVariants}
        >
          <Card>
            <Title>관련서적</Title>
            <Slider {...settings}
              style={{width: "91%", margin: "auto", marginTop: "6px"}}
            >
              {
                booklist.map((book,i)=>(
                  <div key={i}>
                    <div
                      style={{ 
                        display: "flex",
                        boxSizing: "border-box",
                        margin: "0 20px",
                        borderRadius: " 0 20px 20px 0",
                        backgroundColor: "#ffffff",
                        boxShadow: "1px 1px 3px 0 rgba(0,0,0,0.2)",
                        cursor: "pointer"
                      }}
                      onClick={()=>{window.open(book.link)}}
                    >
                      <BookImg style={{backgroundImage: book.img}}/>
                      <div 
                        style={{
                          textAlign: "left",
                          boxSizing: "border-box", 
                          padding: "20px 15px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        <p 
                          style={{
                            fontSize: "18px", 
                            fontWeight: "bold"
                          }}
                        >
                          {book.title}
                        </p>
                        <div>
                          <AboutBook>저자 : {book.author}</AboutBook>
                          <AboutBook>출판사 : {book.publisher}</AboutBook>
                          <AboutBook>출판일 : {book.date}</AboutBook>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </Slider>
          </Card>
        </motion.div>
      </motion.div>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        style={{ width: "inherit" }}
      >
        <motion.div 
          variants={cardVariants}
        >
          <Card
            style={{height: "33vh"}}
          >
            <Title>꿀팁영상</Title>
            <Slider {...settings}
              className='video'
              style={{width: "91%", height: "65%", margin: "auto", marginTop: "6px"}}
            >
              {
                videolist.map((video, i)=>(
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        boxSizing: "border-box",
                        margin: "0 20px",
                        borderRadius: "20px",
                        overflow:"hidden",
                        backgroundColor: "#ffffff",
                        boxShadow: "1px 1px 3px 0 rgba(0,0,0,0.2)",
                        height: "99%"
                      }}
                    >
                      <iframe src={video.src} title={video.title} allow={allow}/>
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          boxSizing: "border-box",
                          padding: "18px 10px"
                        }}
                      >{truncateText(video.title, 38)}</p>
                    </div>
                  </div>
                ))
              }
            </Slider>
          </Card>
        </motion.div>
      </motion.div>
    </CardContainer>
  )
}
