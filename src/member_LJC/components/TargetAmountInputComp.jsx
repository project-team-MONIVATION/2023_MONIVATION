import React, { useState, } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { addDoc, collection, Timestamp, } from 'firebase/firestore';

import {db} from '../../database/firebase'

import { SelectDatem, SelectPeriod } from '../../member_PCH/features/IconInModal';

import '../css/targetAmountinputcss.css'

export default function TargetAmountInputComp({setModalIsOpen}) {
    const [value, onChange] = useState(new Date());
    const user = useSelector((state) => state.user.user);

    // 오늘 날짜
    const YYYY = String(value.getFullYear())
    const MM = String(value.getMonth()+1).padStart(2,"0")
    const DD = String(value.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}-${MM}-${DD}`

    // 제목 
    const [title, setTitle] = useState('');
    // 금액
    const [amount, setAmount] = useState('');

    // 열기 닫기
    const [showPeriod, setShowPeriod] = useState(false);

    // 달력 열기 접기 //
        // (기간)시작날짜
        const [ischeck2, setCheck2] = useState(true);
        // (기간) 끝난 날짜
        const [ischeck3, setCheck3] = useState(false);


    // 최솟값 날짜
    const [mindate, setMindate] = useState('');

    // (기간)시작날짜
    const [startday, setStartday] = useState(valueDate);    
    // (기간) 끝난 날짜
    const [endday, setEndday] = useState('0000-00-00');


    // 금액 ,표시 ex1,000,000
    const handleHyphen = (event) => {
        const value = event.target.value.replace(/[^\d]/g, ''); // 숫자 이외의 문자 제거
        const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
        event.target.value = formattedValue;
    };

    // (기간)시작날짜 
    function startperiod (i) {
        let year = i.getFullYear()
        let month =  ('0' + (i.getMonth() + 1)).slice(-2);
        let day = ('0' + (i.getDate())).slice(-2);
        // 누른 날짜 yyyy-mm-dd 로 변환하기
        let when = `${year}-${month}-${day}`

    
        setStartday(when)
        setCheck2(false)
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

    // 데이터 베이스에 값 추가 함
    const addDocData = async (e) => {
        e.preventDefault();

        try {
            // 서버에 연결해서 사용하는 것은 비동기 함수로 작성
            const docRef = await addDoc(collection(db, "money_target_amount"), {
            done : false, // 고정
            user: user.uid,
            
            title,
            startday,
            endday,
            amount,
    
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        setStartday(valueDate);
        setEndday('0000-00-00');
        setAmount('');
        setTitle('');
        
        setModalIsOpen()
    }
    
    return (
        <div id ='targetinput_container'
            className='content'>
            <h1 className='title'>목표금액</h1>
            <form
                id='input_form'
                onSubmit={addDocData}
            >
                <div className='input_content'>
                    
                
                    <div className='period'>
                        <p>기간</p>
                        <div className='input_box'>
                            <span>{startday}~{endday}</span>
                            <button
                                onClick={() => {setShowPeriod((e) => !e);}}
                                type='button'
                            >
                                <SelectPeriod showPeriod={showPeriod}/>
                            </button>
                        </div>

                        <div className='period_modal'>
                        {/* 종료일 */}
                            {showPeriod && (
                                <div className='input_period'>
                                    <button 
                                        type='button' 
                                        onClick={()=>{setShowPeriod(false)}}
                                        className='close_btn'
                                        >
                                            X
                                    </button>
                                    <div className='flex_targetinput'>
                                        <div className='input_endDate_targetinput'>
                                            <p>종료일</p>
                                            <Calendar 
                                                onChange={onChange} 
                                                value={value}
                                                onClickDay={(value, event) => {endperiod(value); setCheck3(false);}}
                                                minDate={mindate}
                                                className='modal_calendar_targetinput period_targetinput'
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* 시작일 */}
                        {/* <button
                            onClick={() => {setCheck2((e) => !e);}}
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
                        )} */}
                    
                    </div>
                    <div className='input_title'>
                        <p>너가 사고싶은거</p>
                        <div className='input_box'>
                            <input
                                className='input_price'
                                type='text'
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
        
                    <div className='price'>
                        <p>너가 사고싶은거의 금액</p>
                        <div className='input_box'>
                            <input 
                                className='input_price'
                                required
                                onInput={handleHyphen} 
                                type="text"
                                onChange={e => setAmount(e.target.value)}
                            />
                            <span className='won'>₩</span>
                        </div>
                    </div>

                </div>
                <button className='submit_btn' type='sumbit' >추가</button>
            </form>
        </div>
    )
}
