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
      <Link to='/'><Logo/></Link>
      
      {/** 
      <Btns>
        <CreateBtn> 
          <Link to='/account/create'>Create Account</Link>
        </CreateBtn>

        <LoginBtn> 
          <Link to='/account/login'>Login</Link>
        </LoginBtn>
      </Btns>
      */}
      
      <Outlet/>
    </BackGround>
  )
}
