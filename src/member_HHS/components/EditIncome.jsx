import React, { useState } from 'react';
import { db } from '../../database/firebase';
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux';
import CategoryBtn from '../../member_PCH/features/CategoryBtn';
import { updateDoc, getDoc, doc } from 'firebase/firestore';

export default function EditIncome({ category, price, memo, closeSubModal, id, modaltype }) {
  const user = useSelector((state) => state.user.user);

  const [showCal, setShowCal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedMemo, setEditedMemo] = useState(memo);

  const onClickCal = (e) => {
    e.preventDefault();
    setShowCal(true);
  };

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

  // 업데이트
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 파이어스토어에서 해당 문서를 가져옴
    const incomeRef = doc(db, "money_income", id);
    const incomeSnap = await getDoc(incomeRef);
    if (incomeSnap.exists()) {
      await updateDoc(incomeRef, {
        category: selectedCategory,
        price: editedPrice,
        memo: editedMemo,
      });
    }

    closeSubModal();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        right: '90px',
        display: 'flex',
        width: '400px',
        height: '700px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
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
            type="number"
            min="0"
            value={editedPrice}
            onChange={(e) => setEditedPrice(Number(e.target.value))}
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
      </form>
    </div>
  );
}