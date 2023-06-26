// 고정지출 수정 모달

import React, { useState, useEffect } from 'react';
import { db } from '../../database/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import Calendar from 'react-calendar';
import moment from 'moment';

import CategoryBtn from '../../member_PCH/features/CategoryBtn';

export default function EditExpenseRepeat({ category, price, memo, closeSubModal, id, handleDataUpdate }) {
    // form의 입력 값 state
    const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [cycle, setCycle] = useState("매일");
    const [editPrice, setEditPrice] = useState(price);
    const [payment, setPayment] = useState("현금");
    const [installment, setInstallment] = useState();
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [editMemo, setEditMemo] = useState(memo);
    // 캘린더 모달 state
    const [showCal, setShowCal] = useState(false); // 날짜 입력하는 캘린더 모달 state
    const [showPeriod, setShowPeriod] = useState(false); // 기간 입력하는 모달 state
    // 기간 입력하는 모달의 캘린더 모달 state
    const [showStartCal, setShowStartCal] = useState(true);
    const [showEndCal, setShowEndCal] = useState(false);

    /** 파이어스토어에 업데이트 넘겨줌 */

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

  /////>????????
  // 기간 입력하는 모달의 startDate 입력하는 캘린더 모달 on 
  const onClickStartBtn = (e) => {
    setShowStartCal(true);
    setShowEndCal(false);
  };

  // startDate 값 입력
  const onClickStartDate = (newDate) => {
    setStartDate(newDate);
    onClickEndBtn()
  };

  // 기간 입력하는 모달의 endDate 입력하는 캘린더 모달 on
  const onClickEndBtn = (e) => {
    setShowEndCal(true);
    setShowStartCal(false);
  };

  // endDate 값 입력
  const onClickEndDate = (newDate) => {
    if (startDate >= newDate) {
      return alert('종료일은 시작일보다 작거나 같을 수 없습니다');
    } else {
      return setEndDate(newDate);
    };
  };


  
  // installment 값 입력
  const onInputInstallment = (e) => {
    if(payment === "카드") {
      return setInstallment(e.target.value);
    } else {
      return setInstallment(1);
    };
  };

  // selectedCategory 값 입력
  const onClickCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear());
    const MM = String(newDate.getMonth()+1).padStart(2,"0");
    const DD = String(newDate.getDate()).padStart(2,"0");
    const valueDate = `${YYYY}-${MM}-${DD}`;
    return valueDate;
  };


    // 파이어스토어에 업데이트
 const handleSubmit = async (e) => {
  e.preventDefault();

      // 파이어스토어에서 해당 문서를 가져옴
  const expenseRepeatRef = doc(db, "money_expense_repeat", id);
  const expenseRepeatSnap = await getDoc(expenseRepeatRef);
  if (expenseRepeatSnap.exists()) {
    await updateDoc(expenseRepeatRef, {
      category: selectedCategory,
      cycle: cycle,
      date: date,
      startDate: date,
      endDate: endDate,
      installment: payment === "카드" ? installment : null, // 결제 방법이 "카드"가 아닌 다른 방법으로 변경되면 installment값을 null로 초기화
      memo: editMemo,
      payment: payment,
      price: editPrice,
    });
  }

  closeSubModal();

  // 데이터 업데이트 후 상위 컴포넌트의 fetchData 함수 호출
  handleDataUpdate();
};


