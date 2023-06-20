import React, { useState } from 'react';

import Calendar from 'react-calendar';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase';

import { useSelector } from 'react-redux';

import CategoryBtn from '../features/CategoryBtn';

export default function InputExpenseComp({ handleSubmit }) {

  // uid 불러오기 위함
  const user = useSelector((state) => state.user.user);

  // 날짜 입력하는 캘린더 모달 state
  const [showCal, setShowCal] = useState(false);

  // form의 입력 값 state
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState("");
  const [payment, setPayment] =useState("현금");
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

  /*
  // installment 값 입력
  const onInputInstallment = (e) => {
    if(payment === "카드") {
      return setInstallment(e.target.value);
    } else {
      return setInstallment(1);
    };
  };
  */

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

  // submit 이벤트
  const inputExpense = async(e) => {
    e.preventDefault();

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
          // 할부 개월 수에 따라 money_expense 컬렉션에 문서 생성
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
              await addDoc(collection(db, "money_test"), {
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
    <div>
      <form action="" onSubmit={inputExpense}>

        <label>날짜</label>
        <div>
          <span>{date && changeDate(date)}</span>
          <button onClick={ onClickCal }>아이콘</button>
        </div>
        {
          showCal && (<Calendar onChange={ onClickDate } value={date}/>)
        }

        <label>금액</label>
        <div>
          <input 
            type="number" 
            min= "0"
            onChange={(e)=>{setPrice(Number(e.target.value))}}
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
          {
            payment && payment === "카드" && (
              /*
              <div>
                <label>할부</label>
                <input type="number" min="1" max="60" onChange={ onInputInstallment }/>
                <span>개월</span>
              </div>
              */
              <div>
                <label>할부</label>
                <select name="" id="" onChange={(e)=>setInstallment(e.target.value)}>
                  <option value="일시불" selected>
                    일시불
                  </option>
                  {
                    num.map((i)=>(
                      <option value={i} key={i}>{i}</option>
                    ))
                  }
                </select>
              </div>
            )
          }
        </div>

        <label>카테고리</label>
        <div>
          <CategoryBtn
            name="일반지출"
            value="카페"
            checked={selectedCategory === "카페"}
            onChange={onClickCategory}
          >
            카페
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="외식"
            checked={selectedCategory === "외식"} 
            onChange={onClickCategory}
          >
            외식
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="음주"
            checked={selectedCategory === "음주"} 
            onChange={onClickCategory}
          >
            음주
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="식료/잡화"
            checked={selectedCategory === "식료/잡화"} 
            onChange={onClickCategory}
          >
            식료/잡화
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="교통"
            checked={selectedCategory === "교통"} 
            onChange={onClickCategory}
          >
            교통
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="차량"
            checked={selectedCategory === "차량"} 
            onChange={onClickCategory}
          >
            차량
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="쇼핑"
            checked={selectedCategory === "쇼핑"} 
            onChange={onClickCategory}
          >
            쇼핑
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="문화생활"
            checked={selectedCategory === "문화생활"} 
            onChange={onClickCategory}
          >
            문화생활
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="경조사"
            checked={selectedCategory === "경조사"} 
            onChange={onClickCategory}
          >
            경조사
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="의료"
            checked={selectedCategory === "의료"} 
            onChange={onClickCategory}
          >
            의료
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="기타"
            checked={selectedCategory === "기타"} 
            onChange={onClickCategory}
          >
            기타
          </CategoryBtn>
        </div>

        <label>메모</label>
        <div>
          <textarea cols="30" rows="10" onChange={(e)=>setMemo(e.target.value)}/>
        </div>

        <input 
          type="submit" 
          value="입력" 
          disabled={!date || !price || !payment || !selectedCategory || (installment > 60) }
        />
      </form>
    </div>
  )
}
