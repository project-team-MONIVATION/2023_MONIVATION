import React, {useEffect, useState} from 'react'
import { auth, db } from '../../database/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDocs, query, where, collection } from 'firebase/firestore';
import WrapForm from '../styleComponent/WrapForm';
import InputBox2 from '../styleComponent/Login/InputBox2';
import EmailWithPassword from '../styleComponent/Login/EmailWithPassword';
import SocialBtn from '../styleComponent/Login/SocialBtn';

export default function Login() {
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
          if (!fmQuerySnapshot.empty) {
            const docRef = fmQuerySnapshot.docs[0].ref;
            updateDoc(docRef, { login: true })
              .then(() => {
                console.log("updateDoc 실행");
                navigate('/account/create/financial-manager');
              })
              .catch((error) => {
                console.log("실패했습니다: ", error);
              });
          } else if (!puQuerySnapshot.empty) {
            const docRef = puQuerySnapshot.docs[0].ref;
            updateDoc(docRef, { login: true })
              .then(() => {
                console.log("updateDoc 실행");
                navigate('/account/create/personal-user');
              })
              .catch((error) => {
                console.log("실패했습니다: ", error);
              });
          } else {
            console.log("해당 UID에 대한 문서를 찾을 수 없습니다.");
            navigate('/account/login'); // 동작을 취소하고 '/1' 페이지로 이동
          }
        })
        .catch((error) => {
          console.log("실패했습니다: ", error);
        });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
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
                if (!fmQuerySnapshot.empty) {
                  const fmDocRef = fmQuerySnapshot.docs[0].ref;
                  updateDoc(fmDocRef, { login: true })
                    .then(() => {
                      console.log("Financial Manager updateDoc 실행");
                      navigate('/account/create/financial-manager');
                    })
                    .catch((error) => {
                      console.log("Financial Manager 실패했습니다: ", error);
                    });
                } else if (!puQuerySnapshot.empty) {
                  const puDocRef = puQuerySnapshot.docs[0].ref;
                  updateDoc(puDocRef, { login: true })
                    .then(() => {
                      console.log("Personal User updateDoc 실행");
                      navigate('/account/create/personal-user');
                    })
                    .catch((error) => {
                      console.log("Personal User 실패했습니다: ", error);
                    });
                } else {
                  alert("회원가입을 먼저 진행해주세요")
                }
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
        
        const fmCollectionRef = collection(db, 'financial_managers');
        const puCollectionRef = collection(db, 'personal_users');
        const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
        const puQuery = query(puCollectionRef, where('uid', '==', user.uid));

        Promise.all([getDocs(fmQuery), getDocs(puQuery)])
          .then(([fmQuerySnapshot, puQuerySnapshot]) => {
            if (!fmQuerySnapshot.empty) {
              const fmDocRef = fmQuerySnapshot.docs[0].ref;
              // Perform action for financial manager
              updateDoc(fmDocRef, { login: true })
              .then(() => {
                console.log("Financial Manager updateDoc 실행");
                navigate('/account/create/financial-manager');
              })
              .catch((error) => {
                console.log("Financial Manager 실패했습니다: ", error);
              });
            } else if (!puQuerySnapshot.empty) {
              const puDocRef = puQuerySnapshot.docs[0].ref;
              // Perform action for personal user
              updateDoc(puDocRef, { login: true })
              .then(() => {
                console.log("Personal User updateDoc 실행");
                navigate('/account/create/personal-user');
              })
              .catch((error) => {
                console.log("Personal User 실패했습니다: ", error);
              });
            } else {
              alert("회원가입을 먼저 진행해주세요")
            }
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
      });
  }

  return (
        <WrapForm>
            <InputBox2>
                <img src="img/logo.png" alt="" style={{width:"100px"}}/>
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
                    src="img/google.png"
                    alt="구글 로그인 버튼"
                  />
                </button>

                <button onClick={kakaoLogin}>
                  <img
                    src="img/kakao.png"
                    alt="카카오 로그인 버튼"
                    />
                </button>
              </div>
            </SocialBtn>
            </InputBox2>
        </WrapForm>
  )
}