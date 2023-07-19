// 고정수입 수정 모달

import React, { useState, useEffect } from 'react';
import { db } from '../../database/firebase';
import { doc, getDoc, updateDoc, deleteDoc, query, collection, where, getDocs } from 'firebase/firestore';

import CategoryBtn from '../../member_PCH/features/CategoryBtn';
import EditForm from '../styleComponent/DateDetail/EditForm';
import CloseBtn from '../styleComponent/DateDetail/CloseBtn';
import Moneyedit from '../styleComponent/DateDetail/Moneyedit';

export default function EditIncomeRepeat({ category, price, memo, closeSubModal, id, handleDataUpdate, incomeRepeatListId }) {
  // form의 입력 값 state
  const [date, setDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editPrice, setEditPrice] = useState(price);
  const [editMemo, setEditMemo] = useState(memo);
  const [selectedCategory, setSelectedCategory] = useState(category);
  

  /** 업데이트 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // money_income_repeat 컬렉션에서 해당 문서를 찾습니다.
    const incomeRepeatRef = doc(db, "money_income_repeat_list", incomeRepeatListId);
    const incomeRepeatSnap = await getDoc(incomeRepeatRef);

    if (incomeRepeatSnap.exists()) {
      // money_income_repeat 컬렉션의 해당 문서를 업데이트합니다.
      await updateDoc(incomeRepeatRef, {
        date: date,
        price: editPrice,
        category: selectedCategory,
        memo: editMemo,
      });

      // money_income_repeat_list 컬렉션에서 해당 docid와 일치하는 모든 문서를 찾아 업데이트합니다.
      const incomeRepeatListQuery = query(
        collection(db, "money_income_repeat"),
        where("docid", "==", incomeRepeatListId)
      );
      const incomeRepeatListSnapshot = await getDocs(incomeRepeatListQuery);

      incomeRepeatListSnapshot.forEach(async (incomeRepeatListDoc) => {
        // money_income_repeat_list 컬렉션의 해당 문서를 업데이트합니다.
        await updateDoc(incomeRepeatListDoc.ref, {
          price: editPrice,
          category: selectedCategory,
          memo: editMemo,
        });
      });
    }

    closeSubModal();
    handleDataUpdate();
  }; 
  
  // 고정수입 목록 클릭할 때마다 해당 내용으로 출력
  useEffect(() => {
    const fetchData = async () => {
    const incomeRepeatRef = doc(db, "money_income_repeat", id);
    const incomeRepeatSnap = await getDoc(incomeRepeatRef);
    if (incomeRepeatSnap.exists()) {
      const incomeRepeatData = incomeRepeatSnap.data();
        setSelectedCategory(incomeRepeatData.category); 
        setDate(incomeRepeatData.date ? incomeRepeatData.date.toDate() : null);
        setStartDate(incomeRepeatData.startDate ? incomeRepeatData.startDate.toDate() : null);
        setEndDate(incomeRepeatData.endDate ? incomeRepeatData.endDate.toDate() : null);
        setEditMemo(incomeRepeatData.memo);
        setEditPrice(incomeRepeatData.price);
        console.log(setDate);
      }
    };
    fetchData();
    }, [id]);    


  /** 변환 함수 */
  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear());
    const MM = String(newDate.getMonth() + 1).padStart(2, '0');
    const DD = String(newDate.getDate()).padStart(2, '0');
    const valueDate = `${YYYY}-${MM}-${DD}`;
    return valueDate;
  };


  /** form 입력 값 업데이트*/
  // 가격 업데이트
  const updatePrice = (e) => {
    setEditPrice(Number(e.target.value.replace(/[^0-9]/g, '')));
  }
  
  // 카테고리 업데이트
  const updateCategory = (e) => {
    setSelectedCategory(e.target.value);
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
    if (incomeRepeatListId != null) {
      // "money_income_repeat_list" 컬렉션에서 문서 삭제
      const querySnapshot = await getDocs(query(collection(db, "money_income_repeat"), where("docid", "==", incomeRepeatListId)));

          // 찾은 문서들을 순회하며 삭제
          querySnapshot.forEach(async (doc) => {
            // 문서 삭제
            await deleteDoc(doc.ref);
          });
          // "money_installments" 컬렉션에서 "installmentId"와 일치하는 문서 삭제
            await deleteDoc(doc(db, "money_income_repeat_list", incomeRepeatListId));
        } else{
          await deleteDoc(doc(db, "money_income_repeat", id));
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
        marginTop:"30px",
        marginRight:"190px",
        marginBottom: "30px",
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
          고정수입
        </h3>
      </div>
      <form className='edit_form' onSubmit = { handleSubmit }>
        <div className='input_content'>
          <div className='date'>
            <p>수입예정일</p>
            <div className='input_box'>
              <span>{ date && changeDate(date) }</span>
            </div>
            <div className='date_modal'>                
            </div>
          </div>
          <div className='period'>
            <p>기간</p>
            <div className='input_box'>
              <span >
                { startDate && changeDate(startDate)} ~ 
                { endDate ? changeDate(endDate) : '0000-00-00' }
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
          <div className='category'>
            <p>카테고리</p>
            <div className='category_box'>
              <CategoryBtn
                name = "반복수입"
                value = "월급"
                checked = { selectedCategory === "월급" }
                onChange = { updateCategory }
                selectedCategory ={selectedCategory}
              >
                월급
              </CategoryBtn>
              <CategoryBtn
                name = "반복수입"
                value = "용돈"
                checked = { selectedCategory === "용돈" }
                onChange = { updateCategory }
                selectedCategory ={selectedCategory}
              >
                용돈
              </CategoryBtn>
              <CategoryBtn
                name = "반복수입"
                value = "지원금"
                checked = { selectedCategory === "지원금" }
                onChange = { updateCategory }
                selectedCategory ={selectedCategory}
              >
                지원금
              </CategoryBtn>
              <CategoryBtn
                name = "반복수입"
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
);
}