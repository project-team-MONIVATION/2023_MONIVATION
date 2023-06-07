import React from 'react'
import { Link, Outlet } from 'react-router-dom';
import Btns from '../styleComponent/LoginForm/Btns';
import Logo from '../styleComponent/LoginForm/Logo';
import LoginBtn from '../styleComponent/LoginForm/LoginBtn';
import CreateBtn from '../styleComponent/LoginForm/CreateBtn';
import BackGround from '../styleComponent/BackGround'

export default function LoginForm() {
  return (
    <BackGround>
      <Logo>MONIVATION</Logo>
      
      <Btns>
        <CreateBtn> 
        {/* style={{display: "inline-block", padding: "10px", border: "solid black 1px"}}> */}
          <Link to='/'>Create Account</Link>
        </CreateBtn>

        <LoginBtn> 
        {/* style={{display: "inline-block", padding: "10px", border: "solid black 1px"}}> */}
          <Link to='/1'>Login</Link>
        </LoginBtn>
      </Btns>
      
      <Outlet/>
    </BackGround>
  )
}