// 
useEffect(() => {
  const fetchData = async () => {
  const expenseRepeatRef = doc(db, "money_expense_repeat", id);
  const expenseRepeatSnap = await getDoc(expenseRepeatRef);
  if (expenseRepeatSnap.exists()) {
    const expenseRepeatData = expenseRepeatSnap.data();
      setSelectedCategory(expenseRepeatData.category);
      setCycle(expenseRepeatData.cycle);
      setDate(expenseRepeatData.date.toDate());
      setStartDate(expenseRepeatData.startDate.toDate());
      setEndDate(expenseRepeatData.endDate.toDate());
      setEditMemo(expenseRepeatData.memo);
      setEditPrice(expenseRepeatData.price);
      setPayment(expenseRepeatData.payment);
      // if (expenseRepeatData.payment === "카드") {
      //   setInstallment(expenseRepeatData.installment.toString());
      // } else {
      //   setInstallment("1");
      // }
      setInstallment(expenseRepeatData.installment);
      console.log(setDate);
    }
  };

  fetchData();
}, [id]);

  const deleteMoney = async() => {
    await deleteDoc(doc(db, "money_expense_repeat", id));
    handleDataUpdate();
    closeSubModal();
  }

  // installment 값 입력
  // const onInputInstallment = (e) => {
  //   if (payment === "카드") {
  //     setInstallment(e.target.value);
  //   } else {
  //     setInstallment(null);
  //   }
  // };
  
  // 금액 ,표시 ex1,000,000
  const handleHyphen = (value) => {
    const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
    return formattedValue;
  };

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

        <label>지출예정일</label>
        <div>
          <span>{date && changeDate(date)}</span>
          <button onClick={ onClickCal }>아이콘</button>
        </div>
        {
          showCal && (
            <div>
              <button type='button' onClick={()=>{setShowCal(false)}}>X</button>
              <Calendar onChange={ onClickDate } value={date}/>
            </div>
          )
        }

        <label>기간</label>
        <div>
          <span>{date && changeDate(date)} ~ {endDate ? changeDate(endDate) : "0000-00-00"} {cycle}</span>
          <button onClick={ onClickPeriod }>아이콘</button>
        </div>
        {
          showPeriod && (
            <div>
              <button
              type='button'
              onClick={()=>{setShowPeriod(false)}}
              >
                X
              </button>
              
                  <div>
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
                <label>반복주기</label><br />
                <select name="cycle" id="" onChange={(e)=>{setCycle(e.target.value)}}>
                <option value="value" selected disabled>
                              필수선택
                            </option>
                  <option value="매일">매일</option>
                  <option value="매주">매주</option>
                  <option value="매월">매월</option>
                  <option value="매년">매년</option>
                </select>
              </div>
              <button type='button' onClick={()=>{setShowPeriod(false)}}>
                입력
              </button>
            </div>
          )
        }

        <label>금액</label>
        <div>
          <input 
            type="text" 
            value={handleHyphen(editPrice)}
            onChange={(e)=>{setEditPrice(Number(e.target.value.replace(/[^0-9]/g, '')))}}
            required
          />
          <span>₩</span>
        </div>

        <label htmlFor="">결제수단</label>
        <div>
          <select 
            name="payment" 
            id="" 
            value={payment}
            onChange={(e)=>{setPayment(e.target.value)}}
          >
            <option value="현금">현금</option>
            <option value="카드">카드</option>
            <option value="이체">이체</option>
          </select>
        </div>

        <label>카테고리</label>
        <div>
          <CategoryBtn
            name="반복지출"
            value="관리비"
            checked={selectedCategory === "관리비"} 
            onChange={onClickCategory}
          >
            관리비
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
            value="통신"
            checked={selectedCategory === "통신"} 
            onChange={onClickCategory}
          >
            통신
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
            value="교통"
            checked={selectedCategory === "교통"} 
            onChange={onClickCategory}
          >
            교통
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
            value="교육"
            checked={selectedCategory === "교육"} 
            onChange={onClickCategory}
          >
            교육
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
            value="보험"
            checked={selectedCategory === "보험"} 
            onChange={onClickCategory}
          >
            보험
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
            value="기타"
            checked={selectedCategory === "기타"} 
            onChange={onClickCategory}
          >
            기타
          </CategoryBtn>
        </div>

        <label>메모</label>
        <div>
          <textarea cols="30" rows="10" value={editMemo} onChange={(e) => setEditMemo(e.target.value)}/>
        </div>

        <input 
          type="submit" 
          value="입력" 
          disabled={!date || !startDate || !cycle || !editPrice || !selectedCategory}
        />
        <button type='button' onClick={deleteMoney}>삭제</button>

      </form>
    </div>
  )
}
