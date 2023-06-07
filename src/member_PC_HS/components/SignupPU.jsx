import React, { useState } from 'react'
import { auth, db } from '../../database/firebase';
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, sendSignInLinkToEmail, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, addDoc, query, getDocs, where, updateDoc, collection, Timestamp } from 'firebase/firestore'

import InnerDiv from '../styleComponent/Signup/InnerDiv';
import Form from '../styleComponent/Signup/Form';
import InputSmall from '../styleComponent/Signup/InputSmall';
import InputBtn from '../styleComponent/Signup/InputBtn';
import InputBig from '../styleComponent/Signup/InputBig';
import BirthInput from '../styleComponent/Signup/BirthInput';
import InputSubmit from '../styleComponent/InputSubmit';
import BackGround from '../styleComponent/BackGround';
import Email from '../styleComponent/Signup/Email';

export default function SignupPU() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email, uid } = location.state || "";
  
  const gotEmail = new URLSearchParams(location.search).get('email');

  const [nick, setNick] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  
  const [phoneNum, setPhoneNum] = useState('');
  const [otp, setOtp] = useState('');
  
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  
  /* 이메일 인증링크 전송 */
  const sendVerificationEmail = () => {
    const actionCodeSettings = {
      url: `http://localhost:3000/signuppu?email=${inputEmail}`,    
      handleCodeInApp : true,
    };

    sendSignInLinkToEmail(getAuth(), inputEmail, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', inputEmail);
      // 인증 이메일 전송 성공 시 실행할 코드
      alert("인증 이메일을 전송했습니다");
    })
    .catch((error)=> {
      const errorCode = error.code;
      const errorMessage = error.message;
      // 인증 이메일 전송 실패 시 실행할 코드
      alert("인증 이메일 전송에 실패했습니다")
    })
  }

  /* 비밀번호 특수문자 삭제 */  
  const characterCheck = (e) => {
    // 허용하고 싶은 특수문자가 있다면 여기서 삭제하면 됨
    const regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi; 
    if( regExp.test(e.target.value) ){
      alert("특수문자는 입력하실수 없습니다.");
      e.target.value = e.target.value.substring( 0 , e.target.value.length - 1 ); 
      // 입력한 특수문자 한자리 지움
    }
  }
  /* 비밀번호가 일치하지않으면 form이 제출안되게 하기 */

  /* 휴대폰 인증 */
  auth.languageCode = 'ko';
  function onCaptchVerify () {
      window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
        'size': 'invisible',
        'callback': (response) => {
          onSignInSubmit()
        },
      }, auth);    
  }
  
  const onSignInSubmit = () => {
    onCaptchVerify()
    const formatPh = '+' + phoneNum;
    const appVerifier = window.recaptchaVerifier;
    
    signInWithPhoneNumber(auth, formatPh, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      alert("메세지가 전송됐습니다")
    }).catch((error) => {
      // Error; SMS not sent
      console.log(error)
      alert("메세지가 전송되지 않았습니다.")
    });
  }

  /* 휴대폰 인증번호 확인 */
  function onOTPVerify() {
    if (!window.confirmationResult) {
      /* 인증안하고 otp입력하면 초기화하기 */
      setOtp("");
      alert("휴대폰 인증을 먼저 진행해주세요.");
      return;
    }
    window.confirmationResult.confirm(otp).then(async(res)=>{
      console.log(res)
      console.log(res.user)
      alert("인증이 완료되었습니다.")
      /*인증이 완료되면 input값 disabled해주기? */
    }).catch((error)=>{
      console.log(error)
      setOtp("");
      alert("인증번호가 올바르지 않습니다.")
    })
  }

  /* 닉네임 중복 확인 */
  const onSearch = async() => {
    const q = query(collection(db, "personal_users"), 
      where("nickname", "==", nick)
    );
    
    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty) {
      alert("이미있는 값입니다!")
      setNick("");
    } else {
      alert("사용가능한 값입니다!")
    }
  }


  /* 생년월일 입력 */
  const onYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const onMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const onDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const createYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1940;
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
    return years;
  };

  const createMonthOptions = () => {
    const months = [];
    for (let month = 1; month <= 12; month++) {
      months.push(
        <option key={month} value={month}>
          {month}
        </option>
      );
    }
    return months;
  };

  const createDayOptions = () => {
    const days = [];
    for (let day = 1; day <= 31; day++) {
      days.push(
        <option key={day} value={day}>
          {day}
        </option>
      );
    }
    return days;
  };

  /* 회원가입 구현 */
  const updateFirestoreDocument = async () => {
  if(uid) {
    try {
      const fmCollectionRef = collection(db, 'personal_users');
      const fmQuery = query(fmCollectionRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(fmQuery);
  
      const formValues = {
        nickname: nick,
        phone: phoneNum,
        birth: selectedYear + "년" + selectedMonth + "월" + selectedDay + "일",
        startDate : Timestamp.fromDate(new Date())
      };
  
      if (!querySnapshot.empty) {
        // If a document with the matching UID is found, update its fields
        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();
  
        const updateData = {
          ...docData,
          ...formValues
        };
  
        await updateDoc(docRef, updateData);
        console.log("Document successfully updated!(소셜로그인 예상)");
        alert("회원가입에 성공했습니다!");
        navigate('/1')
      }
      /* 소셜로그인해서 uid값을 못 찾아왔을때 */ 
      /* 그리고 기존에 add했던 uid가 포함된 값을 삭제해야함 */
      /*else {
        alert("홈페이지로 가서 다시 회원가입을 진행해주세요")
        navigate('/')
      }*/
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }
  /* 일반 이메일로 가입했을떄 */ 
  else {
    // 이메일 인증버튼을 안눌러서 gotEmail을 못받아온 상태
    if(!gotEmail) {
      alert("이메일 인증이 필요합니다")
    } 
    else(
    createUserWithEmailAndPassword(auth, gotEmail, password1)
    .then((userCredential) => {
        // 회원가입에 성공했을때
        // 회원가입하면서 uid가 생김 
        const user = userCredential.user;
        console.log(user)
        addDoc(collection(db, "personal_users"), {
          uid : user.uid,
          name : inputName,
          email : gotEmail,
          photo : "없음",
          nickname : nick,
          phone : phoneNum,
          birth : selectedYear + "년" + selectedMonth + "월" + selectedDay + "일",       
          startDate : Timestamp.fromDate(new Date()),
          login : false,
        })
        alert("회원가입에 성공했습니다!(일반이메일 예상)")
        navigate('/1')
    })
    .catch((error) => {
        // 회원가입에 실패했을때
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        if(errorCode =="auth/email-already-in-use" ) {
            // alert이용하여 알려주거나, 태그를 이용해 알려줌
            alert('동일한 이메일이 있습니다');
        }
        else if (errorCode == "auth/weak-password") {
            alert('비밀번호를 8자리이상 적어주세요')
        }
    }));
    }
  };

  return (
    <BackGround>
      <InnerDiv>

      <h2 style={{color: "gray", paddingTop: "50px", marginTop: "0px"}}>개인 회원가입</h2>
      
      <Form onSubmit={(e)=>{
        e.preventDefault()
        updateFirestoreDocument()
      }}>

        {/* 이메일 입력칸 */}
        <Email>
          <label htmlFor="">Email</label>
          <br />
          <InputSmall 
            type="email" 
            placeholder='이메일' 
            value={(email || gotEmail) ? (email || gotEmail) : inputEmail} 
            disabled={email || gotEmail} 
            onChange={(e)=>{setInputEmail(e.target.value)}}
            required
            />
          <InputBtn
            type='button'
            onClick={sendVerificationEmail}
            disabled={email || gotEmail}
            >인증코드 발송
          </InputBtn>
        </Email>
        <br />
        
        {/* 비밀번호 입력칸 */}
        <label>Password</label>
        <br />
        <InputBig
          type="password"
          placeholder='비밀번호'
          minLength={8}
          maxLength={20}
          onKeyUp={characterCheck} onKeyDown={characterCheck}
          onChange={(e)=>{setPassword1(e.target.value)}}
          disabled={email}
          required
          />
        <p style={{fontSize: "0.5rem"}}>
          * 비밀번호는 영문 대소문자, 숫자를 혼합하여 8~20자로 입력해 주세요
        </p>

        {/* 비밀번호 재확인칸 */}
        <InputBig
          type="password"
          placeholder='비밀번호 재확인' 
          minLength={8}
          maxLength={20}
          onKeyUp={characterCheck} onKeyDown={characterCheck} 
          onChange={(e)=>{setPassword2(e.target.value)}}
          disabled={email}
          required
        />
        <p style={{fontSize: "0.5rem"}}>
          {
            password1 !== null && password1 === password2 ? "* 비밀번호가 일치합니다" : "* 비밀번호가 일치하지 않습니다"
          }
        </p>
        <br />

        {/* 이름 입력 칸 */}
        <label htmlFor="">Name</label>
        <br />
        <InputBig
          type="text" 
          placeholder='이름' 
          value={ name ? name : inputName} 
          disabled={!!name}
          onChange={(e)=>{setInputName(e.target.value)}}
          minLength={2}
          maxLength={5}
          required
        />
        <br />
        <br />
        
        {/* 닉네임 입력 칸 */}
        <label htmlFor="">Nickname</label>
        <br />
        <InputSmall 
          type="text" 
          placeholder='닉네임'
          value={nick} 
          onChange={(e)=>{setNick(e.target.value)}} 
          minLength={2}
          maxLength={10}
          required
        />
        <InputBtn type="button" onClick={onSearch}>중복확인</InputBtn>
        <br />
        <br />

        {/* 생년월일 입력칸 */}
        <label htmlFor="">Birth</label>
        <br />
        <BirthInput id="birth-year" value={selectedYear} onChange={onYearChange} required>
          <option disabled value="">
            출생연도
          </option>
          {createYearOptions()}
        </BirthInput>
        <BirthInput id="birth-month" value={selectedMonth} onChange={onMonthChange} required>
          <option disabled value="">
            월
          </option>
          {createMonthOptions()}
        </BirthInput>
        <BirthInput id="birth-day" value={selectedDay} onChange={onDayChange} required>
          <option disabled value="">
            일
          </option>
          {createDayOptions()}
        </BirthInput>
        <br />
        <br />

        {/* 휴대전화 입력칸 */}
        <label htmlFor="">Phone</label>
        <br />
        <InputSmall 
          type="number" 
          placeholder='휴대전화'
          onChange={(e)=>{setPhoneNum(e.target.value)}}
          required 
        />
        <InputBtn id="sign-in-button" type='button' onClick={onSignInSubmit}>인증번호 발송</InputBtn>
        <br />

        {/* 휴대전화 인증번호 입력칸 */}
        <InputSmall
          type="number" 
          placeholder='인증코드'
          value={otp}
          onChange={(e)=>{setOtp(e.target.value)}}
          required
        />
        <InputBtn type='button' onClick={onOTPVerify}>인증코드 입력</InputBtn>
        <br />
        <br />

        <p>(필수)서비스 이용동의</p>
        <p>(필수)개인정보 수집 및 이용동의</p>
        <p>(선택)이벤트 및 프로모션 알림 동의</p>
        
        <InputSubmit type="submit" value="회원가입 완료"></InputSubmit>
      </Form>
      
      </InnerDiv>
    </BackGround>
  )
}