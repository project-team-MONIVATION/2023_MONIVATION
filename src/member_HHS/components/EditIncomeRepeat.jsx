import React, { useState, useEffect } from 'react';
import { db } from '../../database/firebase';
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux';
import CategoryBtn from '../../member_PCH/features/CategoryBtn';
import { updateDoc, getDoc, doc } from 'firebase/firestore';

export default function EditIncomeRepeat({ category, price, memo, closeSubModal, id })  {
  // uid 불러오기
  const user = useSelector((state) => state.user.user);

  // 날짜 입력하는 캘린더 모달 state
  const [showCal, setShowCal] = useState(false);

  // 기간 입력하는 모달 state
  const [showPeriod, setShowPeriod] = useState(false);
  
  // 기간 입력하는 모달의 캘린더 모달 state
  const [showStartCal, setShowStartCal] = useState(true);
  const [showEndCal, setShowEndCal] = useState(false);
  
  // form의 입력 값 state
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [cycle, setCycle] = useState("매일");
  const [editPrice, setEditPrice] = useState(price);
  const [editMemo, setEditMemo] = useState(memo);
  const [selectedCategory, setSelectedCategory] = useState(category);

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

  // 기간 입력하는 모달 on
  const onClickPeriod = (e) => {
    e.preventDefault();
    setShowPeriod(true);
  };

  // 시작일
  const onClickStartDate = (newDate) => {
    setStartDate(newDate);
    onClickEndBtn();
  };

  // 기간 입력하는 모달의 endDate 입력하는 캘린더 모달 on
  const onClickEndBtn = (e) => {
    setShowEndCal(true);
    setShowStartCal(false);
  };

  const onClickStartBtn = (e) => {
    setShowStartCal(true);
    setShowEndCal(false);
  };

  // 종료일
  const onClickEndDate = (newDate) => {
    setEndDate(newDate);
  };
  

  const onClickCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear());
    const MM = String(newDate.getMonth() + 1).padStart(2, '0');
    const DD = String(newDate.getDate()).padStart(2, '0');
    const valueDate = `${YYYY}-${MM}-${DD}`;
    return valueDate;
  };

  // 업데이트 넘겨주는 버튼
  const handleSubmit = async (e) => {
    e.preventDefault();

    const incomeRef = doc(db, "money_income_repeat", id);
    const incomeSnap = await getDoc(incomeRef);
    if (incomeSnap.exists()) {
      await updateDoc(incomeRef, {
        category: selectedCategory,
        price: editPrice,
        memo: editMemo,
        startDate: startDate,
        endDate: endDate,
        cycle: cycle,
      });
    }

    closeSubModal();
  };


  // 
  useEffect(() => {
    const fetchData = async () => {
    const incomeRef = doc(db, "money_income_repeat", id);
    const incomeSnap = await getDoc(incomeRef);
    if (incomeSnap.exists()) {
      const incomeData = incomeSnap.data();
        setSelectedCategory(incomeData.category);
        setCycle(incomeData.cycle);
        setDate(incomeData.date.toDate()); // date 변수의 초기값 설정
        setStartDate(incomeData.startDate.toDate());
        setEndDate(incomeData.endDate.toDate());
        setEditMemo(incomeData.memo);
        setEditPrice(incomeData.price);
        console.log(setDate);
      }
    };

    fetchData();
  }, [id]);


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
      <form action="" onSubmit={handleSubmit}>
        <label>수입예정일</label>
        <div>
          <span>{date && changeDate(date)}</span>
          <button onClick={onClickCal}>아이콘</button>
        </div>
        {showCal && (
          <div>
            <button type="button" onClick={() => setShowCal(false)}>
              X
            </button>
            <Calendar onChange={onClickDate} value={date} />
          </div>
        )}

        <label>기간</label>
        <div>
          <span>
            {startDate && changeDate(startDate)} ~{' '}
            {endDate ? changeDate(endDate) : '0000-00-00'} {cycle}
          </span>
          <button onClick={onClickPeriod}>아이콘</button>
        </div>
        {showPeriod && (
          <div>
            <button type="button" onClick={() => setShowPeriod(false)}>
              X
            </button>
            <div>
              <button type="button" onClick={onClickStartBtn}>
                시작일
              </button>
              <button type="button" onClick={onClickEndBtn}>
                종료일
              </button>
              {showStartCal && (
                <Calendar onChange={onClickStartDate} value={startDate} required />
              )}
              {showEndCal && <Calendar onChange={onClickEndDate} value={endDate} />}
            </div>
            <div>
              <label>반복주기</label>
              <br />
              <select name="cycle" id="" onChange={(e) => setCycle(e.target.value)}>
                <option value="매일">매일</option>
                <option value="매주">매주</option>
                <option value="매월">매월</option>
                <option value="매년">매년</option>
              </select>
            </div>
            <button type="button" onClick={() => setShowPeriod(false)}>
              입력
            </button>
          </div>
        )}

        <label>금액</label>
        <div>
          <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} required />
          <span>₩</span>
        </div>

        <label>카테고리</label>
        <div>
          <CategoryBtn
            name="반복수입"
            value="월급"
            checked={selectedCategory === "월급"}
            onChange={onClickCategory}
          >
            월급
          </CategoryBtn>
          <CategoryBtn
            name="반복수입"
            value="용돈"
            checked={selectedCategory === "용돈"}
            onChange={onClickCategory}
          >
            용돈
          </CategoryBtn>
          <CategoryBtn
            name="반복수입"
            value="지원금"
            checked={selectedCategory === "지원금"}
            onChange={onClickCategory}
          >
            지원금
          </CategoryBtn>
          <CategoryBtn
            name="반복수입"
            value="기타"
            checked={selectedCategory === "기타"}
            onChange={onClickCategory}
          >
            기타
          </CategoryBtn>
        </div>

        <label>메모</label>
        <div>
          <textarea cols="30" rows="10" value={editMemo} onChange={(e) => setEditMemo(e.target.value)} />
        </div>

        <input
          type="submit"
          value="입력"
          disabled={!date || !startDate || !cycle || !editPrice || !selectedCategory}
        />
      </form>
    </div>
  );
}
