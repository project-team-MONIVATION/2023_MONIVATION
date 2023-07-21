// 수입 수정 모달

import React, { useState, useEffect } from 'react';
import { db } from '../../database/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import Calendar from 'react-calendar';

import CategoryBtn from '../../member_PCH/features/CategoryBtn';
import EditForm from '../styleComponent/DateDetail/EditForm';
import CloseBtn from '../styleComponent/DateDetail/CloseBtn';
import { SelectDate } from '../../member_PCH/features/IconInModal';
import moment from 'moment';

import Moneyedit from '../styleComponent/DateDetail/Moneyedit';
import CloseBtnEdit from '../styleComponent/DateDetail/CloseBtnEdit';


export default function EditIncome({ category, price, memo, closeSubModal, id, handleDataUpdate }) {  
  // form의 입력 값 state
  const [date, setDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [editPrice, setEditPrice] = useState(price);
  const [editMemo, setEditMemo] = useState(memo);
  // 캘린더 모달 state
  const [showCal, setShowCal] = useState(false); // 날짜 입력하는 캘린더 모달 state

  /** 파이어스토어에 업데이트 넘겨줌 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const incomeRef = doc(db, "money_income", id);
    const incomeSnap = await getDoc(incomeRef);
    if (incomeSnap.exists()) {
      await updateDoc(incomeRef, {
        date : date,
        price: editPrice,
        category: selectedCategory,
        memo: editMemo,
      });
    }

    closeSubModal();
    
    // 데이터 업데이트 후 상위 컴포넌트의 fetchData 함수 호출
    handleDataUpdate();
  };

  // 수입 목록 클릭할 때마다 해당 내용으로 출력
  useEffect(() => {
    const fetchData = async () => {
    const incomeRef = doc(db, "money_income", id);
    const incomeSnap = await getDoc(incomeRef);
    if (incomeSnap.exists()) {
      const incomeData = incomeSnap.data();
        setSelectedCategory(incomeData.category);
        setDate(incomeData.date.toDate());
        setEditMemo(incomeData.memo);
        setEditPrice(incomeData.price);
        console.log(setDate);
      }
    };

    fetchData();
  }, [id]);


  /** 캘린더 모달 관리 */
  // 날짜 입력하는 캘린더 모달 on
  const onClickCal = (e) => {
    e.preventDefault();
    setShowCal(true);
  };

  // 날짜 입력하는 캘린더 모달에서 날짜 클릭 시 date 값 입력
  const onClickDate = (newDate) => {
    setDate(newDate);
    setShowCal(false);
  };

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
    setEditPrice(Number(e.target.value.replace(/[^0-9]/g, ''))); // 숫자 이외의 문자 제거
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
  const deleteMoney = async() => {
    const confirmed = window.confirm("삭제하시겠습니까?");
    if (confirmed) {
      await deleteDoc(doc(db, "money_income", id));
      handleDataUpdate();
      closeSubModal();
    }
  }


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
        marginTop:"40px",
          marginRight:"190px",
          marginBottom: "50px",
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
          일반수입
        </h3>
      </div>

      <form className = 'edit_form' onSubmit = { handleSubmit }>
        <div className = 'input_content'>
          <div className = 'date'>
            <p>날짜</p>
            <div className = 'input_box'>
              <span>{ date && changeDate(date) }</span>
              <button onClick = { onClickCal }>
                <SelectDate showCal = { showCal }/>
              </button>
            </div>
            <div className = 'date_modal'>
              {
                showCal && (
                  <div className = 'input_date'>
                    <CloseBtnEdit
                      type = "button"
                      onClick = { () => setShowCal(false) }
                      className = 'close_btn'
                    >
                      X
                    </CloseBtnEdit>
                    <Calendar
                      formatDay = {(locale, date) => moment(date).format('D')}
                      value = { date }
                      onChange = { onClickDate }
                      className = 'modal_calendar'
                    />
                  </div>
                )
              }
            </div>
          </div>
          <div className = 'price'>
            <p>금액</p>
            <div className = 'input_box'>
              <input
                className = 'input_price'
                type = "text"
                value = { handleHyphen(editPrice) }
                onChange = { updatePrice }
                required
              />
              <span className = 'won'>₩</span>
            </div>
          </div>
          <div className = 'category'>
            <p>카테고리</p>
            <div className = 'category_box'>
              <CategoryBtn
                name = "일반수입"
                value = "보너스"
                checked = { selectedCategory === '보너스' }
                onChange = { updateCategory }
                selectedCategory = { selectedCategory }
              >
                보너스
              </CategoryBtn>
              <CategoryBtn
                name = "일반수입"
                value = "용돈"
                checked = { selectedCategory === '용돈' }
                onChange = { updateCategory }
                selectedCategory = { selectedCategory }
              >
                용돈
              </CategoryBtn>
              <CategoryBtn
                name = "일반수입"
                value = "재테크"
                checked = {selectedCategory === '재테크'}
                onChange = { updateCategory }
                selectedCategory = { selectedCategory }
              >
                재테크
              </CategoryBtn>
              <CategoryBtn
                name = "일반수입"
                value = "기타"
                checked = {selectedCategory === '기타'}
                onChange = { updateCategory }
                selectedCategory = { selectedCategory }
              >
                기타
              </CategoryBtn>
            </div>
          </div>
          <div>
            <p>메모</p>
            <div>
              <textarea
                cols = "30"
                rows = "10"
                value = { editMemo }
                onChange = { updateMemo }
              />
            </div>
          </div>
        </div>
        <Moneyedit>
          <input
            type = "submit"
            value = "수정"
            onClick = { handleClickUpdate }
            disabled = { !date || !editPrice || !selectedCategory }
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
