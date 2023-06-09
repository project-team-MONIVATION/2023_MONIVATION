// 메인페이지 

import React from 'react';
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../member_PC_HS/slice/userSlice';

export default function Home() {
  const user = useSelector((state)=>state.user.user);
  console.log(user)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    console.log(sessionStorage.getItem('user'))
    dispatch(logout());
    navigate('/');
  }

  return (
    <div id='mainpage'>
      <main>
        <section id='section1'>
          <div className='logobox'>
            <div className='logo'></div>
          </div>
          <div className='sloganbox'>
            <p>MONEY + MOTIVATION</p>
            <h3 className='slogan'>"돈관리에 동기부여를 더하자!"</h3>
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
                  transition={{ duration: 0.25 }}
                >
                  로그인
                </motion.button>
                <motion.button 
                  onClick={()=>{navigate('/account/create')}}
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.25 }}
                >
                  회원가입
                </motion.button>
              </div>
            )
          }
        </section>
      </main>
    </div>
  )
}
