import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../member_PC_HS/slice/userSlice';

export default function NavComp() {
  const user = useSelector((state)=>state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    console.log(sessionStorage.getItem('user'))
    dispatch(logout());
    navigate('/');
  };

  return (
    <div>
      <NavLink to='/'>로고</NavLink>
      <NavLink to='/calendar'>가계부</NavLink>
      <NavLink to='/challenge'>챌린지</NavLink>
      <NavLink to='/asset'>자산관리</NavLink>
      <NavLink to='/mypage'>마이페이지</NavLink>
      <NavLink to='/'
        onClick={ onLogout }
      >
        로그아웃
      </NavLink>
    </div>
  )
}
