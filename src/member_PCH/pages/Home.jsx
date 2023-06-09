// 메인페이지 

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userLogout } from '../../member_PC_HS/slice/userSlice';

export default function Home() {
  const user = useSelector((state)=>state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    console.log(sessionStorage.getItem('user'))
    dispatch(userLogout());
    navigate('/');
  }

  return (
    <div>
      <h1>Home</h1>
      <div>
        {
          user === null
          ? (
            <div>
              <Link to='/account/login'>로그인</Link>
              <Link to='/account/create'>회원가입</Link>
            </div>
          )
          : (
            
            <div>
            <Link to='/calendar'>가계부</Link>
            <Link to='/challenge'>챌린지</Link>
            <Link to='/asset'>자산관리</Link>
            <Link to='/mypage'>마이페이지</Link>
            <button onClick={ onLogout }>로그아웃</button>
          </div>
          )
        }
      </div>
    </div>
  )
}
