// 메인페이지 

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import { logout } from '../../member_PC_HS/slice/userSlice';
import FallingCoinComp from '../components/FallingCoinComp';
import AppPointerComp from '../components/AppPointerComp';
import LogoFlowComp from '../components/LogoFlowComp';
import MainNavComp from '../components/MainNavComp';


export default function Home({ handleHover }) {
  const user = useSelector((state)=>state.user.user);
  // console.log(user);

  const [footerHidden, setFooterHidden] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    console.log(sessionStorage.getItem('user'))
    dispatch(logout());
    navigate('/');
  }

  const footerToggleBtn = () => {
    setFooterHidden(footerHidden => !footerHidden);
  };


  return (
    <div id='mainpage'>
      <AppPointerComp/>
      <main>
        <section id='section1'>
          <div className='coin-animation-left'>
            <FallingCoinComp/>
            <FallingCoinComp/>
            <FallingCoinComp/>
            <FallingCoinComp/>
            <FallingCoinComp/>
          </div>
          <div className='coin-animation-right'>
            <FallingCoinComp/>
            <FallingCoinComp/>
            <FallingCoinComp/>
            <FallingCoinComp/>
            <FallingCoinComp/>
          </div>
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
              <p>저금 목표를 설정하고 달성해 보세요</p>
            </div>
            <div className='imgbox'>
              <p>3,000만원 모으기💰</p>
              <p>집 떠나 독립하기🏡</p>
              <p>해외로 현실도피🛫</p>
            </div>
          </div>
          <div className='space'/>
        </section>

        <section id='section3'>
          <div className='box-container'>
            <div className='textbox'>
              <h3>Collect Badges</h3>
              <p>가계부를 꾸준히 기록하여 귀여운 뱃지를 획득하세요</p>
            </div>
            <div className='imgbox'>
              <p>세상엔 맛있는 게 너무 많아</p>
              <p>오늘도 커피 수혈</p>
              <p>데이터 만수르</p>
              <p>건강이 최고</p>
            </div>
          </div>
          <div className='space'/>
        </section>

        <section id='section4'>
          <div className='box-container'>
            <h3>Challenge Together</h3>
            <p>다른 유저들과 함께 도전하세요</p>
            <div className='slidebox'>
              이미지 슬라이드
            </div>
          </div>
          <div className='space'/>
        </section>

        <section id='section5'>
          <div className='box-container'>
            <h3>Wealth Management Consultation</h3>
            <p>자산관리사에게 궁금한 것을 물어보세요</p>
            <div className='slidebox'>
              이미지 슬라이드
            </div>
          </div>
          <div className='space'/>
        </section>

        <section id='section6'>
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
