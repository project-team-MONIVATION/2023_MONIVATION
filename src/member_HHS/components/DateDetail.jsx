// 수정모달창

import React, { useState, useEffect } from 'react'
import { db } from '../../database/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux'

import Calendar from 'react-calendar'; // react-calendar 라이브러리

import EditIncome from './EditIncome';
import EditIncomeRepeat from './EditIncomeRepeat'
import EditExpense from './EditExpense';
import EditExpenseRepeat from './EditExpenseRepeat'
import ModalWrap from '../styleComponent/DateDetail/ModalWrap';
import CloseBtn from '../styleComponent/DateDetail/CloseBtn';
import DateDetailBox from '../styleComponent/DateDetail/DateDetailBox';
import SearchDate from '../styleComponent/DateDetail/SearchDate';
import Accordion from '../styleComponent/DateDetail/Accordion';


export default function DateDetail({ closeModal2, selectedDate }) {
    // state에서 user.user로 가져옴(현재 사용자 정보)
    const user = useSelector((state) => state.user.user);

    // Firestore에서 가져온 데이터 저장/관리(수입, 고정수입, 지출, 고정지출)
    const [income, setIncome] = useState([]);
    const [incomeRepeat, setIncomeRepeat] = useState([]);
    const [expense, setExpense] = useState([]);
    const [expenseRepeat, setExpenseRepeat] = useState([]);
    
    // 수정 모달창 관리
    const [EditIncomeOpen, setEditIncomeOpen] = useState(false);
    const [EditIncomeRepeatOpen, setEditIncomeRepeatOpen] = useState(false);
    const [EditExpenseOpen, setEditExpenseOpen] = useState(false);
    const [EditExpenseRepeatOpen, setEditExpenseRepeatOpen] = useState(false);

    // 수정 모달창으로 넘겨주기 위함
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedMemo, setSelectedMemo] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [selectedInstallmentId, setSelectedInstallmentId] = useState('');
    const [docid, setDocid] = useState('');
    
    // 캘린더 모달
    const [date, setDate] = useState(new Date()); // form의 입력 값 state  
    const [showCal, setShowCal] = useState(false); // 날짜 입력하는 캘린더 모달 state


    /* 수정 모달창으로 값을 넘겨주기위해 저장하는 함수들 */
    // 수입 수정 모달창
    const openEditIncomeModal = (category, price, memo, id) => {
      setSelectedCategory(category);
      setSelectedPrice(price);
      setSelectedMemo(memo);
      setSelectedId(id);
      setEditIncomeOpen(true);
    }

    // 고정수입 수정 모달창
    const openEditIncomeRepeatModal = (category, price, memo, id) => {
      setSelectedCategory(category);
      setSelectedPrice(price);
      setSelectedMemo(memo);
      setSelectedId(id);
      setEditIncomeRepeatOpen(true);
    }

    // 지출 수정 모달창
    const openEditExpenseModal = (category, price, memo, id, installmentId) => {
      setSelectedCategory(category);
      setSelectedPrice(price);
      setSelectedMemo(memo);
      setSelectedId(id);
      setSelectedInstallmentId(installmentId); // installmentId 값을 설정합니다.
      setEditExpenseOpen(true);
    }

    // 고정지출 수정 모달창
    const openEditExpenseRepeatModal = (category, price, memo, id) => {
      setSelectedCategory(category);
      setSelectedPrice(price);
      setSelectedMemo(memo);
      setSelectedId(id);
      setEditExpenseRepeatOpen(true);
    }

    // 모달을 닫기 위한 이벤트 핸들러 함수
    const closeSubModal = () => {
      setEditIncomeOpen(false);
      setEditIncomeRepeatOpen(false);
      setEditExpenseOpen(false);
      setEditExpenseRepeatOpen(false);
    };

    /** 데이터를 가져오는 공통 함수 */
    const fetchData = async (collectionName, stateSetter) => {
      const q = query(
        collection(db, collectionName),
        where('uid', '==', user.uid),
        );
        try {
          const querySnapshot = await getDocs(q);
          let dataArray = [];
          
          querySnapshot.forEach((doc) => {
            let data = {
              id: doc.id,
              ...doc.data()
            };
            dataArray.push(data);
          });

        stateSetter(dataArray);
      } catch (error) {
        console.log(`Error getting ${collectionName} documents: `, error);
      }
    };

    // 수입 데이터 가져오기
    const getIncome = () => {
      fetchData("money_income", setIncome);
    };

    // 고정수입 데이터 가져오기
    const getIncomeRepeat = () => {
      fetchData("money_income_repeat", setIncomeRepeat);
    };

    // 지출 데이터 가져오기
    const getExpense = () => {
      fetchData("money_expense", setExpense);
    };

    // 고정지출 데이터 가져오기
    const getExpenseRepeat = () => {
      fetchData("money_expense_repeat", setExpenseRepeat);
    };


    // 화면에 가장 먼저 출력되는 것들
    useEffect(() => {
      getIncome();
      getIncomeRepeat();
      getExpense();
      getExpenseRepeat();
    }, []);

    // 업데이트된 데이터를 가져오는 함수
    const updateData = () => {
      getIncome();
      getIncomeRepeat();
      getExpense();
      getExpenseRepeat();
    };

    useEffect(() => {
      updateData();
    }, []);

    // 콜백 함수 정의
    const handleDataUpdate = () => {
      fetchData("money_income", setIncome);
      fetchData("money_income_repeat", setIncomeRepeat);
      fetchData("money_expense", setExpense);
      fetchData("money_expense_repeat", setExpenseRepeat);
    };

    // 지출 - 할부 관리
    const getins = async () => {
      const q = query(
        collection(db, "money_installments"),
        where('uid', '==', user.uid),
        );
        try {
          const querySnapshot = await getDocs(q);
          let dataArray = [];
          
          querySnapshot.forEach((doc) => {
            let data = {
              id: doc.id,
              ...doc.data()
            };
            dataArray.push(data);
          });
        setInstallments(dataArray);
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(()=>{
      getins()
      console.log(installments);
    }, [])


    /** 날짜검색하는 캘린더 모달 from.PCH */
    // 날짜 검색 버튼 클릭 시 캘린더 모달 표시
    const onClickCal = (e) => {
      e.preventDefault();
      setShowCal(true);
    }
  
    // 캘린더 모달에서 날짜를 선택했을 때 해당 날짜로 업데이트
    const onClickDate = (newDate) => {
      setDate(newDate);
      setShowCal(false);
    }

    // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
    const changeDate = (newDate) => {
      const YYYY = String(newDate.getFullYear())
      const MM = String(newDate.getMonth()+1).padStart(2,"0")
      const DD = String(newDate.getDate()).padStart(2,"0")
      const valueDate = `${YYYY}년 ${MM}월 ${DD}일`
      return valueDate;
    }

    
    /** 선택된 날짜와 동일한 데이터 필터링 */
    const formatDate = (date) => {
      // 선택된 날짜를 YYYY년 MM월 DD일 형식으로 변환
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    // 날짜별로 데이터 필터링
    const filterDataByDate = (data, selectedDate) => {
      const formattedDate = formatDate(selectedDate);
    
      // 날짜와 일치하는 데이터 필터링
      return data.filter((item) => {
        const itemDate = item.date.toDate();
        const itemDateString = formatDate(itemDate);

        return formattedDate === itemDateString;
      });
    };
    
    const filteredIncome = filterDataByDate(income, selectedDate); // 수입
    const filteredIncomeRepeat = filterDataByDate(incomeRepeat, selectedDate); // 고정수입
    const filteredExpense = filterDataByDate(expense, selectedDate); // 지출
    const filteredExpenseRepeat = filterDataByDate(expenseRepeat, selectedDate); // 고정지출


    /** 금액 천자리 콤마(,) */
    const handleHyphen = (value) => {
      const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
      return formattedValue;
    };


    return (
      <DateDetailBox>
        <div>
          <CloseBtn onClick = { closeModal2 }>X</CloseBtn>
          <SearchDate> {/* 날짜검색 캘린더 모달 */}
            <button onClick = { onClickCal }>
              <img src="/img/calendar.png" alt="calendar" />
              <span>날짜 검색</span>
            </button>
            <h2>{ selectedDate && changeDate(selectedDate) }</h2>
    
            { showCal && (
              <div>
                <button
                  type = 'button'
                  onClick = { () => { setShowCal(false) } }
                >
                  X
                </button>
                <Calendar
                  onChange = { onClickDate }
                  value = { date }
                />
              </div>
            ) }
          </SearchDate>
<br />

          {/* 수입 상세 출력 */}
          <Accordion>
            <h3>이 날의 수입은?</h3>
            <h3>
              { handleHyphen (
                filteredIncome.reduce((total, item) => total + item.price, 0) +
                filteredIncomeRepeat.reduce((total, item) => total + item.price, 0)
              ) }
              <span>&#8361;</span>
            </h3>
          </Accordion>
<br />
          <div>
            <h4>수입</h4>
            <h4>
              {/* 선택한 날짜와 동일한 수입 값의 합 계산 */}
              { handleHyphen ( 
                filteredIncome.reduce((total, item) => total + item.price, 0)
              ) }
              <span>&#8361;</span>
            </h4>
          </div>
<br />
          <div>
            {/* 선택한 날짜와 동일한 수입 값들 출력 */}
            { filteredIncome.map((item, i) => ( 
              <div key = {i}
                onClick = { () => 
                  openEditIncomeModal(item.category, item.price, item.memo, item.id) }
              >
                <span>{ item.category }</span>
                <span>{ handleHyphen(item.price) }&#8361;</span>
                <span>{ item.memo }</span>
<hr />
              </div>
            ))}
          </div>
<br />
          <div>
            <h4>반복수입</h4>
            <h4>
              { handleHyphen(
                filteredIncomeRepeat.reduce((total, item) => total + item.price, 0)
              ) }
              &#8361;
            </h4>
          </div>
<br />
          <div>
            { filteredIncomeRepeat.map((item, i) => (
              <div key = {i}
                onClick = { () =>
                  openEditIncomeRepeatModal(item.category, item.price, item.memo, item.id) }
              >
                <span>{ item.category }</span>
                <span>{ handleHyphen(item.price) }&#8361;</span>
                <span>{ item.memo }</span>
<hr />
              </div>
            ))}
          </div>

<br />
<br />
          {/* 지출 */}
          <div>
            <h3>이 날의 지출은?</h3>
            <h3>
              { handleHyphen(
                filteredExpense.reduce((total, item) => total + item.price, 0) +
                filteredExpenseRepeat.reduce((total, item) => total + item.price, 0)
              ) }
              <span>&#8361;</span>
            </h3>
          </div>
<br />
          <div>
            <h4>지출</h4>
            <h4>
              { handleHyphen(
                filteredExpense.reduce((total, item) => total + item.price, 0)
              ) }
              <span>&#8361;</span>
            </h4>
          </div>
<br />
          <div>
            { filteredExpense.map((item, i) => {
              // 해당 expense에 매칭되는 installments 문서 찾기
              const matchingInstallment = installments.find(
                (r) => r.category === item.category && r.payment === item.payment && r.memo === item.memo
              );
              
              // matchingInstallment에 따라서 문서 id를 전달하거나, 해당 문서를 출력
              const installmentId = matchingInstallment?.id;
              
              return (
                <div key = {i}
                  onClick = { () =>
                    openEditExpenseModal( item.category, item.price, item.memo, item.id, installmentId )
                  }
                > 
                  <span>{ item.category }</span>
                  <span>{ item.price !== undefined ? handleHyphen(item.price) : '' }&#8361;</span>
                  <span>{ item.installment }</span>
                  <span>{ item.memo }</span>
<hr />
                </div>
              );
            }) }
<br />
          </div>
          <div>
            <h4>반복지출</h4>
            <h4>
              { handleHyphen(
                filteredExpenseRepeat.reduce((total, item) => total + item.price, 0)
              ) }
              <span>&#8361;</span>
            </h4>
          </div>
<br />
          <div>
            { filteredExpenseRepeat.map((item, i) => (
              <div key = {i}
                onClick = {() =>
                  openEditExpenseRepeatModal( item.category, item.price, item.memo, item.id )
                }
              >
                <span>{ item.category }</span>
                <span>{ handleHyphen(item.price) }&#8361;</span>
                <span>{ item.memo }</span>
<hr />
              </div>
            ))}
          </div>
<br />
        </div>
          {/** 서브 모달 컴포넌트 */}
          {/* EditIncome컴포넌트로 전달 */}
          { EditIncomeOpen && (
            <EditIncome
              id = { selectedId }
              category = { selectedCategory }
              price = { selectedPrice }
              memo = { selectedMemo }
              closeSubModal = { closeSubModal }
              date = { date }
              handleDataUpdate = { handleDataUpdate }
            />
          ) }

          {/* EditIncomeRepeat컴포넌트로 전달 */}
          { EditIncomeRepeatOpen && (
            <EditIncomeRepeat
              id = { selectedId }
              category = { selectedCategory }
              price = { selectedPrice }
              memo = { selectedMemo }
              closeSubModal = { closeSubModal }
              showCal = { showCal }
              startDate = { startDate }
              endDate = { endDate }
              date = { date }
              handleDataUpdate = { handleDataUpdate }
            />
          )}

          {/* EditExpense컴포넌트로 전달 */}
          { EditExpenseOpen && (
            <EditExpense
              id = { selectedId }
              category = { selectedCategory }
              price = { selectedPrice }
              memo = { selectedMemo }
              closeSubModal = { closeSubModal }
              date = { date }
              handleDataUpdate = { handleDataUpdate }
              docid = { docid }
              installmentId = { selectedInstallmentId } // money_installments 컬렉션의 문서 ID 전달
            />
          )}
          
          {/* EditExpenseRepeat컴포넌트로 전달 */}
          {EditExpenseRepeatOpen && (
            <EditExpenseRepeat
              id = { selectedId }
              category = { selectedCategory }
              price = { selectedPrice }
              memo = { selectedMemo }
              closeSubModal = { closeSubModal }
              showCal = { showCal }
              startDate = { startDate }
              endDate = { endDate }
              date = { date }
              handleDataUpdate = { handleDataUpdate }
            />
          )}

    </DateDetailBox>
  )
} 