import React, {useEffect, useState} from 'react'
import { auth, db } from '../../database/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../slice/userSlice';
import WrapForm from '../styleComponent/WrapForm';
import InputBox2 from '../styleComponent/Login/InputBox2';
import EmailWithPassword from '../styleComponent/Login/EmailWithPassword';
import SocialBtn from '../styleComponent/Login/SocialBtn';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
    initKakao();
  }, [])
  
  const { Kakao } = window;
  
  const initKakao = async () => {
    const jsKey = "e25b5c7301e9bb85c28b676fd9125b63";
    if (Kakao && !Kakao.isInitialized()) {
      await Kakao.init(jsKey);
      console.log(`kakao 초기화 ${Kakao.isInitialized()}`);
    }
  };
  
  /* 일반이메일 로그인 */
  const onLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user)
      
      const fmCollectionRef = collection(db, 'financial_managers');
      const puCollectionRef = collection(db, 'personal_users');
      const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
      const puQuery = query(puCollectionRef, where('uid', '==', user.uid));

      Promise.all([getDocs(fmQuery), getDocs(puQuery)])
      .then(([fmQuerySnapshot, puQuerySnapshot]) => {
        let userDocRef;
        
        if (!fmQuerySnapshot.empty) {
          // financial_managers 컬렉션에서 uid 값이 일치하는 문서가 있을 경우
          userDocRef = doc(db, 'financial_managers', fmQuerySnapshot.docs[0].id);
        } else if (!puQuerySnapshot.empty) {
          // personal_users 컬렉션에서 uid 값이 일치하는 문서가 있을 경우
          userDocRef = doc(db, 'personal_users', puQuerySnapshot.docs[0].id);
        } else {
          // 회원가입을 먼저 진행해야 함
          alert("회원가입을 먼저 진행해주세요");

          return;
        }
        
        getDoc(userDocRef)
          .then((userDocSnapshot) => {
            const userData = userDocSnapshot.data();  
            dispatch(userLogin({
              uid: userData.uid,
              nickname: userData.nickname,
              photo: userData.photo,
            }));
            navigate('/calendar');
          })
          .catch((error) => {
            console.log("실패했습니다: ", error);
          });

      })
      .catch((error) => {
        console.log("실패했습니다: ", error);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      console.log(errorCode)
      alert("아이디 또는 비밀번호가 일치하지 않습니다")
    });
  }

  /* 카카오 로그인 */
  const kakaoLogin = async () => {
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

            const fmCollectionRef = collection(db, 'financial_managers');
            const puCollectionRef = collection(db, 'personal_users');
            const fmQuery = query(fmCollectionRef, where('uid', '==', res.id));
            const puQuery = query(puCollectionRef, where('uid', '==', res.id));

            Promise.all([getDocs(fmQuery), getDocs(puQuery)])
            .then(([fmQuerySnapshot, puQuerySnapshot]) => {
              let userDocRef;
              
              if (!fmQuerySnapshot.empty) {
                // financial_managers 컬렉션에서 uid 값이 일치하는 문서가 있을 경우
                userDocRef = doc(db, 'financial_managers', fmQuerySnapshot.docs[0].id);
              } else if (!puQuerySnapshot.empty) {
                // personal_users 컬렉션에서 uid 값이 일치하는 문서가 있을 경우
                userDocRef = doc(db, 'personal_users', puQuerySnapshot.docs[0].id);
              } else {
                // 회원가입을 먼저 진행해야 함
                alert("회원가입을 먼저 진행해주세요");

                return;
              }
              
              getDoc(userDocRef)
                .then((userDocSnapshot) => {
                  const userData = userDocSnapshot.data();  
                  dispatch(userLogin({
                    uid: userData.uid,
                    nickname: userData.nickname,
                    photo: userData.photo,
                  }));
                  navigate('/calendar');
                })
                .catch((error) => {
                  console.log("실패했습니다: ", error);
                });
            })
            .catch((error) => {
              console.log("실패했습니다: ", error);
            });
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
  const onGoogleLogin = () =>{
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user)
        
        const fmCollectionRef = collection(db, 'financial_managers');
        const puCollectionRef = collection(db, 'personal_users');
        const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
        const puQuery = query(puCollectionRef, where('uid', '==', user.uid));

        Promise.all([getDocs(fmQuery), getDocs(puQuery)])

            .then(([fmQuerySnapshot, puQuerySnapshot]) => {
              let userDocRef;
              
              if (!fmQuerySnapshot.empty) {
                // financial_managers 컬렉션에서 uid 값이 일치하는 문서가 있을 경우
                userDocRef = doc(db, 'financial_managers', fmQuerySnapshot.docs[0].id);
              } else if (!puQuerySnapshot.empty) {
                // personal_users 컬렉션에서 uid 값이 일치하는 문서가 있을 경우
                userDocRef = doc(db, 'personal_users', puQuerySnapshot.docs[0].id);
              } else {
                // 회원가입을 먼저 진행해야 함
                alert("회원가입을 먼저 진행해주세요");
                return;
              }
              
              getDoc(userDocRef)
                .then((userDocSnapshot) => {
                  const userData = userDocSnapshot.data();  
                  dispatch(userLogin({
                    uid: userData.uid,
                    nickname: userData.nickname,
                    photo: userData.photo,
                  }));
                  navigate('/calendar');
                })
                .catch((error) => {
                  console.log("실패했습니다: ", error);
                });
            })
            .catch((error) => {
              console.log("실패했습니다: ", error);
            });

        

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...  
        console.log(errorMessage)
        console.log(errorCode)
      });
  }

  return (
        <WrapForm>
            <InputBox2>
                <img src="/img/logo.png" alt="" style={{width:"100px"}}/>
                <h2>WELCOME BACK!</h2>
                <EmailWithPassword
                  onSubmit={(e)=>{
                    e.preventDefault();
                    onLogin();
                  }}
                >
                  <input type="text" placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}}/>
                  <br />
                  <input type="text" placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
                  <br />
                  <input type='submit' value={`Let's start!`} />
                </EmailWithPassword>

            {/* 쇼셜로그인 버튼 */}
            <SocialBtn>
              <p> or login with </p>
              <div>
                <button onClick={onGoogleLogin}>
                  <img
                    src="/img/google.png"
                    alt="구글 로그인 버튼"
                  />
                </button>

                <button onClick={kakaoLogin}>
                  <img
                    src="/img/kakao.png"
                    alt="카카오 로그인 버튼"
                    />
                </button>
              </div>
            </SocialBtn>
            </InputBox2>
        </WrapForm>
  )
}