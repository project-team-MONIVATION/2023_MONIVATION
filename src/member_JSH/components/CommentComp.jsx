import React, { useEffect, useState, useRef } from 'react'
import { db,auth } from '../../database/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { doc, addDoc, getDocs, where, updateDoc, collection, Timestamp,whereField, getDoc, query } from 'firebase/firestore'
import { signInWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useParams } from 'react-router'
import '../css/scroll.css'
import { getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage";



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
    <div className='.scrollable-container'
    style={{display : 'inline-block', backgroundColor : "gray", width : "300px", height : "500px"}}>
        {
            commentArray && commentArray.map((array)=>(
                params.id == array.paramId ? 
                <li style={{listStyle : 'none'}}>
                    <img src={array.photo} alt="" 
                      style={{borderRadius : "20px", width : "30px"}}
                    />
                    <label htmlFor="">{array.commentId}</label>
                    <br />
                    <img src={array.commentImg ? array.commentImg : require('../img/noneImage.jpg')} alt="" 
                      style={{width : "200px", backgroundColor : "red"}}
                    />
                    <p>{array.content}</p>
                    <p>{array.paramId}</p>
                </li> : null
            ))
        }
        <form onSubmit={addUserComment} className='commentWrap'>
            <input type="text"
                placeholder='댓글 달기...'
                value={comment}
                onChange={onChange}
            />
            <input type="file" style={{ display: "none" }} ref={imageInput} 
            accept=".jpeg, .jpg, .png" onChange={onFileChanges}
            />
            <div style={{display : "inline-block", width : "50px", 
            background : "white", height : "20px", borderRadius : "10px",
            margin : "10px", border : "solid 1px black", cursor : "pointer"}}
            onClick={onCickImageUpload}>
              이미지
            </div>
            <button type='submit'>등록</button>
        </form>
    </div>
  )
}
