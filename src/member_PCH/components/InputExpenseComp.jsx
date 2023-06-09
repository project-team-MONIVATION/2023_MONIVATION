// 일반지출 입력 모달

import React, { useState } from 'react';

import Calendar from 'react-calendar';
import moment, { locale } from 'moment';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase';

import { useSelector } from 'react-redux';

import CategoryBtn from '../features/CategoryBtn';
import { SelectDate } from '../features/IconInModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function InputExpenseComp({ handleSubmit }) {

  // uid 불러오기 위함
  const user = useSelector((state) => state.user.user);

  // 날짜 입력하는 캘린더 모달 state
  const [showCal, setShowCal] = useState(false);

  // 결제수단 입력하는 커스텀 select state
  const [paymentSelect, setPaymentSelect] = useState(false);

  // 지불방법 입력하는 커스텀 select state
  const [installmentSelect, setInstallmentSelect] = useState(false);

  // form의 입력 값 state
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState("");
  const [payment, setPayment] =useState(null);
  const [installment, setInstallment] = useState("일시불");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [memo, setMemo] = useState("");

  // 할부 개월 수 select에서 사용할 배열
  const num = Array(58).fill().map((v,i)=> i+2);

  // 날짜 입력하는 캘린더 모달 on
  const onClickCal = (e) => {
    e.preventDefault();
    setShowCal(true);
  };

  // 날짜 입력하는 캘린더 모달에서 날짜 클릭 시 date 값 입력
  const onClickDate = (newDate) => {
    setDate(newDate);
    // console.log(newDate)
    setShowCal(false);
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
    setInstallmentSelect(false);
  }

  // 지불방법 입력하는 커스텀 select state on/off 
  const onClickInstallmentSelect = () => {
    setInstallmentSelect((prev)=>!prev);
    setPaymentSelect(false);
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
  const inputExpense = async(e) => {
    e.preventDefault();
    console.log("입력버튼")
    /** 결제수단이 "현금" 또는 "이체"이거나, 할부가 "일시불"일 때 
     * : 작성된 값을 firestore의 money_expense 컬렉션에 문서로 추가
    */
    if ( (payment !== "카드") || (installment === "일시불") ) {
      // console.log(payment, installment)
      await addDoc(collection(db, "money_expense"), {
        uid : user.uid,
        date : date,
        price : price,
        payment : payment,
        installment : installment,
        category : selectedCategory,
        memo : memo
      });
    } 

    /** 결제수단이 "카드"이면서 할부가 "일시불"이 아닐 때 
     * 1. form에 입력된 값을 그대로 money_installments 컬렉션에 문서로 추가
     * 2. price를 price/installment로 저장 후 installment 값 만큼 date의 month가 증가하는 새로운 문서를 여러개 만들고 그 문서들을 money_expense컬렉션에 추가
    */
    else if( (payment === "카드") && (installment !== "일시불") ) {
      // console.log ("할부 설정됨", installment);
      // 1단계
      const installmentData = {
        uid : user.uid,
        date : date,
        price : price,
        payment : payment,
        installment : installment,
        category: selectedCategory,
        memo: memo
      }
      await addDoc(collection(db, "money_installments"), installmentData)
        .then((docRef) => {
          // 2단계
          // 할부 개월 수만큼 date 값을 바꾸고 money_expense 컬렉션에 문서 반복 생성
          const installmentDocId = docRef.id;
          const divisionInstallment = async () => {
            for( let i=0; i<installmentData.installment; i++ ) {
              const installmentDate = installmentData.date
              // 할부 개월 수만큼 date 의 month 값 증가
              const expenseDate = () => {
                const YYYY = String(installmentDate.getFullYear());
                const MM = String(installmentDate.getMonth()+1+i).padStart(2,"0");
                const DD = String(installmentDate.getDate()).padStart(2,"0");
                return `${YYYY}-${MM}-${DD}`
              }
              // console.log(installmentDocId, expenseDate())
              await addDoc(collection(db, "money_expense"), {
                docid : installmentDocId,
                uid : installmentData.uid,
                date : new Date(expenseDate()),
                price : Math.round(installmentData.price / installmentData.installment),
                payment : installmentData.payment,
                installment : `할부 ${i+1}/${installmentData.installment}`,
                category : installmentData.category,
                memo : installmentData.memo
              })
            }
          }
          divisionInstallment()
        })
        .catch((error) => {
          console.error('2단계 수행 중 오류 발생', error);
        })
    }
    
    // 입력 모달창을 닫기 위한 handleSubmit 함수를 호출
    handleSubmit();
  };

  return (
    <div id='input_form'>
      <form action="" onSubmit={inputExpense}>

        <div className='input_content expense'>
          <div className='date'>
            <p>날짜</p>
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
            <div className='input'>
              <div className='input_payment'>
                <div 
                  className={
                    'select_box' +
                    (paymentSelect ? ' active' : '') +
                    (payment === "카드" ? ' card' : '')
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
                        setInstallmentSelect(false)
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
                        setInstallmentSelect(false)
                      }}
                    >이체</li>
                  </ul>
                </div>
              </div>
              {
                payment && payment === "카드" && (
                  <div className='input_installment'>
                    <div 
                      className={
                        'select_box' +
                        (installmentSelect ? ' active' : '')
                      }
                    >
                      <button
                        type='button'
                        onClick={onClickInstallmentSelect}
                      >
                        <p>
                          {installment
                          ? (installment === '일시불' ? installment : `${installment}개월`)
                          : "필수선택"}
                          <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className='icon_chevron'
                            style={{
                              transform: installmentSelect ? "scaleY(-1)" : "",
                              top: "16px",
                              right: "20px"
                            }}
                          />
                        </p>
                      </button>
                      <ul className='option_list'>
                        <li 
                          className='option_item'
                          onClick={()=>{
                            setInstallment('일시불')
                            setInstallmentSelect((prev)=>!prev)
                          }}
                        >일시불</li>
                        {
                          num.map((i)=>(
                            <li 
                              key={i}
                              className='option_item'
                              onClick={()=>{
                                setInstallment(i)
                                setInstallmentSelect((prev)=>!prev)
                              }}
                            >
                              {i}개월
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                )
              }
            </div>
          </div>

          <div className='category'>
            <p>카테고리</p>
            <div className='category_box'>
              <CategoryBtn
                name="일반지출"
                value="카페"
                checked={selectedCategory === "카페"}
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                카페
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
                value="외식"
                checked={selectedCategory === "외식"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                외식
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
                value="음주"
                checked={selectedCategory === "음주"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                음주
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
                value="교통"
                checked={selectedCategory === "교통"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                교통
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
                value="차량"
                checked={selectedCategory === "차량"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                차량
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
                value="쇼핑"
                checked={selectedCategory === "쇼핑"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                쇼핑
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
                value="경조사"
                checked={selectedCategory === "경조사"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                경조사
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
                value="의료"
                checked={selectedCategory === "의료"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                의료
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
                value="문화생활"
                checked={selectedCategory === "문화생활"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                문화생활
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
                value="식료/잡화"
                checked={selectedCategory === "식료/잡화"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                식료/잡화
              </CategoryBtn>
              <CategoryBtn
                name="일반지출"
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
              <textarea cols="30" rows="10" onChange={(e)=>setMemo(e.target.value)}/>
            </div>
          </div>
        </div>

        <input 
          className={
            'submit_btn' +
            ((!date || !price || !payment || !selectedCategory || !installment) ? " disabled" : "")
          }
          type="submit" 
          value="입력" 
          disabled={!date || !price || !payment || !selectedCategory || !installment }
        />
      </form>
    </div>
  )
}
