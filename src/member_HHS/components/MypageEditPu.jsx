// 개인회원 회원정보 수정 및 탈퇴 페이지

import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { auth, db, storage } from '../../database/firebase';
import { collection, doc, getDoc, getDocs, query, updateDoc, where, Timestamp, deleteDoc } from 'firebase/firestore';
import { getAuth, sendSignInLinkToEmail, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword, updatePassword, deleteUser } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import '../css/mypageEditPu.css'


export default function MypageEditPu() {
    const params = useParams();
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [profile, setProfile] = useState();
    const [startDate, setStartDate] = useState('');

    // 닉네임 관리
    const [nickname, setNickname] = useState(''); // 닉네임 상태변수 설정
    const [nickname2, setNickname2] = useState('');
    const [birth, setBirth] = useState('');

    // 생년월일 관리
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState('');

    // 연락처 관리
    const [phoneNum, setPhoneNum] = useState('');
    const [otp, setOtp] = useState(''); // 인증번호 관리
    const [checkPhone, setCheckPhone] = useState(false);
    const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false);

    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const [selectedImage, setSelectedImage] = useState(null); // storage 업로드 이미지 관리
    const [selectedFileName, setSelectedFileName] = useState(''); // 파일 이름 상태 변수 이름 변경

     // 개인정보 값 받아오기
    useEffect(() => {
      const getProfile = async() => {
        const docSnap = await getDoc( doc(db, "personal_users", params.id) );
        const data = docSnap.data();

        setProfile(data);
        setNickname(data.nickname);
        setNickname2(data.nickname);
        setBirth(data.birth);
        setPhoneNum(data.phone);
        setStartDate(data.startDate.toDate());
        setLogin(data.login);
        
        // 출생연도 값 설정
        const birthArray = data.birth.split('년');
        const selectedYear = birthArray[0];
        const selectedMonth = birthArray[1].split('월')[0];
        const selectedDay = birthArray[1].split('월')[1].split('일')[0];
        setSelectedYear(selectedYear);
        setSelectedMonth(selectedMonth);
        setSelectedDay(selectedDay);
      }
      getProfile();
    }, [])

    /** form 실행 */
    const handleSubmit = async (e) => {
      e.preventDefault();
    const confirmed = window.confirm("수정 하시겠습니까?");
    if(confirmed) {
      if(password1 !== password2) {
        alert('비밀번호를 올바르게 입력하세요')
      }
      else if(password1 || password2 === null) {
        alert('비밀번호를 입력하세요')
      }
      else {
        const usersRef = doc(db, "personal_users", params.id);
        const usersSnap = await getDoc(usersRef);
        const storage = getStorage();

        if (usersSnap.exists()) {

        // 이미지가 선택된 경우 실행
        if (selectedImage) {
          const file = await fetch(selectedImage).then((res) => res.blob());
          const storageRef = ref(storage, 'images/' + selectedFileName); // 비루트 참조로 변경하여 경로 생성// 변경된 파일 이름 사용

          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          await updateDoc(usersRef, { photo: url });
        }

          await updateDoc(usersRef, {
            nickname: nickname,
            birth: selectedYear + "년" + selectedMonth + "월" + selectedDay + "일",
            phone: phoneNum,
          });

          updatePassword(auth.currentUser, password1)
            .then(() => {
              alert('개인정보가 수정되었습니다')
            })
            .catch((error) => {
              console.error('변경 실패', error)
            })
          }
          navigate('/mypage');
        }
      }
    };

    /** 회원탈퇴 */
    const deleteBtn = async () => {
      const confirmed = window.confirm("탈퇴 하시겠습니까?");
      if (confirmed) {
        try {
          await deleteUser(auth.currentUser);
          // 파이어스토어의 personal_users 컬렉션에서 해당 uid값을 가진 문서 삭제하기
          await deleteDoc(doc(db, "personal_users", params.id));
          navigate('/');
        } catch (error) {
          console.error('탈퇴 실패', error);
        }
      }
    };


    /** form 입력 값 업데이트 */

    // 연락처 업데이트 // 단계 1: 수정할 번호 입력
    const updatePhoneNum = (e) => {
      const newPhoneNum = e.target.value;
      // 연락처 길이 제한 (예: 11자리로 제한)
      if (newPhoneNum.length > 11) {
        return;
      }
      setPhoneNum(newPhoneNum);
    }

     // 닉네임 업데이트
    const updateNickname = (e) => {
      setNickname(e.target.value);
    }

    /** 닉네임 중복 확인 */
    const onSearch = async() => {
      if(nickname === nickname2) {
        alert('기존 닉네임입니다!')
      } else {  
        const q = query(collection(db, "personal_users"), 
          where("nickname", "==", nickname)
        );
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty) {
          alert("이미있는 값입니다!")
          setNickname('');
        } else {
          alert("사용가능한 값입니다!")
        }
      }
    }

    
    /** 생년월일 */
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
      const endYear = 2010;
      const years = [];
      for (let year = currentYear; year >= startYear; year--) {
        if (year <= endYear) {
          years.push(
            <option key={year} value={year}>
              {year}
            </option>
          );
        }
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


    /** 비밀번호 특수문자 삭제 */  
    const characterCheck = (e) => {
      // 허용하고 싶은 특수문자가 있다면 여기서 삭제하면 됨
      const regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi; 
        if( regExp.test(e.target.value) ){
          alert("특수문자는 입력하실수 없습니다.");
          e.target.value = e.target.value.substring( 0 , e.target.value.length - 1 ); 
          // 입력한 특수문자 한자리 지움
      }
    }

    
    /** 휴대폰 인증 */
    // 번호 입력 - 인증 전송
    auth.languageCode = 'ko';
    function onCaptchVerify () {
      window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button2', {
        'size': 'invisible',
        'callback': (response) => {
          onSignInSubmit()
        },
      }, auth);    
    }
  
    // 단계 2: 번호 인증발송
    const onSignInSubmit = () => {
      onCaptchVerify()
      let formattedPhoneNum = phoneNum;

      // 연락처 유효성 검사
      if (phoneNum.length !== 11) {
        alert("올바른 휴대폰 번호를 입력해주세요.");
        return;
      }

      // 대한민국 국번 변경
      if (phoneNum.startsWith('010') && phoneNum.length === 11) {
        formattedPhoneNum = '+82' + phoneNum.slice(1);
      }

      const appVerifier = window.recaptchaVerifier;
    
      signInWithPhoneNumber(auth, formattedPhoneNum, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        alert("메세지가 전송됐습니다")
        setIsPhoneNumberVerified(true); // 인증번호 발송 후 상태 업데이트
      }).catch((error) => {
        console.log(error)
        alert("메세지가 전송되지 않았습니다.")
      });
    }

    // 단계 3: 인증번호 입력하기
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
        // setCheckPhone(!checkPhone);
      }).catch((error)=>{
        console.log(error)
        setOtp("");
        alert("인증번호가 올바르지 않습니다.")
      })
    }


    /** 프로필 이미지 수정 */
    const handleChangeProfile = (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileName = file.name; // 파일 이름 저장
        setSelectedImage(URL.createObjectURL(file));
        setSelectedFileName(fileName); // 파일 이름 상태 변수 변경
    
        console.log(fileName); // 파일 이름 확인 (옵션)
      }
    };

    
    return (
      <div id = "layout" style = {{ overflow: 'hidden' }}>
        <div id = 'mypage-edit-pu'>
          { profile && 
            <div className = 'pu-information'>
              <div className = 'pu-img'>
                <label htmlFor = "profile-image">
                  <img
                    src = { selectedImage || (profile.photo !== "없음" ? profile.photo : "/img/defaultProfile.jpg") }
                    alt = "프로필"
                  />
                </label>
                <input
                  type = "file"
                  id = "profile-image"
                  accept = "image/*"
                  style = {{ display: "none" }}
                  onChange = { handleChangeProfile }
                />
              </div>
              <div className = 'text'>
                <p>이메일 <span>{ profile.email }</span></p>
                <p>회원구분 <span>개인회원</span></p>
                <p>가입일 <span>{ startDate.getFullYear() }.{ startDate.getMonth() + 1 }.{ startDate.getDate() }</span></p>
              </div>
              <div className = 'delete' onClick={ deleteBtn }>
                회원탈퇴
              </div>
            </div>
          }

        <div className = 'edit'>
        <form onSubmit = { handleSubmit }>
          <div className='grid'>
          {/* 닉네임 수정 */}
          <div style = {{display:'inline'}}>
            <label>닉네임</label>
            <div className = 'nickname-input'>
              <input
                type = "text"
                value = { nickname }
                minLength = { 2 }
                maxLength = { 10 }
                onChange = { updateNickname }
                required
                className = 'edit-input-short'
              />
              <button
                type = "button"
                onClick = { onSearch }
                className = 'btn'
              >
                중복확인
              </button>
            </div>
          </div>

          {/* 출생일 수정 */}
          <div className='birth-wrap' >
          <label>출생</label>
            <select
              value = { selectedYear }
              onChange = { onYearChange }
              required
              className = 'selected-birth'
            >
              <option value = "" disabled>
                출생연도
              </option>
              {createYearOptions()}
            </select>
            <select
              value = { selectedMonth }
              onChange = { onMonthChange }
              required
              className = 'selected-birth'
            >
              <option value = "" disabled>
                월
              </option>
              {createMonthOptions()}
            </select>
            <select
              value = { selectedDay }
              onChange = { onDayChange }
              required
              className = 'selected-birth'
            >
              <option value = "" disabled>
                일
              </option>
              {createDayOptions()}
            </select>
          </div>

          {/* 비밀번호 수정 */}
          <div>
            <label>비밀번호</label>
            <div className = 'password-input'>
              <input
                type = "password"
                placeholder = "비밀번호"
                minLength = { 8 }
                maxLength = { 20 }
                onKeyDown = { characterCheck }
                disabled = {login !== 'email'}
                onChange = {(e)=>{setPassword1(e.target.value)}}
                className = 'edit-input-long'
                required
              />
            </div>
          </div>
          <div className = 'edit-div'>
            <label>비밀번호 확인</label>
            <input
              type = "password"
              placeholder = "비밀번호 재확인" 
              minLength = { 8 }
              maxLength = { 20 }
              onKeyDown = { characterCheck } 
              disabled = {login !== 'email'}
              onChange = {(e)=>{setPassword2(e.target.value)}}
              className = 'edit-input-long'
              required
            />
          </div>
          <div style = {{ position:"absolute", top:"283px", left:"50px", fontSize:"0.9rem"}}>
            {
              login !== 'email' ? "* 소셜 로그인 계정은 비밀번호가 필요없습니다" : (password1 !== null && password1 === password2 ? "*  비밀번호가 일치합니다" : <span style = {{color:"red"}}>* 비밀번호가 일치하지  않습니다</span>)
            }
          </div>

          {/* 연락처 수정 */}
          <div>
            <label>연락처</label>
            <div className = 'phone-input'>
              <input
                type = "number"
                value = { phoneNum }
                onChange = { updatePhoneNum }
                className = 'edit-input-short'
                minLength={11}
                disabled
              />
              <button
                // id = "sign-in-button2"
                type = "button"
                onClick = { onSignInSubmit }
                onChange = { (e) => { setPhoneNum(e.target.value) } }
                className = 'btn'
                disabled
              >
                인증번호 발송
              </button>
            </div>
          </div>

          {/* 연락처 인증번호 */}
          <div className='edit-div'>
            <label>인증번호</label>
            <input
              type = "number"
              placeholder = "인증번호"
              value = { otp }
              onChange = { (e) => { setOtp(e.target.value) } }
              className = 'edit-input-short'
              disabled
            />
            <button
              type = "button"
              onClick = { onOTPVerify }
              className='btn'
              disabled
            >
              인증번호 확인
            </button>
          </div>
          </div>
          
          <input type = "submit" value = "수정하기" className = 'form-submit'/>
        </form>
        </div>

      </div>
    </div>
  )
}