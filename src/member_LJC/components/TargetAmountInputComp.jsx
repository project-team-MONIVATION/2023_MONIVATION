import React, { useState, } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { addDoc, collection, Timestamp, } from 'firebase/firestore';

import {db} from '../../database/firebase'

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
            const docRef = await addDoc(collection(db, "money_target amount"), {
            done : false, // 고정
            uid: user.uid,
            
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
        <div>
            <form
            onSubmit={addDocData}
            >
                <h2>너가 사고싶은거</h2>
                    <div>
                        <input
                            type='text'
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
        <br />

                <h2>너가 사고싶은거의 금액</h2>
                    <div>
                        <input 
                            required
                            onInput={handleHyphen} 
                            type="text"
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>
        <br />        
                <h2>언제까지 돈 모을꺼야</h2>
                {startday}~{endday}
                {/* 시작일 */}
                <button
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
                        )}

                        {/* 종료일 */}
                        <button
                            onClick={() => {setCheck3((e) => !e);} }
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
                        <br />
                        <button type='sumbit' >추가</button>
            </form>
        </div>
    )
}
