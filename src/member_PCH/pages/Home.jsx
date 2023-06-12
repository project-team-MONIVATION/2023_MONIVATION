// 메인페이지 

import React, { useState } from 'react';
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../member_PC_HS/slice/userSlice';
import { FallingCoin } from '../components/CoinAnimationComp';

export default function Home() {
  const [footerHidden, setFooterHidden] = useState(false);

  const user = useSelector((state)=>state.user.user);
  console.log(user)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    console.log(sessionStorage.getItem('user'))
    dispatch(logout());
    navigate('/');
  }

  const footerToggleBtn = () => {
    setFooterHidden(footerHidden => !footerHidden); // on,off 개념 boolean
}

  return (
    <div id='mainpage'>
      <main>
        <section id='section1'>
          <div className='coin-animation-left'>
            <FallingCoin/>
            <FallingCoin/>
            <FallingCoin/>
            <FallingCoin/>
            <FallingCoin/>
          </div>
          <div className='coin-animation-right'>
            <FallingCoin/>
            <FallingCoin/>
            <FallingCoin/>
            <FallingCoin/>
            <FallingCoin/>
          </div>
          <div className='logobox'>
            <div className='logo'></div>
          </div>
          <div className='sloganbox'>
            <p>MONEY + MOTIVATION</p>
            <h3>돈관리에 동기부여를 더하자!</h3>
            <h1>MONIVATION</h1>
          </div>
          {
            user
            ? (
              <div className='btnbox'>
                <p>{user.nickname}님 환영합니다</p>
                <Link to='/calendar'>가계부</Link>
                <Link to='/challenge'>챌린지</Link>
                <Link to='/asset'>자산관리</Link>
                <Link to='/mypage'>마이페이지</Link>
                <button onClick={ onLogout }>로그아웃</button>
              </div>
              
            )
            : (
              <div className='btnbox'>
                <p>돈관리 도파민 생성 시작하기</p>
                <motion.button 
                  onClick={()=>{navigate('/account/login')}}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  로그인
                </motion.button>
                <br />
                <motion.button 
                  onClick={()=>{navigate('/account/create')}}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  회원가입
                </motion.button>
              </div>
            )
          }
        </section>

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
        </section>

        <section id='section4'>
          <div className='box-container'>
            <h3>Challenge Together</h3>
            <p>다른 유저들과 함께 도전하세요</p>
            <div className='slidebox'>
              이미지 슬라이드
            </div>
          </div>
        </section>

        <section id='section5'>
          <div className='box-container'>
            <h3>Wealth Management Consultation</h3>
            <p>자산관리사에게 궁금한 것을 물어보세요</p>
            <div className='slidebox'>
              이미지 슬라이드
            </div>
          </div>
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
