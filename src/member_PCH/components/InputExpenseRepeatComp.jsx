// 고정수입 입력 모달

import React, { useState } from 'react';

import Calendar from 'react-calendar';
import moment, { locale } from 'moment';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase';

import { useSelector } from 'react-redux';

import CategoryBtn from '../features/CategoryBtn';
import { SelectDate, SelectPeriod } from '../features/IconInModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function InputExpenseRepeatComp({ handleSubmit }) {

  // uid 불러오기 위함
  const user = useSelector((state) => state.user.user);

  // 날짜 입력하는 캘린더 모달 state
  const [showCal, setShowCal] = useState(false);

  // 기간 입력하는 모달 state
  const [showPeriod, setShowPeriod] = useState(false);

  // 반복주기 입력하는 커스텀 select state
  const [cycleSelect, setCycleSelect] = useState(false);

  // 결제수단 입력하는 커스텀 select state
  const [paymentSelect, setPaymentSelect] = useState(false);

  // form의 입력 값 state
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [memo, setMemo] = useState("");


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

  // 반복주기 입력하는 커스텀 select on/off
  const onClickCycleSelect = () => {
    setCycleSelect((prev)=>!prev);
  }

  // endDate 값 입력
  const onClickEndDate = (newDate) => {
    setEndDate(newDate);
  };

  // 금액 ,표시 ex1,000,000
  const handleHyphen = (event) => {
    const value = event.target.value.replace(/[^\d]/g, ''); // 숫자 이외의 문자 제거
    const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
    event.target.value = formattedValue;
  };

  // 결제수단 입력하는 커스텀 select on/off
  const onClickPaymentSelect = () => {
    setPaymentSelect((prev)=>!prev);
  }
  
  // selectedCategory 값 입력
  const onClickCategory = (e) => {
    const curChecked = e.target.value;
    setSelectedCategory(curChecked);
  };

  // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear());
    const MM = String(newDate.getMonth()+1).padStart(2,"0");
    const DD = String(newDate.getDate()).padStart(2,"0");
    const valueDate = `${YYYY}-${MM}-${DD}`;
    return valueDate;
  };



  // submit 이벤트
  const inputExpenseRepeat = async(e) => {
    e.preventDefault();
    const expenseData = {
      uid : user.uid,
      date : date,
      startDate : date,
      endDate : endDate,
      cycle : cycle,
      price : price,
      payment : payment,
      category : selectedCategory,
      memo : memo
    }
    const gap = expenseData.endDate - expenseData.startDate;
    const day = Math.floor((gap / (1000 * 60 * 60 * 24)) + 1);
    const week = Math.floor(gap / (1000 * 60 * 60 * 24 * 7));
    const month = Math.floor(gap / (1000 * 60 * 60 * 24 * 30));
    const year = Math.floor(gap / (1000 * 60 * 60 * 24 * 365));

    // * 2-1. cycle이 "매일"일 때 
    if ( cycle === "매일" ) {
      // console.log(expenseData.startDate, expenseData.endDate, cycle, day)
      // 1. expenseData를 firestore의 money_expense_repeat_list 컬렉션에 추가
      const docRef = await addDoc(collection(db, "money_expense_repeat_list"), expenseData);
      const expenseDocId = docRef.id;
      // 2. expenseData의 date를 분할하고 계산하여 money_expense_repeat 컬렉션에 추가하는 divisionExpense 함수 작성
      const divisionExpense = async () => {
        for (let i = 0; i < day; i++) {
          const expenseDate = new Date(expenseData.date);
          // i 를 이용하여 date 계산
          expenseDate.setDate(expenseDate.getDate() + i);
          const resultDate = expenseDate.toLocaleDateString('ko-KR');
          // money_expense_repeat 컬렉션에 추가
          await addDoc(collection(db, 'money_expense_repeat'), {
            docid : expenseDocId,
            uid : expenseData.uid,
            date : new Date(resultDate),
            startDate : expenseData.startDate,
            endDate : expenseData.endDate,
            price : expenseData.price,
            category : expenseData.category,
            memo : expenseData.memo
          })
        }
      };
      // 3. divisionExpense 함수 실행
      divisionExpense();
    }

    // * 2-2. cycle이 "매주"일 때
    else if ( cycle === "매주" ) {
      // console.log(expenseData.startDate, expenseData.endDate, cycle, week)
      // 1. expenseData를 firestore의 money_expense_repeat_list 컬렉션에 추가
      const docRef = await addDoc(collection(db, "money_expense_repeat_list"), expenseData);
      const expenseDocId = docRef.id;
      // 2. expenseData의 date를 분할하고 계산하여 money_expense_repeat 컬렉션에 추가하는 divisionExpense 함수 작성
      const divisionExpense = async () => {
        for (let i = 0; i <= week; i++) {
          const expenseDate = new Date(expenseData.date);
          // i 를 이용하여 date 계산
          expenseDate.setDate(expenseDate.getDate() + (i * 7));
          const resultDate = expenseDate.toLocaleDateString('ko-KR');
          // money_expense_repeat 컬렉션에 추가
          await addDoc(collection(db, 'money_expense_repeat'), {
            docid : expenseDocId,
            uid : expenseData.uid,
            date : new Date(resultDate),
            startDate : expenseData.startDate,
            endDate : expenseData.endDate,
            price : expenseData.price,
            category : expenseData.category,
            memo : expenseData.memo
          })
        }
      };
      // 3. divisionExpense 함수 실행
      divisionExpense();
    }

    // * 2-3. cycle이 "매월"일 때
    else if ( cycle === "매월" ) {
      //console.log(expenseData.startDate, expenseData.endDate, cycle, month)
      // 1. expenseData를 firestore의 money_expense_repeat_list 컬렉션에 추가
      const docRef = await addDoc(collection(db, "money_expense_repeat_list"), expenseData);
      const expenseDocId = docRef.id;
      // 2. expenseData의 date를 분할하고 계산하여 money_expense_repeat 컬렉션에 추가하는 divisionExpense 함수 작성
      const divisionExpense = async () => {
        for (let i = 0; i <= month; i++) {
          const expenseDate = new Date(expenseData.date);
          // i 를 이용하여 date 계산
          expenseDate.setMonth(expenseDate.getMonth() + i);
          const resultDate = expenseDate.toLocaleDateString('ko-KR');
          // money_expense_repeat 컬렉션에 추가
          await addDoc(collection(db, 'money_expense_repeat'), {
            docid : expenseDocId,
            uid : expenseData.uid,
            date : new Date(resultDate),
            startDate : expenseData.startDate,
            endDate : expenseData.endDate,
            price : expenseData.price,
            category : expenseData.category,
            memo : expenseData.memo
          })
        }
      };
      // 3. divisionExpense 함수 실행
      divisionExpense();
    }

    // * 2-4. cycle이 "매년"일 때
    else if (cycle === "매년") {
      //console.log(expenseData.startDate, expenseData.endDate, cycle, year)
      // 1. expenseData를 firestore의 money_expense_repeat_list 컬렉션에 추가
      const docRef = await addDoc(collection(db, "money_expense_repeat_list"), expenseData);
      const expenseDocId = docRef.id;
      // 2. expenseData의 date를 분할하고 계산하여 money_expense_repeat 컬렉션에 추가하는 divisionExpense 함수 작성
      const divisionExpense = async () => {
        for (let i = 0; i <= year; i++) {
          const expenseDate = new Date(expenseData.date);
          // i 를 이용하여 date 계산
          expenseDate.setFullYear(expenseDate.getFullYear() + i);
          const resultDate = expenseDate.toLocaleDateString('ko-KR');
          // money_expense_repeat 컬렉션에 추가
          await addDoc(collection(db, 'money_expense_repeat'), {
            docid : expenseDocId,
            uid : expenseData.uid,
            date : new Date(resultDate),
            startDate : expenseData.startDate,
            endDate : expenseData.endDate,
            price : expenseData.price,
            category : expenseData.category,
            memo : expenseData.memo
          })
        }
      };

      // 3. divisionExpense 함수 실행
      divisionExpense();
    }
    
    // 3단계
    // 입력 모달창을 닫기 위한 handleSubmit 함수를 호출
    handleSubmit();
  };


  return (
    <div id='input_form'>
      <form action="" onSubmit={inputExpenseRepeat}>

        <div className='input_content expense'>
          <div className='date'>
            <p>지출예정일</p>
            <div className='input_box'>
              <span>{date && changeDate(date)}</span>
              <button onClick={ onClickCal }>
                <SelectDate showCal={showCal}/>
              </button>
            </div>
            <div className='date_modal'>
              {
                showCal && (
                  <div className='input_date'>
                    <button 
                      type='button' 
                      onClick={()=>{setShowCal(false)}}
                      className='close_btn'
                    >
                      X
                    </button>
                    <Calendar 
                      formatDay={(locale, date) => moment(date).format('D')}
                      onChange={ onClickDate } 
                      value={date} 
                      className='modal_calendar'
                    />
                  </div>
                )
              }
            </div>
          </div>

          <div className='period'>
            <p>기간</p>
            <div className='input_box'>
              <span>{date && changeDate(date)} ~ {endDate ? changeDate(endDate) : "0000-00-00"} {cycle ? `/ ${cycle}` : null}</span>
              <button onClick={ onClickPeriod }>
                <SelectPeriod showPeriod={showPeriod}/>
              </button>
            </div>
            <div className='period_modal'>
              {
                showPeriod && (
                  <div className='input_period'>
                    <button 
                      type='button' 
                      onClick={()=>{setShowPeriod(false)}}
                      className='close_btn'
                    >
                      X
                    </button>
                    <div className='flex'>
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
                      <div className='input_cycle'>
                        <p>반복주기</p>
                        <div className='select'>
                          <div 
                          className={
                            'select_box' +
                            (cycleSelect? ' active' : '')
                          }>
                            <button 
                              type='button' 
                              className={ 
                                'select_lable' +
                                (cycle !== null ? " active" : "")
                              }
                              onClick={onClickCycleSelect}
                            >
                              {cycle === null ? "필수선택" : cycle}
                              <FontAwesomeIcon 
                                icon={faChevronDown} 
                                className='icon_chevron'
                                style={{
                                  transform: cycleSelect ? "scaleY(-1)" : "",
                                }}
                              />
                            </button>
                            <ul 
                              className='option_list'
                            >
                              <li 
                                className='ontion_item'
                                onClick={(e)=>{
                                  setCycle('매일')
                                  setCycleSelect((prev)=>!prev)
                                }}
                              >
                                매일
                              </li>
                              <li 
                                className='ontion_item'
                                onClick={(e)=>{
                                  setCycle('매주')
                                  setCycleSelect((prev)=>!prev);
                                }}
                              >
                                매주
                              </li>
                              <li 
                                className='ontion_item'
                                onClick={(e)=>{
                                  setCycle('매월')
                                  setCycleSelect((prev)=>!prev);
                                }}
                              >
                                매월
                              </li>
                              <li 
                                className='ontion_item'
                                onClick={(e)=>{
                                  setCycle('매년')
                                  setCycleSelect((prev)=>!prev);
                                }}
                              >
                                매년
                              </li>
                            </ul>
                          </div>
                        </div>
                        <button
                          type='button' 
                          onClick={()=>{setShowPeriod(false)}}
                          disabled={!endDate || !cycle}
                          className= {
                            'input_btn' +
                            (!endDate || !cycle ? " disabled" : "")
                          }
                        >
                          입력
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>

          <div className='price'>
            <p>금액</p>
            <div className='input_box'>
              <input 
                className='input_price'
                type="text"
                onInput={handleHyphen}
                onChange={(e) => {setPrice(Number(e.target.value.replace(/[^0-9]/g, '')))}}
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
                  onClick={onClickPaymentSelect}
                >
                  {payment ? payment : "필수선택"}
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
                    onClick={()=>{
                      setPayment('현금')
                      setPaymentSelect((prev)=>!prev)
                    }}
                  >현금</li>
                  <li
                    className='option_item'
                    onClick={()=>{
                      setPayment('카드')
                      setPaymentSelect((prev)=>!prev)
                    }}
                  >카드</li>
                  <li
                    className='option_item'
                    onClick={()=>{
                      setPayment('이체')
                      setPaymentSelect((prev)=>!prev)
                    }}
                  >이체</li>
                </ul>
              </div>
            </div>
          </div>

          <div className='category'>
            <p>카테고리</p>
            <div className='category_box'>
              <CategoryBtn
                name="반복지출"
                value="관리비"
                checked={selectedCategory === "관리비"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                관리비
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="통신"
                checked={selectedCategory === "통신"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                통신
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="교통"
                checked={selectedCategory === "교통"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                교통
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="교육"
                checked={selectedCategory === "교육"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                교육
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="보험"
                checked={selectedCategory === "보험"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                보험
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="기타"
                checked={selectedCategory === "기타"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                기타
              </CategoryBtn>
            </div>
          </div>

          <div className='memo'>
            <p>메모</p>
            <div>
              <textarea cols="30" rows="10" onChange={(e)=>{setMemo(e.target.value)}}/>
            </div>
          </div>
        </div>

        <input 
          className={
            'submit_btn' +
            ((!date || !endDate || !cycle || !price || !payment || !selectedCategory) ? " disabled" : "")
          }
          type="submit" 
          value="입력" 
          disabled={!date || !endDate || !cycle || !price || !payment || !selectedCategory}
        />
      </form>
    </div>
  )
}
