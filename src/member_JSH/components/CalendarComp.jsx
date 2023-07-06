import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import moment, { locale } from 'moment';
import 'moment/locale/ko';
import 'react-calendar/dist/Calendar.css'; // css import
import '../css/calendar.css';
import '../../member_LJC/css/moneyCalendar.css'
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';

import IncomeModalComp from '../../member_PCH/components/IncomeModalComp';
import ExpenseModalComp from '../../member_PCH/components/ExpenseModalComp';

import SavingInput from '../../member_LJC/pages/SavingInput'; // 저금 모달

import DateDetail from '../../member_HHS/components/DateDetail'; // 날짜별 상세보기 모달
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../database/firebase';
import styled from 'styled-components';
import ModalWrap from '../../member_HHS/styleComponent/DateDetail/ModalWrap';
import { animate } from 'framer-motion';
import TotalStatComp from './TotalStatComp';


const InputBtn = styled.button`
  border: 0;
  background-color: transparent;
  font-family: 'Cafe24Ssurround';
  font-size: 20px;
  color: #ffffff;
  width: 80%;
  margin-right: 20%;
`


export default function CalendarComp({ onMonthChange }) {
    /** 파이어스토어에서 값 가져오기 위함 HHS */
    const user = useSelector((state)=>state.user.user);

    const [income, setIncome] = useState([]);
    const [incomeRepeat, setIncomeRepeat] = useState([]);
    const [expense, setExpense] = useState([]);
    const [expenseRepeat, setExpenseRepeat] = useState([]);

    /** 컴포넌트 관리 JSH */
    // 현재 날짜
    const curDate = new Date();
    const [value, setValue] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()+1);


    // 일반 수입 리덕스
    const implist = useSelector((state)=>(state.imp));

    // 일반 지출 리덕스
    const exlist = useSelector((state)=>(state.ex));

    // 저금 리덕스
    const savelist = useSelector((state)=>(state.save));

    const dispatch = useDispatch();

    const [modalIsOpen, setModalIsOpen] = useState(false);

    // 입력받은 수입,지출,저금 state
    const [inputImp, setInputImp] = useState(0);

    // 총수입지출
    const totalArray = [...implist, ...exlist]

    // 입력받은 날짜 state
    const [inputDate, setInputDate] = useState(new Date(curDate));

    // 입력받은 메모 state
    const [textValue, setTextValue] = useState("");

    // 모달 창 관련
    const [activeModal, setActiveModal] = useState(null);
    const openModal = (modalId) => {
      setActiveModal(modalId);
    };

    // input버튼 열기 닫기
    const [InputBtns, setInputBtns] = useState(false);

    const pulsebtn = () => {
      setInputBtns(!InputBtns)
      console.log(InputBtns)
    }
    



    // 닫기 버튼은 chatGPT 좀더 참고해야할듯
    const closeModal = () => {
      setActiveModal(null);
    };

    // 카드 선택
    // 할부 선택

    // DateDetail 컴포넌트를 모달창으로 연결 HHS
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    // 모달창 열기
    const openModal2 = (value) => {
      setIsModalOpen2(true);
    };
  
    // 모달창 닫기
    const closeModal2 = () => {
      setIsModalOpen2(false);
    };

    const handleDataReceived = (data) => {
      setInputImp(data);
    };

    /** 수입/지출 총 가격 캘린더에 출력하기 위함 */
    // 데이터를 가져오는 공통 함수
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

    //반복지출 데이터 가져오기
    const getExpenseRepeat = () => {
      fetchData("money_expense_repeat", setExpenseRepeat);
    };

    useEffect(() => {
      if(user){
        getIncome();
        getIncomeRepeat();
        getExpense();
        getExpenseRepeat();
      }
    }, [user, modalIsOpen, isModalOpen2]);

    // 금액 천자리 콤마(,)
    const handleHyphen = (value) => {
      const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
      return formattedValue;
    };

    // 날짜가 바뀔때마다 현 comp의 날짜를 prop값으로 전달
    const handleCalendarChange = (newValue) => {
      setValue(newValue);
      setSelectedDate(newValue);

      const currentMonth = newValue.getMonth() + 1; // 월은 0부터 시작하므로 +1을 해줍니다.
      onMonthChange(currentMonth);
    };

    const handleActiveStartDateChange = ({ activeStartDate }) => {
      setSelectedMonth(activeStartDate.getMonth()+1);
    };


  return (
    <div style={{width:"100%", display:"flex", justifyContent : "center"}}>
      <TotalStatComp selectedDate={selectedDate}
        selectedMonth={selectedMonth}
      />
      
    <div style={{width : "77%"}}>
      <div>
      <Calendar onChange={handleCalendarChange}
        onActiveStartDateChange={handleActiveStartDateChange}
        value={value}
        className='main_calendar'
        formatDay={(locale, date) => moment(date).format('D')}
        showNeighboringMonth={true}
        //년 단위 이동 버튼 없앰
        next2Label={null}
        prev2Label={null}
        navigationAriaLive={null}
        locale="ko"

        // 날짜 눌러서 상세 모달창 나오게 함
        onClickDay={(value, event)=> {openModal2(value)}}

        tileContent={({ date }) => {
          // 날짜에 대한 컨텐츠를 반환
          const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
          
          // 포맷된 날짜에 따라 데이터를 필터링
          const filterDataByDate = (data, formattedDate) => {
            return data.filter((item) => {
              const itemDate = item.date.toDate();
              const itemDateString = `${itemDate.getFullYear()}년 ${itemDate.getMonth() + 1}월 ${itemDate.getDate()}일`;
              return formattedDate === itemDateString;
            });
          };

          const filteredIncome = filterDataByDate(income, formattedDate);
          const filteredIncomeRepeat = filterDataByDate(incomeRepeat, formattedDate);
          const filteredExpense = filterDataByDate(expense, formattedDate);
          const filteredExpenseRepeat = filterDataByDate(expenseRepeat, formattedDate);

          // 총 수입 및 총 지출 계산
          const totalIncome = filteredIncome.reduce((total, item) => total + item.price, 0) + filteredIncomeRepeat.reduce((total, item) => total + item.price, 0);
          // console.log(totalIncome)

          // 선택한 날짜에 대한 총 지출 계산
          const totalExpense = filteredExpense.reduce((total, item) => total + item.price, 0) + filteredExpenseRepeat.reduce((total, item) => total + item.price, 0);

          return (
            <div>
              {/* 값이 0이 아닐때만 출력 */}
              {totalIncome !== 0 && (
              <p
                style = {{
                  color:"blue",
                  fontSize:"0.7rem", }}
              >
                { handleHyphen(totalIncome) }&#8361;
              </p>
              )}
              {totalExpense !== 0 && (
              <p
                style = {{
                  color:"red",
                  fontSize:"0.7rem", }}
              >
                { handleHyphen(totalExpense) }&#8361;
              </p>
              )}
            </div>
          );
        }}
      />
      </div>

      {isModalOpen2 && (
        <ModalWrap>
          <div
          >
            <DateDetail
              closeModal2 = { closeModal2 }
              selectedDate = { value }
              onDataReceived = { handleDataReceived }
            />
          </div>
        </ModalWrap>
      )}

      {/* 수입, 지출, 저금 모달 버튼 */}
      <div id='moneyinput'
        className='moneyinput_container'
      >
        <div
          className='money_pluse_btn_wrap'
          onClick={() => {pulsebtn()}}
          style={{cursor: "pointer"}}
        >
          <button
            // className='pluse_btn'
            className={`pluse_btn ${InputBtns ? 'clike' : ''}`}
          ></button>
        </div>
        <div 
          className={InputBtns ? 'money_input_btns' : 'money_input_btns_delete'}
        >
          <InputBtn onClick={() => {
            setModalIsOpen(true);
            openModal(1);
          }}>
            수입
          </InputBtn>
          <InputBtn onClick={()=>{
            setModalIsOpen(true);
            openModal(2);
          }}>
            지출
          </InputBtn>
          <InputBtn 
            onClick={()=>{
            setModalIsOpen(true);
            openModal(3);
            }}
            style={{ marginBottom: "20px"}}
          >
            저금
          </InputBtn>
        </div>
      </div>

        {/**수입 입력 창 */}
        {
          activeModal === 1 && (
            <Modal 
              id='calendar_modal'
              isOpen={modalIsOpen} 
              style={{
                overlay: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)'
                },
                content: {
                  boxSizing: 'border-box',
                  width: '580px',
                  height: '790px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50px',
                  border: 0
                }
              }}
            >
              <div className='content_container'>
                <button 
                  className='close_btn'
                  onClick={()=>setModalIsOpen(false)}
                >
                  X
                </button>
                <IncomeModalComp setModalIsOpen={setModalIsOpen}/>
              </div>
            </Modal>
          )
        }
        {/**지출 입력 창 */}
        {
          activeModal === 2 && (
            <Modal 
              id='calendar_modal'
              isOpen={modalIsOpen}
              style={{
                overlay: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)'
                },
                content: {
                  boxSizing: 'border-box',
                  width: '580px',
                  height: '850px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50px',
                  border: 0
                }
              }}
            >
              <div className='content_container'>
                <button 
                  className='close_btn'
                  onClick={()=>setModalIsOpen(false)}
                >
                  X
                </button>
                <ExpenseModalComp setModalIsOpen={setModalIsOpen}/>
              </div>
            </Modal>
          )
        }
        {/**저금 입력 창 */}
        {
          activeModal === 3 && (
            <Modal
              id='calendar_modal'
              isOpen={modalIsOpen}
              style={{
                overlay: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)'
                },
                content: {
                  boxSizing: 'border-box',
                  width: '580px',
                  height: '790px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50px',
                  border: 0
                }
              }}
            >
              <div className='content_container'>
                <button 
                  className='close_btn'
                  onClick={()=>setModalIsOpen(false)}
                >
                  X
                </button>
                <SavingInput setModalIsOpen={setModalIsOpen}/>
              </div>
            </Modal>
          )
        }
    </div>
    </div>
  )
}
