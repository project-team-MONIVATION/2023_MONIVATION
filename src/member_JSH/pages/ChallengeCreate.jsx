// 챌린지 생성하기 페이지
import React from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useRef } from 'react';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ImgDivBox from '../styled-component/ImgDivBox';
import { db, storage } from '../../database/firebase';
import { async } from 'q';
import '../css/challengecreate.css';

export default function ChallengeCreate() {
  const user = useSelector((state)=>state.user.user);
  // useRef를 이용해 input태그에 접근한다.
  const imageInput = useRef();
  // 이미지 업로드 확인 함수
  
  const navigate = useNavigate();

  // 챌린지 명
  const [challengeName, setChallengeName] = useState("");
  // 챌린지 기간
  const [challengeTime, setChallengeTime] = useState();
  // 챌린지 내용
  const [challengeContent, setChallengeContent] = useState();
  // 챌린지 이미지 파일
  const [challengeImg, setChallengeImg] = useState(null);
  // 챌린지 업로드 이미지 파일
  const [uploadImg, setUploadImg]= useState();

  // 체크 여부 결정하는 함수
  const isImageSelected = (imageId) => {
    return challengeImg === imageId;
  };

  const handleImageSelect = (imageId) => {
    setChallengeImg(imageId);
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setChallengeImg(URL.createObjectURL(file));
    setUploadImg(file);
  }

  const addImg = () => {
    //console.log(event.target.files);
    const file = uploadImg;

    const storageRef = ref(storage, file.name);

    uploadBytes(storageRef, file)
      .then((snapshot)=>{
        console.log('Uploaded a file : ', snapshot.metadata.name);
        // 이미지의 다운로드 URL 얻기
        getDownloadURL(snapshot.ref)
          .then((downloadURL)=>{
            console.log('Download URL:', downloadURL);
            setChallengeImg(downloadURL);
            // 여기서 다운로드 URL을 활용하여 저장하거나 출력하는
            // 등의 작업을 수행할 수 있습니다.
          })
          .catch((error)=>{
            console.log('Error getting download URL:', error);
          });
      })
      .catch((error)=>{
        console.log('Error uploading file : ', error);
      })
  };

  const addUserChallenge = async(e) =>{
    e.preventDefault();
    
    const file = uploadImg;
    const storageRef = ref(storage, file.name);

    uploadBytes(storageRef, file)
      .then((snapshot)=>{
        console.log('Uploaded a file : ', snapshot.metadata.name);
        // 이미지의 다운로드 URL 얻기
        getDownloadURL(snapshot.ref)
          .then( async(downloadURL)=>{
            console.log('Download URL:', downloadURL);
            // 여기서 다운로드 URL을 활용하여 저장하거나 출력하는
            // 등의 작업을 수행할 수 있습니다.
            await addDoc(collection(db, "user_challenge"), {
              uid : user.uid,
              name : challengeName,
              time : challengeTime,
              content : challengeContent,
              img : downloadURL,
              writeTime : new Date(),
              nickname : user.nickname
            })
            // 해당 유저 문서의 챌린지 리스트 필드에 챌린지 값 넣기
            navigate('/challenge');
          })
          .catch((error)=>{
            console.log('Error getting download URL:', error);
          });
      })
      .catch((error)=>{
        console.log('Error uploading file : ', error);
      })

    
    
  }

  // 버튼클릭시 input태그에 클릭이벤트를 걸어준다. 
  const onCickImageUpload = () => {
    imageInput.current.click();
  };
  return (
    <div id='layout'>
      <div id=''>
        <div id='challenge-create'>
          <h1>챌린지 생성</h1>
          <div className='challenge-create-wrap'>
            <form onSubmit={addUserChallenge}>
                <div className='img_category'>
                  <p>이미지 선택</p>
                  <div className='img_category_box'>
                  <label>
                    <input
                      type="radio"
                      checked={isImageSelected('img1.jpg')}
                      onChange={() => handleImageSelect('img1.jpg')}
                    />
                    <img 
                      style={{display : "inline-block", 
                      background : "white",
                      border : isImageSelected('img1.jpg') ? 'solid 2px blue' : 'none',
                      }}
                      src={require('../img/img1.jpg')} 
                      alt=""
                    />
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={isImageSelected('img2.jpg')}
                      onChange={() => handleImageSelect('img2.jpg')}
                      
                    />
                    <img 
                      style={{display : "inline-block", 
                      background : "white",
                      border: isImageSelected('img2.jpg') ? 'solid 2px blue' : 'none', 
                      }}
                      src={require('../img/img2.jpg')} alt=""
                    />
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={isImageSelected('img3.png')}
                      onChange={() => handleImageSelect('img3.png')}
                    />
                    <img 
                      style={{display : "inline-block", 
                      background : "white",
                      border: isImageSelected('img3.png') ? 'solid 2px blue' : 'none', 
                      }}
                      src={require('../img/img3.png')} alt=""
                    />
                  </label>
                    {/** + 버튼에 이미지불러오기/불러온이미지를 데이터에 할당하는 작업필요 */}
                    {/** input태그는 display:"none" 을 이용해 안보이게 숨겨준다. */}
                    <input type="file" style={{ display: "none" }} ref={imageInput} 
                      accept=".jpeg, .jpg, .png" onChange={onFileChange}
                    />
                    <div style={{display : "inline-block", width : "200px", 
                    background : "white", height : "150px", borderRadius : "10px",
                    margin : "10px", border : "solid 1px black", cursor : "pointer"}}
                    onClick={onCickImageUpload}>
                      {challengeImg === null ? "+" : challengeImg && 
                      <img 
                        src={challengeImg} 
                        alt='Selected' 
                        style={{display : "inline-block", width : "200px", height : "150px", 
                        borderRadius : "10px"}}
                        />}
                    </div>
                  </div>
                </div>
                <div className='cc-info-wr-wrap'>
                  <ul>
                    <li>
                      <div className='challenge-create-info'>
                      <p>챌린지 정보</p>
                        <ul>
                          <li>
                            <label htmlFor="" >챌린지명 </label>
                            <input type="text" value={challengeName} 
                                  onChange={(e)=>setChallengeName(e.target.value)}
                                  name='challenge_img' />
                          </li>
                          <li>
                            <label htmlFor="">챌린지 기간 </label>
                                <select name="" id="" onChange={(e)=>setChallengeTime(e.target.value)}>
                                  <option value="" selected>기간을 선택하세요</option>
                                  <option value="one-minutes">1분</option>
                                  <option value="week">일주일</option>
                                  <option value="one-month">1개월</option>
                                  <option value="three-month">3개월</option>
                                  <option value="six-month">6개월</option>
                                </select>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <div className='challenge-content-write'>
                        <p>내용 작성</p>
                        <textarea name="" id="" cols="70" rows="20" onChange={(e)=>setChallengeContent(e.target.value)}></textarea>
                        <br />
                        <button type='submit'>등록</button>
                      </div>
                    </li>
                  </ul>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
