// 수입 수정 모달


import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebase';
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux';
import CategoryBtn from '../../member_PCH/features/CategoryBtn';
import { updateDoc, getDoc, doc, deleteDoc } from 'firebase/firestore';

export default function EditIncome({ category, price, memo, closeSubModal, id, handleDataUpdate }) {
  const user = useSelector((state) => state.user.user);

  const [showCal, setShowCal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedMemo, setEditedMemo] = useState(memo);

//

// 금액 ,표시 ex1,000,000
const handleHyphen = (value) => {
  const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
  return formattedValue;
};


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

  // 파이어스토어에 업데이트
  const handleSubmit = async (e) => {
    e.preventDefault();

    const incomeRef = doc(db, "money_income", id);
    const incomeSnap = await getDoc(incomeRef);
    if (incomeSnap.exists()) {
      await updateDoc(incomeRef, {
        category: selectedCategory,
        price: editedPrice,
        memo: editedMemo,
        date : date,
      });
    }

    closeSubModal();
    
    // 데이터 업데이트 후 상위 컴포넌트의 fetchData 함수 호출
    handleDataUpdate();
  };

  // 수입 저장 목록 클릭 시 마다 모달 변함
  useEffect(() => {
    const fetchData = async () => {
    const incomeRef = doc(db, "money_income", id);
    const incomeSnap = await getDoc(incomeRef);
    if (incomeSnap.exists()) {
      const incomeData = incomeSnap.data();
        setSelectedCategory(incomeData.category);
        setDate(incomeData.date.toDate()); // date 변수의 초기값 설정
        setEditedMemo(incomeData.memo);
        setEditedPrice(incomeData.price);
        console.log(setDate);
      }
    };

    fetchData();
  }, [id]);

  const deleteMoney = async() => {
    await deleteDoc(doc(db, "money_income", id));
    handleDataUpdate();
    closeSubModal();
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '100px',
        right: '90px',
        display: 'flex',
        width: '600px',
        height: '700px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        border: 'solid 2px black '
      }}
    >
      <form action="" onSubmit={ handleSubmit }>

        <label>날짜</label>
        <div>
          <span>{date && changeDate(date)}</span>
          <button onClick={ onClickCal }>아이콘</button>
        </div>
        {
          showCal && (
            <div>
            <button type="button" onClick={() => setShowCal(false)}>
              X
            </button>
            <Calendar onChange={onClickDate} value={date} />
          </div>
        )}

        <label>금액</label>
        <div>
          <input
            type="text"
            value={handleHyphen(editedPrice)} // handleHyphen 함수를 적용하여 값을 형식화합니다.
            onChange={(e) => setEditedPrice(Number(e.target.value.replace(/[^0-9]/g, '')))} // 숫자 이외의 문자 제거
            required
          />
          <span>₩</span>
        </div>

        <label>카테고리</label>
        <div>
          <CategoryBtn
            name="일반수입"
            value="보너스"
            checked={selectedCategory === '보너스'}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            보너스
          </CategoryBtn>
          <CategoryBtn
            name="일반수입"
            value="용돈"
            checked={selectedCategory === '용돈'}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            용돈
          </CategoryBtn>
          <CategoryBtn
            name="일반수입"
            value="재테크"
            checked={selectedCategory === '재테크'}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            재테크
          </CategoryBtn>
          <CategoryBtn
            name="일반수입"
            value="기타"
            checked={selectedCategory === '기타'}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            기타
          </CategoryBtn>
        </div>

        <label>메모</label>
        <div>
          <textarea cols="30" rows="10" value={editedMemo} onChange={(e) => setEditedMemo(e.target.value)} />
        </div>

        <input type="submit" value="입력" disabled={!date || !editedPrice || !selectedCategory} />
        <button type='button' onClick={deleteMoney}>삭제</button>
      </form>
    </div>
  );
}
