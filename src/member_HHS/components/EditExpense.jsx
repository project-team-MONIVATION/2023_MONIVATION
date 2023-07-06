// 지출 수정 모달

import React, { useState, useEffect } from 'react';
import { db } from '../../database/firebase';
import { doc, getDoc, getDocs, updateDoc, deleteDoc, collection, query, where } from 'firebase/firestore';
import Calendar from 'react-calendar';

import CategoryBtn from '../../member_PCH/features/CategoryBtn';

import EditForm from '../styleComponent/DateDetail/EditForm';
import CloseBtn from '../styleComponent/DateDetail/CloseBtn';
import { SelectDate } from '../../member_PCH/features/IconInModal';
import moment from 'moment';

import Moneyedit from '../styleComponent/DateDetail/Moneyedit';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';



export default function EditExpense({ category, price, memo, closeSubModal, installmentId, id, handleDataUpdate }) {
    // form의 입력 값 state
    const [date, setDate] = useState(new Date());
    const [payment, setPayment] = useState("현금");
    const [installment, setInstallment] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [editPrice, setEditPrice] = useState(price);
    const [editMemo, setEditMemo] = useState(memo);
    // 캘린더 모달 state
    const [showCal, setShowCal] = useState(false); // 날짜 입력하는 캘린더 모달 state


    /** 파이어스토어에 업데이트 넘겨줌 */
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // 파이어스토어에서 해당 문서를 가져옴
      const expenseRef = doc(db, "money_expense", id);
      const expenseSnap = await getDoc(expenseRef);
      if (expenseSnap.exists()) {
        await updateDoc(expenseRef, {
          date: date,
          price: editPrice,
          payment: payment,
          installment: installment,
          category: selectedCategory,
          memo: editMemo,
        });
      }
    
      closeSubModal();
      // 데이터 업데이트 후 상위 컴포넌트의 fetchData 함수 호출
      handleDataUpdate();
    };
    
    // 지출 목록 클릭할 때마다 해당 내용으로 출력
    useEffect(() => {
      const fetchData = async () => {
      const expenseRef = doc(db, "money_expense", id);
      const expenseSnap = await getDoc(expenseRef);
      if (expenseSnap.exists()) {
        const expenseData = expenseSnap.data();
          setDate(expenseData.date.toDate());
          setEditPrice(expenseData.price);
          setSelectedCategory(expenseData.category);
          setPayment(expenseData.payment);
          setInstallment(expenseData.installment);
          setEditMemo(expenseData.memo);
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

    // 결제수단 업데이트
    const updatePayment = (e) => {
      setPayment(e.target.value);
    }

    // 카테고리 업데이트
    const updateCategory = (e) => {
      setSelectedCategory(e.target.value);
    };
    
    // 메모 업데이트
    const updateMemo = (e) => {
      setEditMemo(e.target.value);
    }
    

    /** 할부 관련 */
    const isDisabled = payment === "카드" && installment !== "일시불";
    const isEditable = payment !== "카드" || (payment === "카드" && installment === "일시불");
    
    // installment 값 입력
    const onInputInstallment = (e) => {
      if (payment === "카드") {
        return setInstallment(e.target.value);
      } else {
        return setInstallment(1);
      }
    };

    // 결제수단 옵션 생성
    let paymentOptions = [];
    if (payment === "카드") {
      paymentOptions = [{ label: "카드", value: "카드" }];
    } else {
      paymentOptions = [
        { label: "현금", value: "현금" },
        { label: "카드", value: "카드" },
        { label: "이체", value: "이체" },
      ];
    }

    useEffect(() => {
      // 컴포넌트가 처음 실행될 때 실행되는 로직

      // 선택된 결제수단과 할부 정보를 가져옴
      const selectedPaymentMethod = payment;
      const selectedInstallment = installment;

      // 조건에 따라 옵션을 설정
      if (selectedPaymentMethod === '카드' && selectedInstallment !== '일시불') {
        setPayment("카드");
        setInstallment("");
      } else {
        setPayment("카드");
        setInstallment("일시불");
      }
    }, []);


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
    const deleteMoney = async () => {
      if(installmentId != null) {
        // "money_expense" 컬렉션에서 "docid" 필드가 "installmentId"와 일치하는 문서를 찾기 위한 쿼리 생성
        const querySnapshot = await getDocs(query(collection(db, "money_expense"), where("docid", "==", installmentId)));
        
        // 찾은 문서들을 순회하며 삭제
        querySnapshot.forEach(async (doc) => {
          // 문서 삭제
          await deleteDoc(doc.ref);
        });
        // "money_installments" 컬렉션에서 "installmentId"와 일치하는 문서 삭제
          await deleteDoc(doc(db, "money_installments", installmentId));
      } else{
        await deleteDoc(doc(db, "money_expense", id));
      }
        
      handleDataUpdate();
      closeSubModal();
    };


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
          marginTop:"40px",
            marginRight:"190px",
            marginBottom: "50px",
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
            일반지출
          </h3>
        </div>

        <form className='edit_form' onSubmit = { handleSubmit }>

          <div className='input_content'>
            <div className='date'>
              <p>날짜</p>
              <div className='input_box'>
                <span> { date && changeDate(date) }</span>
                <button onClick = { onClickCal }>
                {/* 달력 */}
                  <SelectDate showCal={showCal}/>
                </button>
              </div>
              <div className='date_modal'>
                {
                  showCal && (
                    <div className='input_date'>
                      <button
                        type = "button"
                        onClick = { () => setShowCal(false) }
                        className='close_btn'
                      >
                        X
                      </button>
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

            <div className='price'>
              <p>금액</p>
              <div className='input_box'>
                <input 
                  className='input_price'
                  type = "text" 
                  value = { handleHyphen(editPrice) }
                  onChange = { updatePrice }
                  required
                  disabled = { isDisabled }
                />
                <span className='won'>₩</span>
              </div>
            </div>



          <div className='payment'>

            <p>결제수단</p>
            <div className='input'>
            <select
              value = { payment }
              onChange = { updatePayment }
              disabled = { payment === "카드" && installment !== "일시불" }
            >
              <option value = "현금">현금</option>
              <option value = "카드">카드</option>
              <option value = "이체">이체</option>
            </select>

            {payment === "카드" && installment === "일시불" && (
              <div>
                <select
                  className = "installment"
                  name = "installment"
                  onChange = { onInputInstallment }
                  value = { installment }
                >
                  <option value = "일시불">일시불</option>
                </select>
              </div>
            )}
          </div>
          </div>





            <div className='category'>
              <p>카테고리</p>
          <div className='category_box'>
            <CategoryBtn
              name = "일반지출"
              value = "카페"
              checked = { selectedCategory === "카페" }
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              ☕ 카페
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "외식"
              checked = { selectedCategory === "외식" }
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              🍜 외식
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "음주"
              checked = { selectedCategory === "음주" } 
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              🍻 음주
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "식료/잡화"
              checked = { selectedCategory === "식료/잡화" }
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              🛒 식료/잡화
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "교통"
              checked = { selectedCategory === "교통" } 
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              🚉 교통
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "차량"
              checked = { selectedCategory === "차량" } 
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              🚗 차량
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "쇼핑"
              checked = { selectedCategory === "쇼핑" } 
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              🛍 쇼핑
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "문화생활"
              checked = { selectedCategory === "문화생활" } 
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              🎨 문화생활
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "경조사"
              checked = { selectedCategory === "경조사" } 
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              🩹 경조사
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "의료"
              checked = { selectedCategory === "의료" } 
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              🤧 의료
            </CategoryBtn>
            <CategoryBtn
              name = "일반지출"
              value = "기타"
              checked = { selectedCategory === "기타" } 
              onChange = { updateCategory }
              selectedCategory ={selectedCategory}

            >
              💡 기타
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
              onChange = { updateMemo }
              disabled = { isDisabled }
            />
              </div>
            </div>
          </div>

          <div style={{display:"flex"}}>
            <input 
              type = "submit" 
              value = "수정" 
              onClick = { handleClickUpdate }
              disabled = { !date || !editPrice || !selectedCategory || !(payment !== "카드" || (payment === "카드" && installment === "일시불")) }
              style = { { display: isEditable ? 'block' : 'none' ,
            
              
                marginRight: "10px",
                backgroundColor:   "  rgb(115, 91, 243)",
                border: "none",
                borderRadius: "50px",
                width:" 150px",
                height: "50px",
                color: "#fff",
                fontSize: "23px",
                fontFamily: 'Cafe24Ssurround'}}
              
            />

            <button
              type = "button"
              onClick = { deleteMoney }
              style={{
                marginRight: "10px",
                backgroundColor:   "  rgb(115, 91, 243)",
                border: "none",
                borderRadius: "50px",
                width:" 150px",
                height: "50px",
                color: "#fff",
                fontSize: "23px",
                fontFamily: 'Cafe24Ssurround'}}
            >
              삭제
            </button>
          </div>


        </form>
      </EditForm>
    )
}