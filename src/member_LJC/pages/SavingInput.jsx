import React, { useState, } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { addDoc, collection, Timestamp, } from 'firebase/firestore';

import {db} from '../../database/firebase'

import '../css/saving.css'

export default function Saving({setModalIsOpen}) {
    const [value, onChange] = useState(new Date());
    const user = useSelector((state) => state.user.user);
    
    
    // 오늘 날짜
    const YYYY = String(value.getFullYear())
    const MM = String(value.getMonth()+1).padStart(2,"0")
    const DD = String(value.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}-${MM}-${DD}`

    // 최솟값 날짜
    const [mindate, setMindate] = useState('');
    // 최대값 날짜
    const [maxdate, setMaxdate] = useState('');

    // (저금예정일 선택)달력 클릭하면 true 값으로 바뀌며 달력 뜸
    // 열기 닫기
        const [isCheck, setCheck] = useState(false);

        const [modal, setModal] = useState(false);

        // (기간)시작날짜
        const [ischeck2, setCheck2] = useState(true);
        // (기간) 끝난 날짜
        const [ischeck3, setCheck3] = useState(false);

    // (저금예정일 선택)클릭한 날짜
    const [clickday, setClickday] = useState(valueDate);
    // (기간)시작날짜
    const [startday, setStartday] = useState(valueDate);    
    // (기간) 끝난 날짜
    const [endday, setEndday] = useState('0000-00-00');

    // 금액
    const [amount, setAmount] = useState('');
    // 기간 종류
    const [periodunit, setPeriodunit] = useState('');


    // 제목
    const [title, setTitle] = useState('');
    // 메모 
    const [memo, setMemo] = useState('');




    // (저금예정일 선택)클릭한 날짜
    function gu (i) {
        let year = i.getFullYear()
        let month =  ('0' + (i.getMonth() + 1)).slice(-2);
        let day = ('0' + (i.getDate())).slice(-2);
        // 누른 날짜 yyyy-mm-dd 로 변환하기
        let when = `${year}-${month}-${day}`

        setClickday(when)
        setCheck(false)
    }

    // (기간)시작날짜 
    function startperiod (i) {
        let year = i.getFullYear()
        let month =  ('0' + (i.getMonth() + 1)).slice(-2);
        let day = ('0' + (i.getDate())).slice(-2);
        // 누른 날짜 yyyy-mm-dd 로 변환하기
        let when = `${year}-${month}-${day}`

    
        setStartday(when)
        setCheck2(false)
        setCheck(false)
        
    }

    // (기간)끝 날짜
    function endperiod (i) {
        let year = i.getFullYear()
        let month =  ('0' + (i.getMonth() + 1)).slice(-2);
        let day = ('0' + (i.getDate())).slice(-2);
        // 누른 날짜 yyyy-mm-dd 로 변환하기
        let when = `${year}-${month}-${day}`

    
        setEndday(when)
        setCheck3(false)
    }


    // 금액 ,표시 ex1,000,000
    const handleHyphen = (event) => {
        const value = event.target.value.replace(/[^\d]/g, ''); // 숫자 이외의 문자 제거
        const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
        event.target.value = formattedValue;
    };


    // 데이터 베이스에 값 추가 함
    const addDocData = async (e) => {
        e.preventDefault();

        try {
            // 서버에 연결해서 사용하는 것은 비동기 함수로 작성
            const docRef = await addDoc(collection(db, "money_saving"), {
            done : false, // 고정
            uid: user.uid,
            clickday,
            startday,
            endday,
            periodunit,
            amount,
            title,
            memo,
            startDate : Timestamp.fromDate(new Date()), // 고정
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        setClickday(valueDate);
        setStartday(valueDate);
        setEndday('0000-00-00');
        setAmount('');
        setTitle('');
        setMemo('');
        setModalIsOpen()
    }
    
    
        

    

    return (
        <div>
            <form
                onSubmit={addDocData}
            >
            <h2>저금예정일</h2>
                <div>{startday}
                    <button
                        onClick={() => {setCheck((e) => !e); setModal(false);}}
                        type='button'
                    >
                    {isCheck ? "닫힘" : "열림"}
                    </button>
                    {isCheck && (
                        <div className='modal-cal modal-cal2'>
                            <Calendar 
                                onChange={onChange} 
                                value={value}
                                onClickDay={(value, event) => {startperiod(value); setMaxdate(value);}}
                            />
                        </div>
                        
                    )}
                </div>
            
            <br />
<hr />

            <h2>기간</h2>

                {/* test 라이브러리로 기간선택 */}
                {<div>
                    {startday}~{endday}
                    <button
                        onClick={() => {setModal((e) => !e);}}
                        type='button'
                    >
                        {modal ? "닫힘" : "열림"}
                    </button>
                    {/* 기간선택 모달창 */}
                    {modal && (
                    <div className='saving-period'>
                        {/* 시작일 */}
                        <button
                            onClick={() => {setCheck2((e) => !e); setCheck(false); }}
                            type='button'
                        >
                        <p style={{ color: ischeck2 ? "#BB363F" : "#000" }}>시작일</p>
                        </button>
                        {ischeck2 && (
                            <div className='modal-cal'>
                                <Calendar 
                                    onChange={onChange}
                                    value={value}
                                    onClickDay={(value, event) => {startperiod(value); setCheck2(false); setCheck3(true); setMindate(value);}}
                                    
                                />
                            </div>
                        )}

                        {/* 종료일 */}
                        <button
                            onClick={() => {setCheck3((e) => !e); setCheck(false); } }
                            type='button'
                        >
                        <p style={{ color: ischeck3 ? "#BB363F" : "#000" }}>종료일</p>
                        </button>
                        {ischeck3 && (
                            <div className='modal-cal'>
                                <Calendar 
                                    onChange={onChange} 
                                    value={value}
                                    onClickDay={(value, event) => {endperiod(value); setCheck3(false);}}
                                    minDate={mindate}
                                />
                            </div>
                        )}

                        {/* x닫기 버튼 */}
                        <button
                        onClick={() => {setModal((e) => !e);}}
                        type='button'
                        >
                        {modal ? "X" : "열림"}
                        </button>
                        
                        {/* 반복주기 select창 */}
                        <h4>반복주기</h4>
                        <div>
                            <form action="">
                                <select 
                                    onChange={(e) => {setPeriodunit(e.target.value)}}
                                >
                                    <option value="value" selected disabled>
                                        주기를 선택해주세요.
                                    </option>
                                    <option value="day">day</option>
                                    <option value="week">week</option>
                                    <option value="month">month</option>
                                    <option value="year">year</option>
                                </select>
                            </form>
                        </div>
                        <button
                        onClick={() => {setModal((e) => !e);}}
                        type='button'
                        >
                        {modal ? "입력" : "열림"}
                        </button>
                        
                    </div>
                    
                    )}
                </div>}
<hr />
                
            {periodunit}
            <br />            
            <h2>금액</h2>
                <div>
                    <input 
                        required
                        onInput={handleHyphen} 
                        type="text"
                        onChange={e => setAmount(e.target.value)}
                    
                    />
                    
                    
                    
                </div>

            <br />
            <h2>제목</h2>
                <div>
                    <input
                        type='text'
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                

            <br />
            <h2>메모</h2>
                <div>
                    <textarea
                        type='text'
                        value={memo}
                        onChange={e => setMemo(e.target.value)}
                    />

                    
                </div>
            

            <br />
            <button type='sumbit' >입력</button><br />
            </form>
<hr />

        </div>
    )
}
