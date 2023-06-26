// 고정수입 수정 모달

import React, { useState, useEffect } from 'react';
import { db } from '../../database/firebase';
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux';
import CategoryBtn from '../../member_PCH/features/CategoryBtn';
import { updateDoc, getDoc, doc, deleteDoc } from 'firebase/firestore';

import moment, { locale } from 'moment';


export default function EditIncomeRepeat({ category, price, memo, closeSubModal, id, handleDataUpdate })  {
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
  //const [date, setDate] = useState(new Date());
  const [date, setDate] = useState(null);
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
        startDate: date,
        endDate: endDate,
        date: date,
        cycle: cycle,
      });
    }

    closeSubModal();
    // 데이터 업데이트 후 상위 컴포넌트의 fetchData 함수 호출
    handleDataUpdate();
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
        setStartDate(incomeData.date.toDate());
        setEndDate(incomeData.endDate.toDate());
        setEditMemo(incomeData.memo);
        setEditPrice(incomeData.price);
        console.log(setDate);
      }
    };

    fetchData();
  }, [id]);

  const deleteMoney = async() => {
    await deleteDoc(doc(db, "money_income_repeat", id));
    handleDataUpdate();
    closeSubModal();
  }

  // 금액 ,표시 ex1,000,000
const handleHyphen = (value) => {
  const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
  return formattedValue;
};



// 작업중잉
const [dates, setDates] = useState([new Date()]);
useEffect(() => {
  const calculateDates = () => {
    if (cycle === '매일') {
      const diffInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const newDates = [];
      for (let i = 0; i <= diffInDays; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + i);
        newDates.push(newDate);
      }
      setDates(newDates);
    } else if (cycle === '매주') {
      const diffInWeeks = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
      const newDates = [];
      for (let i = 0; i <= diffInWeeks; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + i * 7);
        newDates.push(newDate);
      }
      setDates(newDates);
    } else if (cycle === '매월') {
      const newDates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        newDates.push(currentDate);
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, startDate.getDate());
      }
      setDates(newDates);
    } else if (cycle === '매년') {
      const newDates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        newDates.push(currentDate);
        currentDate = new Date(currentDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
      }
      setDates(newDates);
    }
  };

  calculateDates();
}, [cycle, startDate, endDate]);





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
            {date && changeDate(date)} ~
            {endDate ? changeDate(endDate) : '0000-00-00'} {cycle}
          </span>
          <button onClick={onClickPeriod}>아이콘</button>
        </div>
        {showPeriod && (
          <div>
            <button type="button" onClick={() => setShowPeriod(false)}>
              X
            </button>
            <div className='input_endDate'>
                        <p>종료일</p>
                        <Calendar 
                          formatDay={(locale, date) => moment(date).format('D')}
                          onChange={ onClickEndDate } 
                          value={endDate} 
                          minDate={date}
                          className='modal_calendar period'
                        />
                      </div>
            <div>
              <label>반복주기</label>
              <br />
              <select name="cycle" id="" onChange={(e) => setCycle(e.target.value)}>
              <option value="value" selected disabled>필수선택</option>
                
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
          <input type="text"
          value={handleHyphen(editPrice)}
          onChange={(e) => setEditPrice(Number(e.target.value.replace(/[^0-9]/g, '')))}
          required />
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
        <button type='button' onClick={deleteMoney}>삭제</button>
      </form>
    </div>
  );
}
