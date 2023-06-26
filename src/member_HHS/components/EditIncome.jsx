// 수입 수정 모달

import React, { useState, useEffect } from 'react';
import { db } from '../../database/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import Calendar from 'react-calendar';

import CategoryBtn from '../../member_PCH/features/CategoryBtn';

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
      <div
        style = { {
          position: 'fixed',
          top: '100px',
          right: '90px',
          display: 'flex',
          width: '600px',
          height: '700px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '5px',
          border: 'solid 2px black'
        } }
      >
        <form action = "" onSubmit = { handleSubmit }>
          <button
            type = "button"
            onClick = { handleClose }
          >
            닫기
          </button>
<br />
          <label>날짜</label>
          <div>
            <span>{ date && changeDate(date) }</span>
            <button
              onClick = { onClickCal }
            >
              달력
            </button>
          </div>
          {
            showCal && (
              <div>
              <button
                type = "button"
                onClick = { () => setShowCal(false) }
              >
                X
              </button>
              <Calendar
                value = { date }
                onChange = { onClickDate }
              />
            </div>
          )}

          <label>금액</label>
          <div>
            <input
              type = "text"
              value = { handleHyphen(editPrice) }
              onChange = { (e) => setEditPrice(Number(e.target.value.replace(/[^0-9]/g, ''))) } // 숫자 이외의 문자 제거
              required
            />
            <span>₩</span>
          </div>

          <label>카테고리</label>
          <div>
            <CategoryBtn
              name = "일반수입"
              value = "보너스"
              checked = { selectedCategory === '보너스' }
              onChange = { updateCategory }
            >
              보너스
            </CategoryBtn>
            <CategoryBtn
              name = "일반수입"
              value = "용돈"
              checked = { selectedCategory === '용돈' }
              onChange = { updateCategory }
            >
              용돈
            </CategoryBtn>
            <CategoryBtn
              name = "일반수입"
              value = "재테크"
              checked = {selectedCategory === '재테크'}
              onChange = { updateCategory }
            >
              재테크
            </CategoryBtn>
            <CategoryBtn
              name = "일반수입"
              value = "기타"
              checked = {selectedCategory === '기타'}
              onChange = { updateCategory }
            >
              기타
            </CategoryBtn>
          </div>

          <label>메모</label>
          <div>
            <textarea
              cols = "30"
              rows = "10"
              value = { editMemo }
              onChange = { updateMemo }
            />
          </div>

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
        </form>
      </div>

    );
}
