import React, { useEffect, useState } from 'react'
import { db } from '../../database/firebase';
import { useSelector } from 'react-redux'
import { collection, getDocs, query, where } from 'firebase/firestore';


export default function DateDetail({ closeModal }) {
    const [isSubModalOpen, setIsSubModalOpen] = useState(false); // 서브 모달의 열림/닫힘 상태를 관리하는 상태 변수

    // 서브 모달을 열기 위한 이벤트 핸들러 함수
    const openSubModal = () => {
      setIsSubModalOpen(true);
    };
  
    // 서브 모달을 닫기 위한 이벤트 핸들러 함수
    const closeSubModal = () => {
      setIsSubModalOpen(false);
    };

    // 확인 중
    const user = useSelector((state)=>state.user.user);
    const [income, setIncome] = useState([]);
    const [incomeRepeat, setIncomeRepeat] = useState([]);
    const [expense, setExpense] = useState([]);
    const [expenseRepeat, setExpenseRepeat] = useState([]);
    const [saving, setSaving] = useState([]);

    // 수입
    const getIncome = async () => {
      const q = query(
        collection(db, "money_income"),
        where('uid', '==', user.uid)
      );
        console.log(q)
      try {
        const querySnapshot = await getDocs(q);
        let dataArray = [];
  
        querySnapshot.forEach((doc) => {
          let data = {
            category: doc.data().category,
            price: doc.data().price,
            date: doc.data().date
          };
          dataArray.push(data);
          console.log(doc.id, " => ", doc.data());
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
        where('uid', '==', user.uid)
      );
        console.log(q)
      try {
        const querySnapshot = await getDocs(q);
        let dataArray = [];
  
        querySnapshot.forEach((doc) => {
          let data = {
            category: doc.data().category,
            price: doc.data().price,
            date: doc.data().date
          };
          dataArray.push(data);
          console.log(doc.id, " => ", doc.data());
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
        where('uid', '==', user.uid)
      );
        console.log(q)
      try {
        const querySnapshot = await getDocs(q);
        let dataArray = [];
  
        querySnapshot.forEach((doc) => {
          let data = {
            category: doc.data().category,
            price: doc.data().price,
            date: doc.data().date
          };
          dataArray.push(data);
          console.log(doc.id, " => ", doc.data());
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
        where('uid', '==', user.uid)
      );
        console.log(q)
      try {
        const querySnapshot = await getDocs(q);
        let dataArray = [];
  
        querySnapshot.forEach((doc) => {
          let data = {
            category: doc.data().category,
            price: doc.data().price,
            date: doc.data().date
          };
          dataArray.push(data);
          console.log(doc.id, " => ", doc.data());
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
        where('uid', '==', user.uid)
      );
        console.log(q)
      try {
        const querySnapshot = await getDocs(q);
        let dataArray = [];
  
        querySnapshot.forEach((doc) => {
          let data = {
            category: doc.data().category,
            price: doc.data().price,
            date: doc.data().date
          };
          dataArray.push(data);
          console.log(doc.id, " => ", doc.data());
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

  return (
    <div>
            <div>
                <div>
                    <button>날짜 검색</button>
                    <h2>2023년 6월 8일 (예시)</h2>
                </div>

                {/* 수입 */}
                <div>
                    <h3>이 날의 수입은?</h3>
                    <h3>금액</h3>
                </div>
                <div>
                  <h4>수입</h4>
                  <h4>{income.reduce((total, board) => total + board.price, 0)}</h4>
                </div>
                <div>
                  {income.map((board) => (
                    <div onClick={openSubModal}>
                      <p>{board.category}</p>
                      <p>{board.price}</p>
                      <hr />
                    </div>
                  ))}
                </div>

                <div>
                    <h4>반복수입</h4>
                    <h4>{incomeRepeat.reduce((total, board) => total + board.price, 0)}</h4>
                </div>
                <div>
                  {incomeRepeat.map((board) => (
                    <div onClick={openSubModal}>
                      <p>{board.category}</p>
                      <p>{board.price}</p>
                      <hr />
                    </div>
                  ))}
                </div>

                <br />
                <br />
                {/* 지출 */}
                <div>
                    <h3>이 날의 지출은?</h3>
                    <h3>금액</h3>
                </div>
                <div>
                    <h4>지출</h4>
                    <h4>{expense.reduce((total, board) => total + board.price, 0)}</h4>
                </div>
                <div>
                  {expense.map((board) => (
                    <div onClick={openSubModal}>
                      <p>{board.category}</p>
                      <p>{board.price}</p>
                      <hr />
                    </div>
                  ))}
                </div>
                <div>
                    <h4>반복지출</h4>
                    <h4>{expenseRepeat.reduce((total, board) => total + board.price, 0)}</h4>
                </div>
                <div>
                  {expenseRepeat.map((board) => (
                    <div onClick={openSubModal}>
                      <p>{board.category}</p>
                      <p>{board.price}</p>
                      <hr />
                    </div>
                  ))}
                </div>
                
                <br />
                <br />
                {/* 저금 */}
                <div>
                    <h3>이 날의 저금은?</h3>
                    <h3>{saving.reduce((total, board) => total + board.price, 0)}</h3>
                </div>
                <div>
                    <p>저금액</p>
                    <p>금액</p>
                </div>
            
            </div>
            <button onClick={closeModal}>닫기</button>
       

            {/* 서브 모달 컴포넌트 */}
              {isSubModalOpen && (
                  <div
                    style={{
                      position: "fixed",
                      top: "0",
                      right: "90px",
                      display: "flex",

                      width: "400px",
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "5px",
                    }}
                  >
                    <h2>서브 모달 내용</h2>
                    {/* 서브 모달 내용을 추가하세요 */}
                    <button onClick={closeSubModal}>닫기</button>
                  </div>
              )}
    </div>
  )
}