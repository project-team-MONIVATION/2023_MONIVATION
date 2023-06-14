import React, { useEffect, useState } from 'react'
import { db } from '../../database/firebase';
import { useSelector } from 'react-redux'
import { collection, getDocs, query, where } from 'firebase/firestore';
import Calendar from 'react-calendar';
import EditIncome from './EditIncome';
import EditIncomeRepeat from './EditIncomeRepeat'
import EditExpense from './EditExpense';
import EditExpenseRepeat from './EditExpenseRepeat'
import EditSaving from './EditSaving';


export default function DateDetail({ closeModal }) {
  const user = useSelector((state)=>state.user.user);
  
  const [income, setIncome] = useState([]);
  const [incomeRepeat, setIncomeRepeat] = useState([]);
  const [expense, setExpense] = useState([]);
  const [expenseRepeat, setExpenseRepeat] = useState([]);
  const [saving, setSaving] = useState([]);

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  
  const [EditIncomeOpen, setEditIncomeOpen] = useState(false);
  const [EditIncomeRepeatOpen, setEditIncomeRepeatOpen] = useState(false);
  const [EditExpenseOpen, setEditExpenseOpen] = useState(false);
  const [EditExpenseRepeatOpen, setEditExpenseRepeatOpen] = useState(false);
  const [EditSavingOpen, setEditSavingOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedMemo, setSelectedMemo] = useState('');
  const [selectedId, setSelectedId] = useState('');


  const [startDate, setStartDate] = useState(new Date());


  // 수입 수정 모달창
  const openEditIncomeModal = (category, price, memo, id) => {
    setSelectedCategory(category);
    setSelectedPrice(price);
    setSelectedMemo(memo);
    setSelectedId(id);
    setEditIncomeOpen(true);
  }

  // 반복수입 수정 모달창
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

  // 반복지출 수정 모달창
  const openEditExpenseRepeatModal = (category, price, memo, id) => {
    setSelectedCategory(category);
    setSelectedPrice(price);
    setSelectedMemo(memo);
    setSelectedId(id);
    setEditExpenseRepeatOpen(true);
  }

  // 저금 수정 모달창
  // const openEditSavingModal = (category, price, memo, id) => {
  //   setSelectedCategory(category);
  //   setSelectedPrice(price);
  //   setSelectedMemo(memo);
  //   setSelectedId(id);
  //   setEditSavingOpen(true);
  // }

  // 모달을 닫기 위한 이벤트 핸들러 함수
  const closeSubModal = () => {
    setEditIncomeOpen(false);
    setEditIncomeRepeatOpen(false);
    setEditExpenseOpen(false);
    setEditExpenseRepeatOpen(false);
    setEditSavingOpen(false);
  };

  // 수입
  const getIncome = async () => {
    const q = query(
      collection(db, "money_income"),
      where('uid', '==', user.uid),
    );
    try {
      const querySnapshot = await getDocs(q);
      let dataArray = [];

      querySnapshot.forEach((doc) => {
        let data = {
          id : doc.id,
          category: doc.data().category,
          price: doc.data().price,
          date: doc.data().date,
          memo: doc.data().memo
        };
        dataArray.push(data);
      });
      setIncome(dataArray);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  // 반복수입
  const getIncomeRepeat = async () => {
    const q = query(
      collection(db, "money_income_repeat"),
      where('uid', '==', user.uid),
    );
    try {
      const querySnapshot = await getDocs(q);
      let dataArray = [];
      querySnapshot.forEach((doc) => {
        let data = {
          id: doc.id,
          category: doc.data().category,
          price: doc.data().price,
          date: doc.data().date,
          memo: doc.data().memo
        };
        dataArray.push(data);
      });

      setIncomeRepeat(dataArray);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  // 지출
  const getExpense = async () => {
    const q = query(
      collection(db, "money_expense"),
      where('uid', '==', user.uid),
    );
    try {
      const querySnapshot = await getDocs(q);
      let dataArray = [];

      querySnapshot.forEach((doc) => {
        let data = {
          id: doc.id,
          category: doc.data().category,
          price: doc.data().price,
          date: doc.data().date,
          memo: doc.data().memo
        };
        dataArray.push(data);
      });
      setExpense(dataArray);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };
  
  // 반복지출
  const getExpenseRepeat = async () => {
    const q = query(
      collection(db, "money_expense_repeat"),
      where('uid', '==', user.uid),
    );
    try {
      const querySnapshot = await getDocs(q);
      let dataArray = [];

      querySnapshot.forEach((doc) => {
        let data = {
          id: doc.id,
          category: doc.data().category,
          price: doc.data().price,
          date: doc.data().date,
          memo: doc.data().memo
        };
        dataArray.push(data);
      });
      setExpenseRepeat(dataArray);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };
  
  // 저금
  const getSaving = async () => {
    const q = query(
      collection(db, "money_saving"),
      where('uid', '==', user.uid),
    );
    try {
      const querySnapshot = await getDocs(q);
      let dataArray = [];

      querySnapshot.forEach((doc) => {
        let data = {
          id: doc.id,
          title: doc.data().title,
          price: doc.data().price,
          date: doc.data().date,
          memo: doc.data().memo
        };
        dataArray.push(data);
      });
        setSaving(dataArray);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };
  
  useEffect(() => {
      getIncome();
      getIncomeRepeat();
      getExpense();
      getExpenseRepeat();
      getSaving();
  }, []);

  
   // 캘린더
    // form의 입력 값 state  
    const [date, setDate] = useState(new Date());
    // 날짜 입력하는 캘린더 모달 state
    const [showCal, setShowCal] = useState(false);
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
      const valueDate = `${YYYY}-${MM}-${DD}`
      return valueDate;
    }


    const [endDate, setEndDate] = useState(null);
    

  return (
    <div>
      <div>
          <div>
              <button onClick={ onClickCal }>날짜 검색</button>
              <h2>{date && changeDate(date)}</h2>
              {
                  showCal && (
                    <div>
                      <button type='button' onClick={()=>{setShowCal(false)}}>X</button>
                      <Calendar onChange={ onClickDate } value={date}/>
                    </div>
                  )
                }
          </div>
          {/* 수입 */}
          <div>
              <h3>이 날의 수입은?</h3>
              <h3>{income.reduce((total, item) => total + item.price, 0) + incomeRepeat.reduce((total, item) => total + item.price, 0)}</h3>
          </div>
          <div>
            <h4>수입</h4>
            <h4>{income.reduce((total, item) => total + item.price, 0)}</h4>
          </div>
          
          <div>
            {income.map((item, i) => ( 
              // selectedDate와 date가 일치하는 경우에만 출력
              <div key={i}
                onClick = {() =>
                  openEditIncomeModal(item.category, item.price, item.memo, item.id)}
              >
                <p>{item.category}</p>
                <p>{item.price}</p>
                <p>{item.memo}</p>
                <hr />
              </div>
            ))}
          </div>
          <div>
              <h4>반복수입</h4>
              <h4>{incomeRepeat.reduce((total, item) => total + item.price, 0)}</h4>
          </div>
          <div>
            {incomeRepeat.map((item, i) => (
              <div key={i}
                onClick = {() =>
                  openEditIncomeRepeatModal(item.category, item.price, item.memo, item.id)}
              >
                <p>{item.category}</p>
                <p>{item.price}</p>
                <p>{item.memo}</p>
                <hr />
              </div>
            ))}
          </div>

          <br />
          <br />
          {/* 지출 */}
          <div>
              <h3>이 날의 지출은?</h3>
              <h3>{expense.reduce((total, item) => total + item.price, 0) + expenseRepeat.reduce((total, item) => total + item.price, 0)}</h3>
          </div>
          <div>
              <h4>지출</h4>
              <h4>{expense.reduce((total, item) => total + item.price, 0)}</h4>
          </div>
          <div>
            {expense.map((item, i) => (
              <div key={i}
                onClick = {() => 
                  openEditExpenseModal(item.category, item.price, item.memo, item.id)}
              >
                <p>{item.category}</p>
                <p>{item.price}</p>
                <p>{item.memo}</p>
                <hr />
              </div>
            ))}
          </div>
          <div>
              <h4>반복지출</h4>
              <h4>{expenseRepeat.reduce((total, item) => total + item.price, 0)}</h4>
          </div>
          
          <div>
            {expenseRepeat.map((item, i) => (
              <div key={i}
                onClick = {() =>
                  openEditExpenseRepeatModal( item.category, item.price, item.memo, item.id)}
              >
                <p>{item.category}</p>
                <p>{item.price}</p>
                <p>{item.memo}</p>
                <hr />
              </div>
            ))}
          </div>
          
          <br />
          <br />
          {/* 저금 */}
          <div>
              <h3>이 날의 저금은?</h3>
              <h3>{saving.reduce((total, item) => total + item.price, 0)}</h3>
          </div>
          <div>
              <p>저금액</p>
              <p>금액</p>
          </div>
      
      </div>

      <button onClick={closeModal}>닫기</button>
      {/* 서브 모달 컴포넌트 */}
      {EditIncomeOpen && (
        <EditIncome
          id={selectedId}
          category={selectedCategory}
          price={selectedPrice}
          memo={selectedMemo}
          closeSubModal={closeSubModal}
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

        />
      )}

      {EditExpenseOpen && (
        <EditExpense
          id={selectedId}
          category={selectedCategory}
          price={selectedPrice}
          memo={selectedMemo}
          closeSubModal={closeSubModal}
        />
      )}
      
      {EditExpenseRepeatOpen && (
        <EditExpenseRepeat
          id={selectedId}
          category={selectedCategory}
          price={selectedPrice}
          memo={selectedMemo}
          closeSubModal={closeSubModal}
        />
      )}

      {EditSavingOpen && (
        <EditSaving
          id={selectedId}
          category={selectedCategory}
          price={selectedPrice}
          memo={selectedMemo}
          closeSubModal={closeSubModal}
        />
      )}


    </div>
  )
}