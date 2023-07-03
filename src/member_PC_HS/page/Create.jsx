import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from '../../database/firebase';
import { addDoc, collection, where, getDocs, query } from 'firebase/firestore'
import WrapForm from '../styleComponent/WrapForm'
import InputBox from '../styleComponent/Create/InputBox'
import SignupForm from '../styleComponent/Create/SignupForm'
import BtnBox from '../styleComponent/Create/BtnBox'
import WithEmailBtn from '../styleComponent/Create/WithEmailBtn'
import CreateBtn from '../styleComponent/LoginForm/CreateBtn';
import CloseBtn from '../../member_HHS/styleComponent/DateDetail/CloseBtn';

export default function Create() {
  const navigate = useNavigate();
  const [showPersonalUsers, setShowPersonalUsers] = useState(false);
  const [showFinancialManagers, setShowFinancialManagers] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");

  // 모달창 함수
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setInvitationCode("");
  };
  const handleInvitationCodeChange = (event) => {
    setInvitationCode(event.target.value);
  };

  const handleConfirmation = () => {
    // 초대코드 확인 로직
    if (invitationCode === "1234") {
      handleFM();
    } else {
      alert("초대코드가 올바르지 않습니다.");
    }
    handleModalClose();
  };

  const handlePU = () => {
    setShowPersonalUsers(true);
    setShowFinancialManagers(false);
  }

  const handleFM = () => {
    setShowFinancialManagers(true);
    setShowPersonalUsers(false);
  }

  // 카카오초기화 실행
  useEffect(() => {
    initKakao();
  }, []);

  // 카카오 초기화
  const { Kakao } = window;
  const initKakao = async () => {
    // 나중에 가려야할듯
    const jsKey = "e25b5c7301e9bb85c28b676fd9125b63";
    if (Kakao && !Kakao.isInitialized()) {
      await Kakao.init(jsKey);
      console.log(`kakao 초기화 ${Kakao.isInitialized()}`);
    }
  };

  /* 개인유저 카카오 로그인 */
  const kakaoLoginPU = async () => {
    await Kakao.Auth.login({
      success: async(res) => {
        console.log(res);
        // 이 토큰이 로그인할때 딱히 필요가 없어보임
        Kakao.Auth.setAccessToken(res.access_token);
        console.log("카카오 로그인 성공");

        try {
          const userInfo = await Kakao.API.request({
            url: "/v2/user/me",
          });
          console.log("카카오 인가 요청 성공");
          const kakaoAccount = userInfo.kakao_account;
          console.log(userInfo);
  
          const data = {
            uid: userInfo.id,
            name: kakaoAccount.profile.nickname,
            photo: kakaoAccount.profile.profile_image_url,
            email: kakaoAccount.email ? kakaoAccount.email : "x",
            login: "kakao",
          };

          // 이미 존재하는 uid인지 확인
          const financialManagerRef = collection(db, "personal_users");
          const querySnapshot = await getDocs(
            query(financialManagerRef, where("uid", "==", data.uid))
          );
          // 이미 존재한다면 실행중지
          if (!querySnapshot.empty) {
            alert("이미 아이디가 존재합니다.");
            navigate('/account/login')
            return;
          }
          // 아니라면 진행
          navigate("/account/create/personal-user", { state: data });
          await addDoc(financialManagerRef, data);
        } catch (error) {
          console.log("실패했습니다: ", error);
        }
      },
      fail(error) {
        console.log(error);
      },
    });
  };

  // 생성자 : new를 이용하여 새로운 객체를 생성
  const provider = new GoogleAuthProvider();

  // 개인유저 구글로 로그인
  const onGoogleLoginPU = () =>{
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const userData = {
          name : user.displayName,
          photo : user.photoURL,
          email : user.email,
          uid : user.uid,
          login : "google",
        }

        const financialManagerRef = collection(db, "personal_users");
        const querySnapshot = await getDocs(
          query(financialManagerRef, where("uid", "==", userData.uid))
        );
        // 이미 존재한다면 중지
        if (!querySnapshot.empty) {
          alert("이미 아이디가 존재합니다.");
          navigate("/account/login"); // 이미 아이디가 존재하므로 페이지로 이동
          return; // 함수 실행 중지
        }
        // 아니라면 진행
        await addDoc(financialManagerRef, userData);
        navigate("/account/create/personal-user", { state: userData });

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

  /* 자산관리사 카카오 로그인 */
  const kakaoLoginFM = async () => {
    await Kakao.Auth.login({
      success: async(res) => {
        console.log(res);
        // 이 토큰이 로그인할때 딱히 필요가 없어보임
        Kakao.Auth.setAccessToken(res.access_token);
        console.log("카카오 로그인 성공");

        try {
          const userInfo = await Kakao.API.request({
            url: "/v2/user/me",
          });
          console.log("카카오 인가 요청 성공");
          const kakaoAccount = userInfo.kakao_account;
          console.log(userInfo);
  
          const data = {
            uid: userInfo.id,
            name: kakaoAccount.profile.nickname,
            email: kakaoAccount.email ? kakaoAccount.email : "x",
            photo: kakaoAccount.profile.profile_image_url,
            login: "kakao",
          };
  
          // 이미 존재하는 uid인지 확인
          const financialManagerRef = collection(db, "financial_managers");
          const querySnapshot = await getDocs(
            query(financialManagerRef, where("uid", "==", data.uid))
          );
          // 이미 존재한다면 실행중지
          if (!querySnapshot.empty) {
            alert("이미 아이디가 존재합니다.");
            navigate('/account/login')
            return;
          }
          // 아니라면 진행
          navigate("/account/create/financial-manager", { state: data });
          await addDoc(financialManagerRef, data);
        } catch (error) {
          console.log("실패했습니다: ", error);
        }
      },
      fail(error) {
        console.log(error);
      },
    });
  };
  
  // 자산관리사 구글로 로그인
  const onGoogleLoginFM = () =>{
    signInWithPopup(auth, provider)
      .then(async (result) => {
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
          login : "google",
        }

        const financialManagerRef = collection(db, "financial_managers");
        const querySnapshot = await getDocs(
          query(financialManagerRef, where("uid", "==", userData.uid))
        );
        // 이미 존재한다면 중지
        if (!querySnapshot.empty) {
          alert("이미 아이디가 존재합니다.");
          navigate("/account/login"); // 이미 아이디가 존재하므로 '/1' 페이지로 이동
          return; // 함수 실행 중지
        }
        // 아니라면 진행
        await addDoc(financialManagerRef, userData);
        navigate("/account/create/financial-manager", { state: userData });
      })
      .catch((error) => {
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
    <div>
      <div
        style={{
          width: "600px",
          height: "638px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <WrapForm>
          <div
            style={{
              width: "600px",
              height: "82px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <CreateBtn onClick={()=>{navigate('/account/create')}}>
              <a style={{color: '#8E8E8E'}}>Create Account</a>
            </CreateBtn>
            <CreateBtn onClick={()=>{navigate('/account/login')}}>
              <a style={{color: '#FFFFFF'}}>Login</a>
            </CreateBtn>
          </div>
          {
          showPersonalUsers || showFinancialManagers 
            ? (
              <InputBox>
                {/* 내용 2 */}
                {showPersonalUsers && (
                  <BtnBox>
                    <img 
                      src={require('../../assets/MONIVATION_assets/logo_onlyillust.png')} 
                      alt="logo" 
                      style={{
                        width: "101px",
                        height: "97px",
                      }}
                    />
                    <h2>Let's create <br /> a personal account</h2>

                    <WithEmailBtn>
                      <Link to="/account/create/personal-user">With Email</Link>
                      <p> or create account with </p>
                      <div>
                        <button onClick={onGoogleLoginPU}>
                          <img
                            src={require('../../assets/icon/google.png')}
                            alt="구글 로그인 버튼"
                          />
                        </button>

                        <button onClick={kakaoLoginPU}>
                          <img
                            src={require('../../assets/icon/kakao.png')}
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
                    <img 
                      src={require('../../assets/MONIVATION_assets/logo_onlyillust.png')} 
                      alt="logo" 
                      style={{
                        width: "101px",
                        height: "97px",
                      }}
                    />
                    <h2>Let's create <br /> a financial account</h2>
                    
                    <WithEmailBtn>
                      <Link to ='/account/create/financial-manager'>With Email</Link>
                      <p> or create account with </p>
                      <div>
                        <button onClick={onGoogleLoginFM}>
                          <img
                            src={require('../../assets/icon/google.png')}
                            alt="구글 로그인 버튼"
                          />
                        </button>

                        <button onClick={kakaoLoginFM}>
                          <img
                            src={require('../../assets/icon/kakao.png')}
                            alt="카카오 로그인 버튼"
                          />
                        </button>
                      </div>
                    </WithEmailBtn>
                  </BtnBox>
                )}
              </InputBox>
              ) 
            : (
              <InputBox>
                <img 
                  src={require('../../assets/MONIVATION_assets/logo_onlyillust.png')} 
                  alt="logo" 
                  style={{
                    width: "101px",
                    height: "97px",
                  }}
                />
                <h2>WELCOME!</h2>
                <div style={{marginBottom: "17px"}}>
                  <SignupForm onClick={handlePU}>Personal User</SignupForm>
                </div>
                <div>
                  <SignupForm onClick={handleModalOpen}>Financial Manager</SignupForm>
                </div>
                
              </InputBox>
              )
          }
        </WrapForm>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "600px",
            height: "82px",
            background: "linear-gradient(170deg, #21D6CC 10%, #7D21CF 90%)",
            borderRadius: "50px 50px 0 0",
            boxShadow: "0px 10px 20px 5px rgba(0, 0, 0, 0.15)"
          }}
        />
      </div>
      {/* 초대코드 모달 */}
      {isModalOpen && (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3
          }}>
          <div
            style={{
              boxSizing:"border-box",
              width: "450px",
              height: "400px",
              padding: "20px",
              borderRadius: "50px",
              backgroundColor: "white",
              boxShadow: "0 10px 30px 0 rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-end"
            }}
          > 
            <CloseBtn
              onClick={handleModalClose}
              style={{transform: "scale(0.7)", padding: 0}}
            >
              X
            </CloseBtn>
            <div 
              style={{
                  width: "410px", 
                  height: "336px",
                  display: "flex", 
                  flexDirection: "column",
                  justifyContent: "center"
              }}
            >
              <p
                style={{
                  fontSize: "23px"
                }}
              >
                초대코드를 입력해 주세요
              </p>
              <input
                type="text"
                value={invitationCode}
                onChange={handleInvitationCodeChange}
                style={{
                  width: "340px",
                  height: "50px",
                  borderRadius: "50px",
                  background: "#E6E6E6",
                  boxShadow: "0px 0px 10px 0px rgba(142, 142, 142, 0.30) inset",
                  border: 0,
                  margin: "32px auto",
                  boxSizing: "border-box",
                  textAlign: "center"
                }}
              />
              <button 
                onClick={handleConfirmation}
                style={{
                  width: "127px",
                  height: "39px",
                  margin: "0 auto",
                  background: "linear-gradient(170deg, #21D6CC 10%, #7D21CF 90%)",
                  border: 0,
                  borderRadius: "50px",
                  color: "#FFFFFF",
                  fontSize: "15px"
                }}
              >입력</button>
            </div>
          </div>
        </div>
        )}
</div>
  )
}
