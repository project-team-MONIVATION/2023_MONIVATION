import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../database/firebase';
import { useSelector } from 'react-redux'

import Calendar from 'react-calendar'; // react-calendar 라이브러리

import EditIncome from './EditIncome';
import EditIncomeRepeat from './EditIncomeRepeat'
import EditExpense from './EditExpense';
import EditExpenseRepeat from './EditExpenseRepeat'
import EditSaving from './EditSaving';

export default function DateDetail({ closeModal2, selectedDate }) {
    // state에서 user.user로 가져옴(현재 사용자 정보)
    const user = useSelector((state) => state.user.user);

    // Firestore에서 가져온 데이터 저장/관리(수입, 고정수입, 지출, 고정지출, 저금)
    const [income, setIncome] = useState([]);
    const [incomeRepeat, setIncomeRepeat] = useState([]);
    const [expense, setExpense] = useState([]);
    const [expenseRepeat, setExpenseRepeat] = useState([]);
    const [saving, setSaving] = useState([]);
    
    // 수정 모달창 관리
    const [EditIncomeOpen, setEditIncomeOpen] = useState(false);
    const [EditIncomeRepeatOpen, setEditIncomeRepeatOpen] = useState(false);
    const [EditExpenseOpen, setEditExpenseOpen] = useState(false);
    const [EditExpenseRepeatOpen, setEditExpenseRepeatOpen] = useState(false);
    const [EditSavingOpen, setEditSavingOpen] = useState(false);

    // 수정 모달창으로 넘겨주기 위함
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedMemo, setSelectedMemo] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [title, setTitle] = useState(''); // 저금
    const [amount, setAmount] = useState(''); // 저금

    const [startDate, setStartDate] = useState(new Date());
    const [endday, setEndday] = useState(new Date());
    const [clickday, setClickday] = useState(new Date());


    /* 모달에다가 값을 넘겨주기위해 저장하는 함수들 */
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
    const openEditExpenseModal = (category, price, memo, id) => {
      setSelectedCategory(category);
      setSelectedPrice(price);
      setSelectedMemo(memo);
      setSelectedId(id);
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

    // 저금 수정 모달창
    const openEditSavingModal = (title, amount, memo, user) => {
      setTitle(title);
      setAmount(amount);
      setSelectedMemo(memo);
      setSelectedId(user);
      setEditSavingOpen(true);
    }

    // 모달을 닫기 위한 이벤트 핸들러 함수
    const closeSubModal = () => {
      setEditIncomeOpen(false);
      setEditIncomeRepeatOpen(false);
      setEditExpenseOpen(false);
      setEditExpenseRepeatOpen(false);
      setEditSavingOpen(false);
    };

    /**  데이터를 가져오는 공통 함수 */
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

    // 반복수입 데이터 가져오기
    const getIncomeRepeat = () => {
      fetchData("money_income_repeat", setIncomeRepeat);
    };

    // 지출 데이터 가져오기
    const getExpense = () => {
      fetchData("money_expense", setExpense);
    };

    // 반복지출 데이터 가져오기
    const getExpenseRepeat = () => {
      fetchData("money_expense_repeat", setExpenseRepeat);
    };

    // 저금 데이터 가져오기
    const getSaving = async() => { 
      fetchData("money_saving", setSaving);
    };

    // 처음 화면에 보여줌
    useEffect(() => {
      getIncome();
      getIncomeRepeat();
      getExpense();
      getExpenseRepeat();
      getSaving();
    }, []);

    // 업데이트된 데이터를 가져오는 함수
    const updateData = () => {
      getIncome();
      getIncomeRepeat();
      getExpense();
      getExpenseRepeat();
      getSaving();
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
      fetchData("money_saving", setSaving);
    };


    /** 날짜검색하는 캘린더 모달 from.PCH */
    const [date, setDate] = useState(new Date()); // form의 입력 값 state  
    const [showCal, setShowCal] = useState(false); // 날짜 입력하는 캘린더 모달 state

    // 날짜 입력하는 캘린더 모달 on
    const onClickCal = (e) => {
      e.preventDefault();
      setShowCal(true);
    }
  
    // 날짜 입력하는 캘린더 모달에서 날짜 클릭 시 date 값 입력
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

    const [endDate, setEndDate] = useState(null);
    

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
    
    // 선택된 날짜와 동일한 저금 데이터 필터링
    const filteredSaving = saving.filter((item) => {
      const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

      // 저금 데이터의 날짜를 Date 객체로 변환
      const itemDate = item.clickday;

      return formattedDate === itemDate;
    });

    // 금액 천자리 콤마(,)
    const handleHyphen = (value) => {
      const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
      return formattedValue;
    };


    return (
      <div>
        <div>
          <div> {/* 날짜검색 캘린더 모달 */}
            <button onClick = { onClickCal }>날짜 검색</button>
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
          </div>
<br />

          {/* 수입 상세 출력 */}
          <div>
              <h3>이 날의 수입은?</h3>
              <h3>
                { handleHyphen (
                  filteredIncome.reduce((total, item) => total + item.price, 0) +
                  filteredIncomeRepeat.reduce((total, item) => total + item.price, 0)
                ) }
                &#8361;
              </h3>
          </div>
<br />
          <div>
            <h4>수입</h4>
            <h4>
              { handleHyphen ( 
                filteredIncome.reduce((total, item) => total + item.price, 0)
              ) }
              &#8361;
            </h4>
          </div>
<br />
          <div>
            { filteredIncome.map((item, i) => ( 
              // selectedDate와 date가 일치하는 경우에만 출력
              <div
                key={i}
                onClick = { () =>
                  openEditIncomeModal(item.category, item.price, item.memo, item.id)}
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
              <div
                key={i}
                onClick = { () =>
                  openEditIncomeRepeatModal(item.category, item.price, item.memo, item.id)}
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
                )}
                &#8361;
              </h3>
          </div>
<br />
          <div>
              <h4>지출</h4>
              <h4>{ handleHyphen(filteredExpense.reduce((total, item) => total + item.price, 0)) }&#8361;</h4>
          </div>
<br />
          <div>
            { filteredExpense.map((item, i) => (
              <div
                key={i}
                onClick = {() => 
                  openEditExpenseModal(item.category, item.price, item.memo, item.id)}
              >
                <span>{ item.category }</span>
                <span>{ handleHyphen(item.price) }&#8361;</span>
                <span>{ item.memo }</span>
                <hr />
              </div>
            )) }
          </div>
<br />
          <div>
              <h4>반복지출</h4>
              <h4>{ handleHyphen(filteredExpenseRepeat.reduce((total, item) => total + item.price, 0)) }&#8361;</h4>
          </div>
          <br />
          
          <div>
            { filteredExpenseRepeat.map((item, i) => (
              <div key={i}
                onClick = {() =>
                  openEditExpenseRepeatModal( item.category, item.price, item.memo, item.id, )}
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
          {/* 저금 */}
          <div>
              <h3>이 날의 저금은?</h3>
              <h3>
                { handleHyphen(
                  filteredSaving.reduce((total, item) => total + parseInt(item.amount.replace(/,/g, '')), 0)
                )}
                &#8361;
              </h3>
          </div>
          
          <div>
            { filteredSaving.map((item, i) => (
              <div key = {i}
                onClick = {() =>
                  openEditSavingModal( item.title, item.amount, item.memo, item.id, )}
              >
                <span>{ item.title }</span>
                <span>{ item.amount }&#8361;</span>
                <span>{ item.memo }</span>
                <hr />
              </div>
            ))}
          </div>

        </div>

        <button onClick={closeModal2}>닫기</button>

        {/* 서브 모달 컴포넌트 */}
        {EditIncomeOpen && (
          <EditIncome
            id={selectedId}
            category={selectedCategory}
            price={selectedPrice}
            memo={selectedMemo}
            closeSubModal={closeSubModal}
            date={date}
            handleDataUpdate={handleDataUpdate}
          />
        )}

        {EditIncomeRepeatOpen && (
          <EditIncomeRepeat
            id={selectedId}
            category={selectedCategory}
            price={selectedPrice}
            memo={selectedMemo}
            closeSubModal={closeSubModal}
            showCal={showCal}
            startDate={startDate}
            endDate={endDate}
            date={date}
            handleDataUpdate={handleDataUpdate}


          />
        )}

        {EditExpenseOpen && (
          <EditExpense
            id={selectedId}
            category={selectedCategory}
            price={selectedPrice}
            memo={selectedMemo}
            closeSubModal={closeSubModal}
            date={date}
            handleDataUpdate={handleDataUpdate}

          />
        )}
        
        {EditExpenseRepeatOpen && (
          <EditExpenseRepeat
            id={selectedId}
            category={selectedCategory}
            price={selectedPrice}
            memo={selectedMemo}
            closeSubModal={closeSubModal}
            showCal={showCal}
            startDate={startDate}
            endDate={endDate}
            date={date}
            handleDataUpdate={handleDataUpdate}

          />
        )}


  {/* 정찬이 필드명이 다 다르다 ㅜㅜㅜㅜ */}
        {EditSavingOpen && (
          <EditSaving
            id={selectedId}
            title={title}
            amount={amount}
            memo={selectedMemo}
            clickday={clickday}
            closeSubModal={closeSubModal}
            endday={endday}
            startDate={startDate}
            handleDataUpdate={handleDataUpdate}


          />
        )}


    </div>
  )
} 