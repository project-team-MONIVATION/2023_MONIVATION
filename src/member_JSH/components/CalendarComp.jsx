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


export default function CalendarComp() {
    // 현재 날짜
    const curDate = new Date();
    const [value, setValue] = useState(new Date(curDate));

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
              <div>
              <form onSubmit={(e)=>{e.preventDefault()}}>
                <label htmlFor="">날짜</label><br />
                <input type='date' value={inputDate} onChange={(e)=>setInputDate(e.target.value)}/>
                <br />
                <label htmlFor="">금액</label><br />
                <input type="number" value={inputImp} onChange={(e)=>setInputImp(e.target.value)}/>
                <br />
                <label htmlFor="">카테고리</label><br />
                <button>category1</button>
                <button>category2</button>
                <button>category3</button><br />
                <label htmlFor="">메모</label><br />
                <textarea cols="30" rows="10" value={textValue} onChange={(e)=>setTextValue(e.target.value)}></textarea><br />
                <button onClick={()=>{
                  dispatch(addImp({date : new Date(inputDate), imp : inputImp, category : "", memo : setTextValue}))
                  //console.log(inputDate);
                  //console.log(textValue);
                  setModalIsOpen(false);
                  }
                }>입력</button>
                <button onClick={()=>setModalIsOpen(false)}>취소</button>
              </form>
              
              </div>
            </Modal>
          )
        }
        {/**지출 입력 창 */}
        {
          activeModal === 2 && (
            <Modal isOpen={modalIsOpen}>
              <div>
                <h3>지출 모달 창</h3>
                <form>
                <label htmlFor="">날짜</label><br/>
                <input type='date' value={inputDate} onChange={(e)=>setInputDate(e.target.value)}/><br/>
                <label htmlFor="">금액</label><br/>
                <input type="number" value={inputEx} onChange={(e)=>setInputEx(e.target.value)}/>
                <br />
                <label htmlFor="">결제수단</label><br/>
                <select name="" id="">
                  <option value="" selected>선택</option>
                  <option value="check-card">체크카드</option>
                  <option value="credit-card">신용카드</option>
                  <option value="cash">현금</option>
                </select>
                <select name="" id="">
                  <option value="" selected>선택</option>
                  <option value="full-payment">일시불</option>
                  <option value="three-month">3개월</option>
                  <option value="six-month">6개월</option>
                </select><br/>
                <label htmlFor="">카테고리</label><br/>
                <button>category1</button>
                <button>category2</button>
                <button>category3</button><br />
                <label htmlFor="">메모</label><br />
                <textarea cols="30" rows="10" value={textValue} onChange={(e)=>setTextValue(e.target.value)}></textarea><br />
                <button onClick={()=>{
                  dispatch(addEx({date : new Date(inputDate), ex : inputEx, paywith : "", installment : "", category : "", memo : setTextValue}))
                  //console.log(inputDate);
                  //console.log(textValue);
                  setModalIsOpen(false);
                  }
                }>입력</button>
                <button onClick={()=>setModalIsOpen(false)}>취소</button>
                </form>
              </div>
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
              </div>
            </Modal>
          )
        }
    </div>
  )
}
