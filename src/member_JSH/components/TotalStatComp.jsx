import React from 'react'
import { useState, useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate  } from 'react-router-dom';
import SavingList from '../../member_LJC/pages/SavingList';

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, query, where, Timestamp, } from 'firebase/firestore';
import {db} from '../../database/firebase'
import Modal from 'react-modal';


export default function TotalStatComp() {
  // 일반 수입 리덕스
  const implist = useSelector((state)=>(state.imp));
  //const [inputs, setInputs] = useState();
  // 일반 지출 리덕스
  const exlist = useSelector((state)=>(state.ex));
  // 저금 리덕스ㅇddd
  const savelist = useSelector((state)=>(state.save));



  
  // 저금 리스트 모달창
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [activeModal, setActiveModal] = useState(null);
    const openModal = (modalId) => {
      setActiveModal(modalId);
    };


  // 총 저금액 불러오기
  const [totalamount, setTotalamount] = useState([]);

  const user = useSelector((state) => state.user.user);

  const [savingList , setSavingList] = useState([]);

  useEffect(() => {
      getSavingData();
  }, [user]);


  // 데이터 불러오기
  // 저금액 총액 구하기
  const getSavingData = async () => {
      try {
          const fmCollectionRef = collection(db, "money_saving");
          const fmQuery = query(fmCollectionRef, where('user', '==', user.uid));
          const fmQuerySnapshot = await getDocs(fmQuery);

          if (fmQuerySnapshot.empty) {
              navigate('/account/login');
          } else {
              let dataArray = [];
              fmQuerySnapshot.forEach((doc) => {
                  dataArray.push({
                  ...doc.data(),
                  id: doc.id,
              });
              });
              let total = 0;

              for (let i = 0; i < dataArray.length; i++) {
                let money = dataArray[i].amount;
                const number = parseInt(money.replace(/,/g, ''), 10);
                total += number;
                
              }
              const totalprice = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              setSavingList(totalprice);
          }
      } catch (error) {
          console.log("실패했습니다", error);
      }
  };

  


  




  return (
    <div style={{height : "538px", 
    display : 'inline-block', 
    backgroundColor : 'lightgray', marginTop : '3.8rem',
    border : 'solid 1px black', marginRight : "0.6rem",
    minWidth : '150px'}}>
        <table>
          <tbody>
            <th>이번 달 총액</th>
            <tr>
              <td>반복 수입</td>
            </tr>
            <tr>
              <td>0,000,000원</td>
            </tr>
            <tr>
              <td>일반 수입</td>
            </tr>
            <tr>
              <td>0,000,000원</td>
            </tr>
            <tr>
              <td>반복 지출</td>
            </tr>
            <tr>
              <td>- 0,000,000원</td>
            </tr>
            <tr>
              <td>일반 지출</td>
            </tr>
            <tr>
              <td>- 0,000,000원</td>
            </tr>

            {/* 총 저금액 시작*/}
              <div
                onClick={()=>{
                  setModalIsOpen(true);
                  openModal(3);
                }}
              >
                <tr>
                  <td>현재 총 저금액</td>
                </tr>
                <tr>
                  <td>-{savingList}원</td>
                </tr>
              </div>
              {activeModal === 3 && (
                <Modal isOpen={modalIsOpen}>
                  <div>
                  <button onClick={()=>setModalIsOpen(false)}>x</button>
                  <SavingList setModalIsOpen={setModalIsOpen}/>
                  </div>
                </Modal>
              )}
          {/* 총 저금액 끝 */}
            <tr>
              <td>현재 총 자산</td>
            </tr>
            <tr>
              <td>0,000,000원</td>
            </tr>
          </tbody>
        </table>
    </div>
  )
}
