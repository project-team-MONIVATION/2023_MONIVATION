import React, { useEffect, useState, useRef } from 'react'
import { db,auth } from '../../database/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { doc, addDoc, getDocs, where, updateDoc, collection, Timestamp,whereField, getDoc, query } from 'firebase/firestore'
import { signInWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useParams } from 'react-router'
import '../css/scroll.css'
import { getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage";
import {} from '@fortawesome/fontawesome-svg-core'
import {faImage} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



// 댓글창 컴포넌트
export default function CommentComp() {
    const params = useParams();
    const user = useSelector((state)=>state.user.user);
    const [comment, setComment] = useState('');
    const [commentArray, setCommentArray] = useState([]);
    const [commentImg, setCommentImg] = useState(null);
    // useRef를 이용해 input태그에 접근한다.
    const imageInput = useRef();

    const onSubmit = (event) => {
        event.preventDefault();
        if(comment === ''){
            return;
        }
        setCommentArray((commentValueList)=>[comment, ...commentValueList]);
    }
    const onChange = (event) => {
        setComment(event.target.value);
        console.log(user);
    }

    const onFileChanges = (event) => {
      console.log(event.target.files);
      const file = event.target.files[0];
      setCommentImg(URL.createObjectURL(file));
    };
    // 버튼클릭시 input태그에 클릭이벤트를 걸어준다. 
    const onCickImageUpload = () => {
      imageInput.current.click();
    };

    const addUserComment = async(e) =>{
        e.preventDefault();
        await addDoc(collection(db, "user_comments"), {
          commentId : user.nickname,
          content : comment,
          paramId : params.id,
          uid : user.uid,
          photo : user.photo,
          writeTime : new Date(),
          commentImg : commentImg
        })
        setCommentArray((commentValueList)=>[comment, ...commentValueList]);
        setComment("");
      }

      useEffect(()=>{
        window.scrollTo({top: 0});
        // 컬렉션의 값을 가져와서 사용
        const getComments = async()=>{
          const q = query(collection(db, "user_comments"));
          const querySnapshot = await getDocs(q);
          let dataArray = [];
          querySnapshot.forEach((doc)=>{
            let data = {
              id : doc.id,
              uid : doc.data().uid,
              content : doc.data().content,
              paramId : doc.data().paramId,
              photo : doc.data().photo,
              commentId : doc.data().commentId,
              commentImg : doc.data().commentImg
            }
            dataArray.push(data)
            //console.log(doc.id, " => ", doc.data());
          });
          setCommentArray(dataArray)
        }
        getComments();
      },[])

  return (
    <div id='comment-comp'>
      <div className='comment-scroll'>
          
          {
              commentArray && commentArray.map((array)=>(
                  params.id == array.paramId ? 
                  <li style={{listStyle : 'none'}}>
                      <ul>
                        <li style={{display:'flex', alignItems:'center'}}>
                          <img src={array.photo} alt="" 
                          style={{borderRadius : "20px", width : "30px", margin:"20px 15px 10px 30px"}}
                          />
                          <label htmlFor="" style={{marginTop : "20px"}}>{array.commentId}</label>
                        </li>
                        <li>
                          <img src={array.commentImg ? array.commentImg : require('../img/noneImage.jpg')} alt="" 
                          style={{width : "350px", backgroundColor : "red"}}
                          />
                          </li>
                        <li>
                          <span>{array.content}</span>
                        </li>
                        
                      </ul>
                  </li> : null
              ))
          }
          
          
      </div>
      <div className='commentWrap'>
            <form onSubmit={addUserComment} >
              <input type="file" style={{ display: "none" }} ref={imageInput} 
                accept=".jpeg, .jpg, .png" onChange={onFileChanges}
                />
                <div style={{display : "inline-block"}}
                onClick={onCickImageUpload} className='comment-img'>
                  <FontAwesomeIcon icon={faImage} />
                </div>
                <input type="text"
                    placeholder='댓글 달기...'
                    value={comment}
                    onChange={onChange}
                    className='comment-input'
                />
                <button type='submit'>등록</button>
            </form>
          </div>
    </div>
  )
}
