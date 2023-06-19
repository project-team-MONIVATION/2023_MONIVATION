import React, { useEffect, useState } from 'react'
import { db,auth } from '../../database/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { doc, addDoc, query, getDocs, where, updateDoc, collection, Timestamp,whereField, getDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useParams } from 'react-router'
import '../css/scroll.css'


// 댓글창 컴포넌트
export default function CommentComp() {
    const params = useParams();
    const user = useSelector((state)=>state.user.user);
    const [comment, setComment] = useState('');
    const [commentArray, setCommentArray] = useState([]);
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

    const addUserComment = async(e) =>{
        e.preventDefault();
        await addDoc(collection(db, "user_comments"), {
          commentId : user.nickname,
          content : comment,
          paramId : params.id,
          uid : user.uid,
          photo : user.photo,
          writeTime : new Date(),
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
                    <img src='' alt="" />
                    <label htmlFor="">{array.commentId}</label>
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
            <button type='submit'>등록</button>
        </form>
    </div>
  )
}
