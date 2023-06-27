// 개인회원 회원정보 수정 및 탈퇴 페이지

import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { auth, db, storage } from '../../database/firebase';
import { collection, doc, getDoc, getDocs, query, updateDoc, where, Timestamp } from 'firebase/firestore';
import { getAuth, sendSignInLinkToEmail, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import '../css/mypageEditPu.css'


export default function MypageEditPu() {
    const params = useParams();
    const location = useLocation();
    const { name, email, uid } = location.state || "";
    const [selectedImage, setSelectedImage] = useState(null); // storage 업로드 이미지 관리

    const [profile, setProfile] = useState();
    const [startDate, setStartDate] = useState('');

    // 닉네임 관리
    const [nickname, setNickname] = useState(''); // 닉네임 상태변수 설정
    const [birth, setBirth] = useState('');

    // 생년월일 관리
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState('');

    // 연락처 관리
    const [phoneNum, setPhoneNum] = useState('');
    const [checkPhone, setCheckPhone] = useState(false);
    const [otp, setOtp] = useState(''); // 인증번호 관리


    /** form 실행 */
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const usersRef = doc(db, "personal_users", params.id);
      const usersSnap = await getDoc(usersRef);
      if (usersSnap.exists()) {
        await updateDoc(usersRef, {
          nickname: nickname,
          birth: selectedYear + "년" + selectedMonth + "월" + selectedDay + "일",
          phone: phoneNum,
        });
      }
    };
    
    useEffect(() => {
      const getProfile = async() => {
        const docSnap = await getDoc( doc(db, "personal_users", params.id) );
        const data = docSnap.data();

        setProfile(data);
        setNickname(data.nickname);
        setBirth(data.birth);
        setPhoneNum(data.phone);
        setStartDate(data.startDate.toDate());
        
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

    // 수정 버튼 클릭 시 확인 대화상자 표시
    const handleClickUpdate = (e) => {
      const confirmed = window.confirm("수정 하시겠습니까?");
        if (confirmed) {
          handleSubmit(e);
        }
    };


    /** form 입력 값 업데이트 */
    // 닉네임 업데이트
    const updateNickname = (e) => {
      setNickname(e.target.value);
    }


    // 연락처 업데이트
    const updatePhoneNum = (e) => {
      setPhoneNum(e.target.value);
    }


    /** 닉네임 중복 확인 */
    const onSearch = async() => {
      const q = query(collection(db, "personal_users"), 
        where("nickname", "==", nickname)
      );
      
      const querySnapshot = await getDocs(q);
      if(!querySnapshot.empty) {
        alert("이미있는 값입니다!")
      } else {
        alert("사용가능한 값입니다!")
      }
    }

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

    
    /** 휴대폰 인증 */
    // 번호 입력 - 인증 전송
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
      let formattedPhoneNum = phoneNum;

      // 대한민국 국번 변경
      if (phoneNum.startsWith('010') && phoneNum.length === 11) {
        formattedPhoneNum = '+82' + phoneNum.slice(1);
      }

      const appVerifier = window.recaptchaVerifier;
    
      signInWithPhoneNumber(auth, formattedPhoneNum, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        alert("메세지가 전송됐습니다")
      }).catch((error) => {
        console.log(error)
        alert("메세지가 전송되지 않았습니다.")
      });
    }

    // 휴대폰 인증번호 확인
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
        setCheckPhone(!checkPhone);
      }).catch((error)=>{
        console.log(error)
        setOtp("");
        alert("인증번호가 올바르지 않습니다.")
      })
    }


    /** 프로필 이미지 수정 */
    const handleChangeProfile = (e) => {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      
      const storageRef = ref(storage, file.name);
      
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log('Uploaded a file:', snapshot.metadata.name);
          // 업로드한 파일의 다운로드 URL 가져오기
          getDownloadURL(storageRef)
            .then((url) => {
              // 사용자 프로필 업데이트
              const usersRef = doc(db, "personal_users", params.id);
              updateDoc(usersRef, {
                photo: url,
              })
                .then(() => {
                  console.log('User profile updated successfully.');
                  // 프로필 업데이트 후 필요한 작업 수행
                })
                .catch((error) => {
                  console.log('Error updating user profile:', error);
                });
            })
            .catch((error) => {
              console.log('Error getting download URL:', error);
            });
        })
        .catch((error) => {
          console.log('Error uploading file:', error);
        });
    };


    return (
      <div id = "layout">
        { profile && 
          <div className = 'mypage-Edit-Pu'>
            <div>
              <label htmlFor = "profile-image">
                <img
                  src = { selectedImage || (profile.photo !== "없음" ? profile.photo : "/img/defaultProfile.jpg") }
                  width = { 100 }
                  height = { 100 }
                  alt = "프로필"
                  style = {{ borderRadius: "50%", cursor: "pointer" }}
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
            <div>
              <p>이메일 { profile.email }</p>
              <p>회원구분 <span>개인회원</span></p>
              <p>가입일 <span>{ startDate.getFullYear() }.{ startDate.getMonth() + 1 }.{ startDate.getDate() }</span></p>
            </div>
            <div>
              회원탈퇴
            </div>
          </div>
        }
<br />

        <form onSubmit = { handleSubmit }>
          <h2>회원정보 수정</h2>

          {/* 닉네임 수정 */}
          <div>
            <label>닉네임</label>
            <input
              type = "text"
              value = { nickname }
              minLength = { 2 }
              maxLength = { 10 }
              onChange = { updateNickname }
              required
            />
            <button
              type = "button"
              onClick = { onSearch }
            >
              중복확인
            </button>
          </div>

          {/* 출생일 수정 */}
          <div>
            <label>출생</label>
            <select
              value = { selectedYear }
              onChange = { onYearChange }
              required
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
            <input
              type = "password"
              placeholder = "비밀번호"
              minLength = { 8 }
              maxLength = { 20 }
              onKeyDown = { characterCheck }
              disabled = { email }
            />
          </div>
          <div>
            <label>비밀번호 확인</label>
            <input
              type = "password"
              placeholder = "비밀번호 재확인" 
              minLength = { 8 }
              maxLength = { 20 }
              onKeyDown = { characterCheck } 
              disabled = { email }
            />
          </div>
          <div>
            {/* {
              password1 !== null && password1 === password2 ? "*  비밀번호가 일치합니다" : "* 비밀번호가 일치하지  않습니다"
            } */}
          </div>

          {/* 연락처 수정 */}
          <div>
            <label>연락처</label>
            <input
              type = "number"
              value = { phoneNum }
              onChange = { updatePhoneNum }
            />
            <button
              id = "sign-in-button"
              type = "button"
              onClick = { onSignInSubmit }
              onChange={ (e) => { setPhoneNum(e.target.value) } }
            >
              인증번호 발송
            </button>
          </div>

          {/* 연락처 인증번호 */}
          <div>
            <label>인증번호</label>
            <input
              type = "number"
              placeholder = "인증번호"
              value = { otp }
              onChange = { (e) => { setOtp(e.target.value) } }
            />
            <button
              type = "button"
              onClick = { onOTPVerify }
            >
              인증번호 확인
            </button>
          </div>
          
          <input type = "submit" value = "수정하기" onClick = { handleClickUpdate }/>
        </form>
      </div>
    )
}