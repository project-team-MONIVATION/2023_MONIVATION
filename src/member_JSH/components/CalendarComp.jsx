import React, { useState } from 'react'
import Calendar from 'react-calendar';
import moment, { locale } from 'moment';
import 'moment/locale/ko';
import 'react-calendar/dist/Calendar.css'; // css import
import '../css/calendar.css'
import Modal from 'react-modal';
import {useSelector, useDispatch} from 'react-redux';

// 리듀서 import
import { addImp } from '../slices/inputImpSlice';
import { addEx } from '../slices/inputExSlice';
import IncomeModalComp from '../../member_PCH/components/IncomeModalComp';
import ExpenseModalComp from '../../member_PCH/components/ExpenseModalComp';
// 저금 모달
import SavingInput from '../../member_LJC/pages/SavingInput';

// import { userDate } from '../../member_PC_HS/slice/userSlice';
import DateDetail from '../../member_HHS/components/DateDetail';


export default function CalendarComp() {  
    // 현재 날짜
    const curDate = new Date();
    // const [value, setValue] = useState(new Date(curDate));
    const [value, setValue] = useState(new Date());


    // 일반 수입 리덕스
    const implist = useSelector((state)=>(state.imp));
    //const [inputs, setInputs] = useState();
    // 일반 지출 리덕스
    const exlist = useSelector((state)=>(state.ex));
    // 저금 리덕스
    const savelist = useSelector((state)=>(state.save));

    const dispatch = useDispatch();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    //const [tilecontents, setTilecontents] = useState("수입/지출");
    // 입력받은 수입,지출,저금 state
    const [inputImp, setInputImp] = useState(0);
    const [inputEx, setInputEx] = useState(0);
    const [inputSave, setInputSave] = useState(0);
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
    // 닫기 버튼은 chatGPT 좀더 참고해야할듯
    const closeModal = () => {
      setActiveModal(null);
    };

    // 카드 선택
    // 할부 선택


    // DateDetail컴포넌트를 모달창으로 연결 HHS 
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const openModal2 = (value) => {
      setIsModalOpen2(true);
      // 날짜 변환해서 넘겨줌
      const formattedDate = `${value.getFullYear()}년 ${value.getMonth() + 1}월 ${value.getDate()}일`;
      //dispatch(userDate({ date: formattedDate }));
      console.log(formattedDate)
    };
  
    const closeModal2 = () => {
      setIsModalOpen2(false);
    };

    // 수정 확인 작업 중  
    const handleDataReceived = (data) => {
      // 데이터를 처리하고 원하는 위치에 넣어줍니다.
      // 예시로 inputImp 상태를 업데이트하는 코드를 작성했습니다.
      setInputImp(data);
    
      // 필요한 경우 다른 상태를 업데이트하거나 원하는 작업을 수행할 수 있습니다.
    };

  return (
    <div>
      <Calendar onChange={setValue} value={value}
        formatDay={(locale, date) => moment(date).format('D')}
        showNeighboringMonth={false}
        //년 단위 이동 버튼 없앰
        next2Label={null}
        prev2Label={null}
        navigationAriaLive={null}
        locale="en"

        // 날짜 눌러서 상세 모달창 나오게 함
        onClickDay={(value, event)=> {openModal2(value)}}

        tileContent={({date, view})=>{
          let imp, ex;
          for(let input of implist ){
            if(view === 'month'&& 
            date.getMonth() === input.date.getMonth() && 
            date.getDate() === input.date.getDate() &&
            date.getFullYear() === input.date.getFullYear()){
              imp = input;
              break;
            }
          }
          for(let input of exlist ){
            if(view === 'month'&& 
            date.getMonth() === input.date.getMonth() && 
            date.getDate() === input.date.getDate() &&
            date.getFullYear() === input.date.getFullYear()){
              ex = input;
              break;
            }
          }
          return <div>
            <p>{imp && imp.imp}</p>
            <p>{ex && ex.ex}</p>
          </div>
        }}
      />

        {isModalOpen2 && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '600px',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
            }}
          >
            {/* onDataReceived 추가해줌 */}
            <DateDetail closeModal2={closeModal2} selectedDate={value} onDataReceived={handleDataReceived}/>
          </div>
        </div>
        )}

      {/* 수입, 지출, 저금 모달 버튼 */}
      <button onClick={() => {
        setModalIsOpen(true);
        openModal(1);
      }}>
        수입
      </button>
      <button onClick={()=>{
        setModalIsOpen(true);
        openModal(2);
      }}>
        지출
      </button>
      <button onClick={()=>{
        setModalIsOpen(true);
        openModal(3);
      }}>
        저금
      </button>
        {/*<div className='text-gray-500 mt-4'>
          {
            moment(value).format("YYYY-MM-DD")
          }
        </div>*/}
        {/**수입 입력 창 */}
        {
          activeModal === 1 && (
            <Modal isOpen={modalIsOpen}>
              <button onClick={()=>setModalIsOpen(false)}>X</button>
              <IncomeModalComp setModalIsOpen={setModalIsOpen}/>
            </Modal>
          )
        }
        {/**지출 입력 창 */}
        {
          activeModal === 2 && (
            <Modal isOpen={modalIsOpen}>
              <button onClick={()=>setModalIsOpen(false)}>X</button>
              <ExpenseModalComp setModalIsOpen={setModalIsOpen}/>
            </Modal>
          )
        }
        {/**저금 입력 창 */}
        {
          activeModal === 3 && (
            <Modal isOpen={modalIsOpen}>
              <div>
                <h3>저금 모달 창</h3>
                <button onClick={()=>setModalIsOpen(false)}>취소</button>
                <SavingInput setModalIsOpen={setModalIsOpen}/>
              </div>
            </Modal>
          )
        }
    </div>
  )
}
