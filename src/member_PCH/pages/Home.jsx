// 메인페이지 

import React, { useState } from 'react';
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import { logout } from '../../member_PC_HS/slice/userSlice';
import FallingCoinComp from '../components/FallingCoinComp';
import AppPointerComp from '../components/AppPointerComp';
import LogoFlowComp from '../components/LogoFlowComp';
import MainNavComp from '../components/MainNavComp';
import ChallengeSlideComp from '../components/ChallengeSlideComp';
import AssetMotionComp from '../components/AssetMotionComp';


export default function Home({ handleHover }) {
  const user = useSelector((state)=>state.user.user);
  // console.log(user);

  const [footerHidden, setFooterHidden] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // 로그아웃
  const onLogout = () => {
    console.log(sessionStorage.getItem('user'))
    dispatch(logout());
    navigate('/');
  }


  // 섹션2 애니메이션 관리 state 및 함수
  const [isDrawn, setIsDrawn] = useState([]);
  const goals = [
    { icon: "💰", text: "3,000만원 모으기" },
    { icon: "🏡", text: "집 떠나 독립하기" },
    { icon: "🛫", text: "해외로 현실도피" }
  ];

  const handleClick = (index) => {
    const updatedDrawn = [...isDrawn];
    updatedDrawn[index] = true;
    setIsDrawn(updatedDrawn);
  };

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 }
      }
    }
  };


  // 섹션3 애니메이션 관리 state 및 함수
  const badges = [
    {img: `url(${require('../../assets/img/food.png')})`, text:"세상엔 맛있는 게 너무 많아"},
    {img: `url(${require('../../assets/img/coffee.png')})`, text:"오늘도 커피 수혈"},
    {img: `url(${require('../../assets/img/hospital.png')})`, text:"건강이 최고"},
    {img: `url(${require('../../assets/img/car.png')})`, text:"소중한 내 차"},
    {img: `url(${require('../../assets/img/drink.png')})`, text:"설마 오늘도?"},
    {img: `url(${require('../../assets/img/education.png')})`, text:"프로 자기계발러"},
  ]


  // 푸터 토글
  const footerToggleBtn = () => {
    setFooterHidden(footerHidden => !footerHidden);
  };



  return (
    <div id='mainpage'>
      <AppPointerComp/>
      <main>
        <section id='section1'>
          <FallingCoinComp/>
          <div className='logobox'>
            <div className='logo'/>
            <LogoFlowComp/>
          </div>
          <div className='sloganbox'>
            <div>
              <p>MONEY + MOTIVATION</p>
              <h3>돈관리에 동기부여를 더하자!</h3>
            </div>
          </div>
          {
            user
            ? (
              <div className='btnbox'>
                <p>🌟 {user.nickname}님 환영합니다 🌟</p>
                <div className='onlogin'>
                  <motion.button
                    onClick={()=>{navigate('calendar')}}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    가계부
                  </motion.button>
                  <motion.button
                    onClick={()=>{navigate('/challenge')}}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    챌린지
                  </motion.button>
                  <motion.button
                    onClick={()=>{navigate('/asset')}}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    자산관리
                  </motion.button>
                  <motion.button
                    onClick={()=>{navigate('/mypage')}}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    마이페이지
                  </motion.button>
                  <motion.button
                    onClick={onLogout}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    로그아웃
                  </motion.button>
                </div>
              </div>
            )
            : (
              <div className='btnbox'>
                <p>🌟 저축 도파민 생성 시작하기 🌟</p>
                <div className='onlogout'>
                  <motion.button 
                    onClick={()=>{navigate('/account/login')}}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    로그인
                  </motion.button>
                  <motion.button 
                    onClick={()=>{navigate('/account/create')}}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    회원가입
                  </motion.button>
                </div>
              </div>
            )
          }
        </section>

        <MainNavComp/>

        <section id='section2'>
          <div className='box-container'>
            <div className='textbox'>
              <h3>Achieve the Goal</h3>
              <p><span>저금 목표</span>를 설정하고 달성해 보세요</p>
            </div>
            <div className="imgbox">
              {goals.map((goal, i) => (
                <div
                  className="goal"
                  onClick={() => handleClick(i)}
                  key={i}
                >
                  <motion.svg
                    width="100"
                    height="100"
                    viewBox="0 0 200 200"
                    initial="hidden" // 추가
                    animate={isDrawn[i] ? "visible" : "hidden"}
                    className="circle_animation"
                  >
                    <motion.circle
                      className="circle"
                      cx="100"
                      cy="100"
                      r="92"
                      stroke="#735BF3"
                      variants={draw}
                    />
                  </motion.svg>
                  <div>
                    <span>{goal.icon}</span>
                  </div>
                  <p>{goal.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='space'/>
        </section>

        <section id='section3'>
          <div className='box-container'>
            <div className='textbox'>
              <h3>Collect Badges</h3>
              <p>가계부를 꾸준히 기록하고 <span>귀여운 뱃지</span>를 획득하세요</p>
            </div>
            <div className='imgbox'>
              {
                badges.map((badge, i)=>(
                  <div className='badge'>
                    <div
                      className='img'
                      style={{backgroundImage : badge.img}}
                    />
                    <p>{badge.text}</p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className='space'/>
        </section>

        <section id='section4'>
          <div className='box-container'>
            <div className='textbox'>
              <h3>Challenge Together</h3>
              <p>다른 유저들과 <span>함께</span> 도전하세요</p>
            </div>
            <div className='slidebox'>
              <ChallengeSlideComp/>
            </div>
          </div>
          <div className='space'/>
        </section>

        <section id='section5'>
          <div className='box-container'>
            <div className='textbox'>
              <h3>Tips Board</h3>
              <p>자산관리에 유용한 정보를 <span>추천</span>받아 보세요</p>
            </div>
            <div className='slidebox'>
              <AssetMotionComp/>
            </div>
          </div>
          <div className='space'/>
        </section>

        <section id='section6'>
          <div className='box-container'>
            <div className='textbox'>
              <h3>Wealth Management Consultation</h3>
              <p>자산관리사에게 <span>궁금한 것</span>을 물어보세요</p>
            </div>
            <div className='slidebox'>
            </div>
          </div>
          <div className='space'/>
        </section>

        <section id='section7'>
          <div className='btnbox'>
            <p>🌟돈관리 도파민 생성🌟</p>
            <button onClick={()=>{window.scrollTo({top:0, behavior:"smooth"})}}>우리와 함께 하세요</button>
          </div>
        </section>
      </main>

      <footer>
        <div className='title-sns'>
          <p className='title'>
          About Us. <br />
          Asset Management Service
          </p>
          <p className='sns'>Instagram</p>
          <p className='sns'>Kakaochanel</p>
        </div>
        <div className='about'>
          <span>MONIVATION</span>
          <button onClick={footerToggleBtn}>▽</button>
          <div>
            {
              footerHidden && (
                <div className='hiddenbox'>
                  Front-end Team Project.
                </div>
              )
            }
          </div>
          <p className='copy'>Copyright 2023. MONIVATION All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
