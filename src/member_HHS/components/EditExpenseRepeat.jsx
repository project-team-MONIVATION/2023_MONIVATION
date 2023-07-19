// 고정지출 수정 모달

import React, { useState, useEffect } from 'react';
import { db } from '../../database/firebase';
import { doc, getDoc, updateDoc, deleteDoc, query, collection, where, getDocs } from 'firebase/firestore';
import Calendar from 'react-calendar';
import moment from 'moment';

import CategoryBtn from '../../member_PCH/features/CategoryBtn';
import EditForm from '../styleComponent/DateDetail/EditForm';
import { SelectDate, SelectPeriod } from '../../member_PCH/features/IconInModal';
import CloseBtn from '../styleComponent/DateDetail/CloseBtn';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import Moneyedit from '../styleComponent/DateDetail/Moneyedit';


export default function EditExpenseRepeat({ category, price, memo, closeSubModal, id, handleDataUpdate, expenseRepeatListId, payment }) {
    // form의 입력 값 state
    const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editPrice, setEditPrice] = useState(price);
    const [editPayment, setEditPayment] = useState(payment);
    const [installment, setInstallment] = useState();
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [editMemo, setEditMemo] = useState(memo);

    // 결제수단 입력하는 커스텀 select state
    const [paymentSelect, setPaymentSelect] = useState(false);

    // // 결제수단 입력하는 커스텀 select on/off
    // const onClickPaymentSelect = () => {
    //   setPaymentSelect((prev)=>!prev);
    // }
// 결제수단 입력하는 커스텀 select on/off
const onClickPaymentSelect = (value) => {
  setEditPayment(value);
  // setPaymentSelect((prev) => !prev);
  setPaymentSelect(false); // 선택한 값을 업데이트하고 select 박스를 닫습니다.

};
    


 /** 업데이트 */
 const handleSubmit = async (e) => {
  e.preventDefault();

  // money_expense_repeat 컬렉션에서 해당 문서를 찾습니다.
  const expenseRepeatRef = doc(db, "money_expense_repeat_list", expenseRepeatListId);
  const expenseRepeatSnap = await getDoc(expenseRepeatRef);

  if (expenseRepeatSnap.exists()) {
    // money_expense_repeat 컬렉션의 해당 문서를 업데이트합니다.
    await updateDoc(expenseRepeatRef, {
      date: date,
      price: editPrice,
      category: selectedCategory,
      memo: editMemo,
    });

    // money_expense_repeat_list 컬렉션에서 해당 docid와 일치하는 모든 문서를 찾아 업데이트합니다.
    const expenseRepeatListQuery = query(
      collection(db, "money_expense_repeat"),
      where("docid", "==", expenseRepeatListId)
    );
    const expenseRepeatListSnapshot = await getDocs(expenseRepeatListQuery);

    expenseRepeatListSnapshot.forEach(async (expenseRepeatListDoc) => {
        // money_expense_repeat_list 컬렉션의 해당 문서를 업데이트합니다.
        await updateDoc(expenseRepeatListDoc.ref, {
        price: editPrice,
        category: selectedCategory,
        memo: editMemo,
        payment: editPayment,
      });
    });
  }

  closeSubModal();
  handleDataUpdate();
}; 



    // 고정지출 목록 클릭할 때마다 해당 내용으로 출력
    useEffect(() => {
      const fetchData = async () => {
      const expenseRepeatRef = doc(db, "money_expense_repeat", id);
      const expenseRepeatSnap = await getDoc(expenseRepeatRef);
      if (expenseRepeatSnap.exists()) {
        const expenseRepeatData = expenseRepeatSnap.data();
          setSelectedCategory(expenseRepeatData.category);
          setDate(expenseRepeatData.date.toDate());
          setStartDate(expenseRepeatData.startDate.toDate());
          setEndDate(expenseRepeatData.endDate.toDate());
          setEditMemo(expenseRepeatData.memo);
          setEditPrice(expenseRepeatData.price);
          setEditPayment(expenseRepeatData.payment);
          setInstallment(expenseRepeatData.installment);
          console.log(setDate);
        }
      };

      fetchData();
    }, [id]);


  /** 변환 함수 */
    const changeDate = (newDate) => {
      const YYYY = String(newDate.getFullYear());
      const MM = String(newDate.getMonth()+1).padStart(2,"0");
      const DD = String(newDate.getDate()).padStart(2,"0");
      const valueDate = `${YYYY}-${MM}-${DD}`;
      return valueDate;
    };


    /** form 입력 값 업데이트 */
    // 가격 업데이트
    const updatePrice = (e) => {
      setEditPrice(Number(e.target.value.replace(/[^0-9]/g, '')));
    }
    


    // 카테고리 업데이트
    const updateCategory = (e) => {
      setSelectedCategory(e.target.value);
    };

    // // 결제수단 업데이트
    // const updatePayment = (e) => {
    //   setEditPayment(e.target.value);
    // }

