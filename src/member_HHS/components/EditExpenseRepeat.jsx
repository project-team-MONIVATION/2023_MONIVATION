// 고정지출 수정 모달

import React, { useState, useEffect } from 'react';
import { db } from '../../database/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import Calendar from 'react-calendar';
import moment from 'moment';

import CategoryBtn from '../../member_PCH/features/CategoryBtn';
import EditForm from '../styleComponent/DateDetail/EditForm';
import { SelectDate, SelectPeriod } from '../../member_PCH/features/IconInModal';
import CloseBtn from '../styleComponent/DateDetail/CloseBtn';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import Moneyedit from '../styleComponent/DateDetail/Moneyedit';


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

    // 반복주기 입력하는 커스텀 select state
    const [cycleSelect, setCycleSelect] = useState(false);

    // 결제수단 입력하는 커스텀 select state
    const [paymentSelect, setPaymentSelect] = useState(false);

    // 결제수단 입력하는 커스텀 select on/off
    const onClickPaymentSelect = () => {
      setPaymentSelect((prev)=>!prev);
    }

    /** 파이어스토어에 업데이트 넘겨줌 */
    const handleSubmit = async (e) => {
      e.preventDefault();

      // 파이어스토어에서 해당 문서를 가져옴
      const expenseRepeatRef = doc(db, "money_expense_repeat", id);
      const expenseRepeatSnap = await getDoc(expenseRepeatRef);
      if (expenseRepeatSnap.exists()) {
        await updateDoc(expenseRepeatRef, {
          date: date,
          startDate: date,
          category: selectedCategory,
          cycle: cycle,
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

    // 고정지출 목록 클릭할 때마다 해당 내용으로 출력
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
          setInstallment(expenseRepeatData.installment);
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

    // 기간 입력하는 모달 on
    const onClickPeriod = (e) => {
      e.preventDefault();
      setShowPeriod(true);
    };

    // endDate 값 입력
    const onClickEndDate = (newDate) => {
      setEndDate(newDate);
    };

    // 반복주기 입력하는 커스텀 select on/off
    const onClickCycleSelect = () => {
      setCycleSelect((prev)=>!prev);
    }

    // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
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
    

    // 반복주기 업데이트
    const updateCycle = (e) => {
      setCycle(e.target.value);
    }

    // 카테고리 업데이트
    const updateCategory = (e) => {
      setSelectedCategory(e.target.value);
    };

    // 결제수단 업데이트
    const updatePayment = (e) => {
      setPayment(e.target.value);
    }

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
        await deleteDoc(doc(db, "money_expense_repeat", id));
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
                <button onClick = { onClickCal }>
                  <SelectDate showCal={showCal}/>
                </button>
              </div>
              <div className='date_modal'>
                {
                  showCal && (
                    <div className='input_date'>
                      <CloseBtn
                        type = "button"
                        onClick = { () => setShowCal(false) }
                      >
                        X
                      </CloseBtn>
                      <Calendar
                        formatDay={(locale, date) => moment(date).format('D')}
                        value = { date }
                        onChange = { onClickDate }
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
                <span>
                  { date && changeDate(date) } ~
                  { endDate ? changeDate(endDate) : "0000-00-00" } {cycle}
                </span>
                <button onClick = { onClickPeriod }>
                  <SelectPeriod showPeriod={showPeriod}/>
                </button>
              </div>
              <div className='period_modal'>
                {
                  showPeriod && (
                    <div className='input_period'>
                      <CloseBtn
                        type = "button"
                        onClick = { () => { setShowPeriod(false) } }
                      >
                        X
                      </CloseBtn>                      
                    <div className='flex'>
                      <div className='input_endDate'>
                        <p>종료일</p>
                        <Calendar 
                          formatDay = { (locale, date) => moment(date).format('D') }
                          onChange = { onClickEndDate } 
                          value = { endDate } 
                          minDate = { date }
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
                          type = "button"
                          onClick = { () => setShowPeriod(false) }
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
              disabled = { !date || !startDate || !cycle || !editPrice || !selectedCategory }
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
