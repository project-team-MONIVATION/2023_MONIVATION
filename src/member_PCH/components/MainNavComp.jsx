import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../member_PC_HS/slice/userSlice';


export default function MainNavComp() {
  const user = useSelector((state)=>state.user.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [position, setPosition] = useState(0);

  const onScroll = () => {
    const currentPosition = window.scrollY;
    setPosition(currentPosition);
  };

  const onLogout = () => {
    // console.log(sessionStorage.getItem('user'));
    dispatch(logout());
    window.scrollTo({top:0, behavior:"smooth"});
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [position]);  

  console.log(position)

  
  return (
    <div>
      {
        position > 990 && 
          (user
            ? (
              <nav className='main-nav onlongin'>
                <ul>
                  <div className='nav-logo' onClick={()=>{window.scrollTo({top:0, behavior:"smooth"})}}/>
                  <div className='nav-list'>
                    <li onClick={()=>{navigate('/calendar')}}>가계부</li>
                    <li onClick={()=>{navigate('/challenge')}}>챌린지</li>
                    <li onClick={()=>{navigate('/asset')}}>자산관리</li>
                    <li onClick={()=>{navigate('/mypage')}}>마이페이지</li>
                    <li onClick={onLogout}>로그아웃</li>
                  </div>
                </ul>
              </nav>
            )
            : (
              <nav className='main-nav onlogout'>
                <div className='nav-logo' onClick={()=>{window.scrollTo({top:0, behavior:"smooth"})}}/>
              </nav>
            )
          )
        }
    </div>
  )
}