// 결제수단 업데이트
// const updatePayment = (value) => {
//   setEditPayment(value);
// };
// // 결제수단 업데이트
// const updatePayment = (value) => {
//   setEditPayment(value);
// };
// 결제수단 업데이트
const updatePayment = (value) => {
  setEditPayment(value);
  setPaymentSelect(false); // 선택한 값을 업데이트하고 select 박스를 닫습니다.

};



    // 메모 업데이트
    const updateMemo = (e) => {
      setEditMemo(e.target.value);
    }


    /** 모달창 닫기/수정/삭제 */
    // 수정 모달창 닫기
    const handleClose = () => {
      closeSubModal();
    };  
    
    // 수정 버튼 클릭 시 확인 대화상자 표시
    const handleClickUpdate = () => {
      const confirmed = window.confirm("수정 하시겠습니까?");
      if (confirmed) {
        handleDataUpdate();
      }
    };



 // 해당 데이터 삭제
 const deleteMoney = async () => {
  const confirmed = window.confirm("삭제하시겠습니까?");
    if (confirmed) {

  if (expenseRepeatListId != null) {
    // "money_expens_repeat_list" 컬렉션에서 문서 삭제
    const querySnapshot = await getDocs(query(collection(db, "money_expense_repeat"), where("docid", "==", expenseRepeatListId)));
    
        // 찾은 문서들을 순회하며 삭제
        querySnapshot.forEach(async (doc) => {
          // 문서 삭제
          await deleteDoc(doc.ref);
        });
        // "money_installments" 컬렉션에서 "installmentId"와 일치하는 문서 삭제
          await deleteDoc(doc(db, "money_expense_repeat_list", expenseRepeatListId));
      } else{
        await deleteDoc(doc(db, "money_expense_repeat", id));
      }
        
      handleDataUpdate();
      closeSubModal();
    }
    };



    /** 금액 천자리 콤마(,) */
    const handleHyphen = (value) => {
      const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
      return formattedValue;
    };


    return (
      <EditForm>

        <CloseBtn
          type = "button"
          onClick = { handleClose }
        >
          X
        </CloseBtn>

        <div style={{
            marginRight:"190px",
            width: "150px",
            height: "50px",
            backgroundColor: "#735BF3",
            border: "0",
            borderRadius: "50px",

        }}>
          <h3 style={{  
            color: "#FFFFFF",
            fontFamily: 'Cafe24Ssurround',
            fontSize: "23px",
            paddingTop:"15px"
          }}>
            고정지출
          </h3>
        </div>

        <form className='edit_form' onSubmit = { handleSubmit } >
        
          <div className='input_content'>

            <div className='date'>
              <p>지출예정일</p>
              <div className='input_box'>
                <span>{ date && changeDate(date) }</span>
              </div>
            </div>

            <div className='period'>
              <p>기간</p>
              <div className='input_box'>
                <span>
                  { date && changeDate(date) } ~
                  { endDate ? changeDate(endDate) : "0000-00-00" }
                </span>
              </div>
            </div>

            <div className='price'>
              <p>금액</p>
              <div className='input_box'>
                <input 
                  className='input_price'
                  type = "text" 
                  value = { handleHyphen(editPrice) }
                  onChange = { updatePrice }
                  required
                />
                <span className='won'>₩</span>
              </div>
            </div>

            <div className='payment'>
              <p>결제수단</p>
              <div className='input_payment'>
                <div 
                className={
                  'select_box' +
                  (paymentSelect ? ' active' : '')
                }
              >
                <button
                  type='button'
                  // onClick={onClickPaymentSelect}
                  onClick={() => setPaymentSelect((prev) => !prev)}

                >
                    {/* {payment ? payment : "필수선택"} */}
                    {/* {editPayment ? editPayment : "필수선택"} */}
                    {editPayment ? editPayment : payment ? payment : "필수선택"}
                    
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className='icon_chevron'
                    style={{
                      transform: paymentSelect ? "scaleY(-1)" : "",
                      top: "16px",
                      right: "20px"
                    }}
                  />
                </button>
                <ul
                  className='option_list'
                >
                  <li
                    className='option_item'
                    onClick={() => updatePayment("현금")}

                  >현금</li>
                  <li
                    className='option_item'
                    onClick={() => updatePayment("카드")}

                  >카드</li>
                  <li
                    className='option_item'
                    onClick={() => updatePayment("이체")}

                  >이체</li>
                </ul>
              </div>
              </div>
            </div>



            <div className='category'>
              <p>카테고리</p>
              <div className='category_box'>
                <CategoryBtn
                  name = "반복지출"
                  value = "관리비"
                  checked = { selectedCategory === "관리비" } 
                  onChange = { updateCategory }
                  selectedCategory ={selectedCategory}
                >
                  관리비
                </CategoryBtn>
                <CategoryBtn
                  name = "반복지출"
                  value = "통신"
                  checked = { selectedCategory === "통신" } 
                  onChange = { updateCategory }
                  selectedCategory ={selectedCategory}
                >
                  통신
                </CategoryBtn>
                <CategoryBtn
                  name = "반복지출"
                  value = "교통"
                  checked = { selectedCategory === "교통" } 
                  onChange = { updateCategory }
                  selectedCategory ={selectedCategory}
                >
                  교통
                </CategoryBtn>
                <CategoryBtn
                  name = "반복지출"
                  value = "교육"
                  checked = { selectedCategory === "교육" } 
                  onChange = { updateCategory }
                  selectedCategory ={selectedCategory}
                >
                  교육
                </CategoryBtn>
                <CategoryBtn
                  name = "반복지출"
                  value = "보험"
                  checked = { selectedCategory === "보험" } 
                  onChange = { updateCategory }
                  selectedCategory ={selectedCategory}
                >
                  보험
                </CategoryBtn>
                <CategoryBtn
                  name = "반복지출"
                  value = "기타"
                  checked = { selectedCategory === "기타" } 
                  onChange = { updateCategory }
                  selectedCategory ={selectedCategory}
                >
                  기타
                </CategoryBtn>
              </div>
            </div>

            <div className='memo'>
              <p>메모</p>
              <div>
                <textarea
                  cols = "30"
                  rows = "10"
                  value = { editMemo }
                  onChange = { updateMemo } />
              </div>
            </div>
          </div>

          <Moneyedit>
            <input 
              type = "submit" 
              value = "수정"
              onClick = { handleClickUpdate }
              disabled = { !editPrice || !selectedCategory }
            />
            <button
              type = "button"
              onClick = { deleteMoney }
            >
              삭제
            </button>
          </Moneyedit>

        </form>
      </EditForm>
    )
}
