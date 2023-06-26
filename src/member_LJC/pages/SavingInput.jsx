import React, { useState, } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { addDoc, collection, Timestamp, } from 'firebase/firestore';

import {db} from '../../database/firebase'

import '../css/saving.css'
import { SelectDate, SelectPeriod } from '../../member_PCH/features/IconInModal';
import moment from 'moment';

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
        const [showCal, setShowCal] = useState(false);

        const [showPeriod, setShowPeriod] = useState(false);

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
    const [periodunit, setPeriodunit] = useState(null);


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
        setShowCal(false)
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
        setShowCal(false)
        
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
            user: user.uid,
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
        <div className='content'>
            <h1 className='saving'>저금</h1>
            <form
                id='input_form'
                onSubmit={addDocData}
            >
                <div className='input_content'>
                    <div className='date'>
                        <p>저금예정일</p>
                        <div className='input_box'>
                            <span>{startday}</span>
                            <button
                                onClick={() => {setShowCal((e) => !e); setShowPeriod(false);}}
                                type='button'
                            >
                                <SelectDate showCal={showCal}/>
                            </button>
                        </div>
                        <div className='date_modal'>
                            {showCal && (
                                <div className='input_date'>
                                    <button 
                                        type='button' 
                                        onClick={()=>{setShowCal(false)}}
                                        className='close_btn'
                                    >
                                        X
                                    </button>
                                    <Calendar 
                                        formatDay={(locale, date) => moment(date).format('D')}
                                        onChange={onChange} 
                                        value={value}
                                        onClickDay={(value, event) => {startperiod(value); setMaxdate(value);}}
                                        className='modal_calendar'
                                    />
                                </div>
                                
                            )}
                        </div>
                    </div>

                    <div className='period'>
                        <p>기간</p>

                        {/* test 라이브러리로 기간선택 */}
                        <div className='input_box'>
                            <span>{startday} ~ {endday} {periodunit ? `/ ${periodunit}` : null}</span>
                            <button
                                onClick={() => {setShowPeriod((e) => !e);}}
                                type='button'
                            >
                                <SelectPeriod showPeriod={showPeriod}/>
                            </button>
                        </div>
                        <div className='period_modal'>
                            {/* 기간선택 모달창 */}
                            {
                                showPeriod && (
                                    <div className='input_period'>
                                        {/* 종료일 */}
                                        <button 
                                        type='button' 
                                        onClick={()=>{setShowPeriod(false)}}
                                        className='close_btn'
                                        >
                                            X
                                        </button>
                                        <div className='flex'>
                                            <div className='input_endDate'>
                                                <p>종료일</p>
                                                <Calendar 
                                                    formatDay={(locale, date) => moment(date).format('D')}
                                                    onChange={onChange} 
                                                    value={value}
                                                    onClickDay={(value, event) => {endperiod(value); setCheck3(false);}}
                                                    minDate={mindate}
                                                    className='modal_calendar period'
                                                />
                                            </div>
                                            <div className='input_cycle'>
                                                <p>반복주기</p>
                                                <div className='select'>
                                                    <select 
                                                        name='cycle'
                                                        onChange={(e) => {setPeriodunit(e.target.value)}}
                                                        className={ periodunit !== null ? "active" : ""}
                                                    >
                                                        <option value="value" selected disabled>
                                                            필수선택
                                                        </option>
                                                        <option value="매일">매일</option>
                                                        <option value="매주">매주</option>
                                                        <option value="매월">매월</option>
                                                        <option value="매년">매년</option>
                                                    </select>
                                                </div>
                                                <button
                                                    type='button' 
                                                    onClick={()=>{setShowPeriod(false)}}
                                                    disabled={!endday || !periodunit}
                                                    className= {!endday || !periodunit ? "disabled" : ""}
                                                >
                                                    입력
                                                </button>
                                            </div>
                                        </div>
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
                                required
                                onInput={handleHyphen} 
                                type="text"
                                onChange={e => setAmount(e.target.value)}
                            />
                            <span className='won'>₩</span>
                        </div>
                    </div>

                    <div className='title'>
                        <p>제목</p>
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
                    
                    <div className='memo'>
                        <p>메모</p>
                        <div>
                            <textarea
                                type='text'
                                value={memo}
                                onChange={e => setMemo(e.target.value)}
                            />

                            
                        </div>
                    </div>
                </div>
            
                <button className='submit_btn' type='sumbit'>입력</button>
            </form>
        </div>
    )
}
