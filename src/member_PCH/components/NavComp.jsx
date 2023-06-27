import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../member_PC_HS/slice/userSlice';

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
    <div id='nav'>
      <div 
        className='logo'
        onClick={()=>{navigate('/')}}
      />
      <div className='nav_list'>
        <NavLink 
          to='/calendar'
          className={({isActive})=>(isActive? "active" : "")}
        >
          가계부
        </NavLink>
        <NavLink 
          to='/challenge'
          className={({isActive})=>(isActive? "active" : "")}
        >
          챌린지
        </NavLink>
        <NavLink 
          to='/asset'
          className={({isActive})=>(isActive? "active" : "")}
        >
          자산관리
        </NavLink>
        <NavLink 
          to='/mypage'
          className={({isActive})=>(isActive? "active" : "")}
        >
          마이페이지
        </NavLink>
        <NavLink to='/'
          onClick={ onLogout }
        >
          로그아웃
        </NavLink>
      </div>
    </div>
  )
}
