import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from '../../database/firebase';
import { addDoc, collection } from 'firebase/firestore'
import WrapForm from '../styleComponent/WrapForm'
import InputBox from '../styleComponent/Create/InputBox'
import SignupForm from '../styleComponent/Create/SignupForm'
import BtnBox from '../styleComponent/Create/BtnBox'
import WithEmailBtn from '../styleComponent/Create/WithEmailBtn'

export default function Create() {
  const navigate = useNavigate();
  const [showPersonalUsers, setShowPersonalUsers] = useState(false);
  const [showFinancialManagers, setShowFinancialManagers] = useState(false);

  useEffect(() => {
    initKakao();
  }, []);

  const handlePU = () => {
    setShowPersonalUsers(true);
    setShowFinancialManagers(false);
  }

  const handleFM = () => {
    setShowFinancialManagers(true);
    setShowPersonalUsers(false);
  }

  // 자산관리사 카카오 회원가입
  const { Kakao } = window;
  const initKakao = async () => {
    const jsKey = "e25b5c7301e9bb85c28b676fd9125b63";
    if (Kakao && !Kakao.isInitialized()) {
      await Kakao.init(jsKey);
      console.log(`kakao 초기화 ${Kakao.isInitialized()}`);
    }
  };

  /* 개인유저 로그인 */
  const kakaoLoginPU = async () => {
    await Kakao.Auth.login({
      success(res) {
        console.log(res);
        // 이 토큰이 로그인할때 딱히 필요가 없어보임
        Kakao.Auth.setAccessToken(res.access_token);
        console.log("카카오 로그인 성공");

        Kakao.API.request({
          url: "/v2/user/me",
          success(res) {
            console.log("카카오 인가 요청 성공");
            const kakaoAccount = res.kakao_account;
            console.log(res);
            
            const data = {
              name : kakaoAccount.profile.nickname,
              photo : kakaoAccount.profile.profile_image_url,
              email : kakaoAccount.email ? kakaoAccount.email : "x",
              uid : res.id,
              login : false,
              nickname : "호선"
            }

            addDoc(collection(db, "personal_users"), data)
            .then(()=>{
              navigate('/account/create/personal-user', { state : data } )
            })
            .catch((error)=>{
              console.log("실패했습니다: ", error)
            })
            
          },
          fail(error) {
            console.log(error);
          },
        });
      },
      fail(error) {
        console.log(error);
      },
    });
  };

  // 구글로 로그인
  const onGoogleLoginPU = () =>{
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const userData = {
          name : user.displayName,
          email : user.email,
          uid : user.uid,
          photo : user.photoURL,
          login : false,
          nickname : "박찬"
        }

        addDoc(collection(db, "personal_users"), userData)
        .then(()=>{
          navigate('/account/create/personal-user', { state : userData })
        })
        .catch((error)=>{
          console.log("실패했습니다: ", error)
        })


      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  /* 자산관리사 로그인 */
  const kakaoLoginFM = async () => {
    await Kakao.Auth.login({
      success(res) {
        console.log(res);
        // 이 토큰이 로그인할때 딱히 필요가 없어보임
        Kakao.Auth.setAccessToken(res.access_token);
        console.log("카카오 로그인 성공");

        Kakao.API.request({
          url: "/v2/user/me",
          success(res) {
            console.log("카카오 인가 요청 성공");
            const kakaoAccount = res.kakao_account;
            console.log(res);
            
            const data = {
              name : kakaoAccount.profile.nickname,
              photo : kakaoAccount.profile.profile_image_url,
              email : kakaoAccount.email ? kakaoAccount.email : "x",
              uid : res.id,
              login : "false",
              nickname : "호선"
            }

            addDoc(collection(db, "financial_managers"), data)
            .then(()=>{
              navigate('/account/create/financial-manager', { state : data } )
            })
            .catch((error)=>{
              console.log("실패했습니다: ", error)
            })
            
          },
          fail(error) {
            console.log(error);
          },
        });
      },
      fail(error) {
        console.log(error);
      },
    });
  };

  // 생성자 : new를 이용하여 새로운 객체를 생성
  const provider = new GoogleAuthProvider();
  
  // 구글로 로그인
  const onGoogleLoginFM = () =>{
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const userData = {
          name : user.displayName,
          email : user.email,
          uid : user.uid,
          photo : user.photoURL,
          login : false,
          nickname : "박찬"
        }

        addDoc(collection(db, "financial_managers"), userData)
        .then(()=>{
          navigate('/account/create/financial-manager', { state : userData })
        })
        .catch((error)=>{
          console.log("실패했습니다: ", error)
        })


      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <WrapForm>
      {showPersonalUsers || showFinancialManagers ? (
        <InputBox>
          {/* 내용 2 */}
          {showPersonalUsers && (
            <BtnBox>
              <img src="img/logo.png" alt="" style={{width:"100px"}}/>
              <h2>Let's create <br /> a personal account</h2>

              <WithEmailBtn>
                <Link to="/account/create/personal-user">With Email</Link>
                <p> or create account with </p>
                <div>
                  <button onClick={onGoogleLoginPU}>
                    <img
                      src="img/google.png"
                      alt="구글 로그인 버튼"
                    />
                  </button>

                  <button onClick={kakaoLoginPU}>
                    <img
                      src="img/kakao.png"
                      alt="카카오 로그인 버튼"
                    />
                  </button>
                </div>
              </WithEmailBtn>
            </BtnBox>
          )}
          {/* 내용 3 */}
          {showFinancialManagers && (
            <BtnBox>
              <img src="img/logo.png" alt="" style={{width:"100px"}}/>
              <h2>Let's create <br /> a financial account</h2>
              
              <WithEmailBtn>
                <Link to ='/account/create/financial-manager'>With Email</Link>
                <p> or create account with </p>
                <div>
                  <button onClick={onGoogleLoginFM}>
                    <img
                      src="img/google.png"
                      alt="구글 로그인 버튼"
                    />
                  </button>

                  <button onClick={kakaoLoginFM}>
                    <img
                      src="img/kakao.png"
                      alt="카카오 로그인 버튼"
                    />
                  </button>
                </div>
              </WithEmailBtn>
            </BtnBox>
          )}
        </InputBox>
      ) : (
        <InputBox>
          <img src="img/logo.png" alt="" style={{width:"100px"}}/>
          <h2>WELCOME!</h2>
          <div>
            <SignupForm onClick={handlePU}>Personal User</SignupForm>
          </div>
          <div>
            <SignupForm onClick={handleFM}>Financial Manager</SignupForm>
          </div>
        </InputBox>
      )}
    </WrapForm>
  )
}
