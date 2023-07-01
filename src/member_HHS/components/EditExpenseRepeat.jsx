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
      if (startDate >= newDate) {
        return alert('종료일은 시작일보다 작거나 같을 수 없습니다');
      } else {
        return setEndDate(newDate);
      };
    };

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
      <div
        style = { {
          position: 'fixed',
          width: '580px',
          height: '850px',
          transform: "translateY(-50%)",
          top: '50%',
          right: '90px',
          display: 'flex',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '5px',
          border: 'solid 2px black'
        } }
      >
        <form action="" onSubmit = { handleSubmit } >
        <button
          type = "button"
          onClick = { handleClose }
        >
          닫기
        </button>

          <label>지출예정일</label>
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
                  onClick = { () => { setShowCal(false)} }
                >
                  X 
                </button>
                <Calendar
                  value = { date }
                  onChange = { onClickDate }
                />
              </div>
            )
          }

          <label>기간</label>
          <div>
            <span>
              { date && changeDate(date) } ~
                { endDate ? changeDate(endDate) : "0000-00-00" } {cycle}
            </span>
            <button
              onClick = { onClickPeriod }
            >
              달력
            </button>
          </div>
          {
            showPeriod && (
              <div>
                <button
                type = "button"
                onClick = { () => { setShowPeriod(false) } }
                >
                  X
                </button>
              <div>
                <p>종료일</p>
                <Calendar 
                  formatDay = { (locale, date) => moment(date).format('D') }
                  onChange = { onClickEndDate } 
                  value = { endDate } 
                  minDate = { date }
                />
                </div>

              <div>
                <label>반복주기</label>
                <select
                  name = "cycle"
                  onChange = { updateCycle }
                >
                  <option value = "value" selected disabled>필수선택</option>
                  <option value = "매일">매일</option>
                  <option value = "매주">매주</option>
                  <option value = "매월">매월</option>
                  <option value = "매년">매년</option>
                </select>
              </div>
              <button
                type = "button"
                onClick = { () => { setShowPeriod(false) } }
              >
                입력
              </button>
            </div>
          )
        }

        <label>금액</label>
        <div>
          <input 
            type = "text" 
            value = { handleHyphen(editPrice) }
            onChange = { updatePrice }
            required
          />
          <span>₩</span>
        </div>

        <label htmlFor="">결제수단</label>
        <div>
          <select 
            name = "payment" 
            value = { payment }
            onChange = { updatePayment }
          >
            <option value = "현금">현금</option>
            <option value = "카드">카드</option>
            <option value = "이체">이체</option>
          </select>
        </div>

        <label>카테고리</label>
        <div>
          <CategoryBtn
            name = "반복지출"
            value = "관리비"
            checked = { selectedCategory === "관리비" } 
            onChange = { updateCategory }
          >
            관리비
          </CategoryBtn>
          <CategoryBtn
            name = "반복지출"
            value = "통신"
            checked = { selectedCategory === "통신" } 
            onChange = { updateCategory }
          >
            통신
          </CategoryBtn>
          <CategoryBtn
            name = "반복지출"
            value = "교통"
            checked = { selectedCategory === "교통" } 
            onChange = { updateCategory }
          >
            교통
          </CategoryBtn>
          <CategoryBtn
            name = "반복지출"
            value = "교육"
            checked = { selectedCategory === "교육" } 
            onChange = { updateCategory }
          >
            교육
          </CategoryBtn>
          <CategoryBtn
            name = "반복지출"
            value = "보험"
            checked = { selectedCategory === "보험" } 
            onChange = { updateCategory }
          >
            보험
          </CategoryBtn>
          <CategoryBtn
            name = "반복지출"
            value = "기타"
            checked = { selectedCategory === "기타" } 
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
            onChange = { updateMemo } />
        </div>

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

      </form>
    </div>
  )
}
