// 저금 수정 모달

import React, { useEffect, useState, } from 'react';
import Calendar from 'react-calendar';

import { updateDoc, getDoc, doc, deleteDoc } from 'firebase/firestore';


import {db} from '../../database/firebase'

import '../../member_LJC/css/saving.css'

import moment from 'moment';


export default function EditSaving({title, amount, memo, closeSubModal, id, handleDataUpdate}) {
    const [value, setValue] = useState(new Date());


    const [mindate, setMindate] = useState('');

    // 저금 예정일 선택 달력 클릭하면 setModal 달력 모달창 열고 닫기 관리 
    const [isCheck, setCheck] = useState(false);
    const [modal, setModal] = useState(false);


    const [ischeck2, setCheck2] = useState(true);
    const [ischeck3, setCheck3] = useState(false);
    const [clickday, setClickday] = useState('');
    const [startday, setStartday] = useState('');
    const [endday, setEndday] = useState('0000-00-00');
    const [editAmount, setEditAmount] = useState(amount);
    const [periodunit, setPeriodunit] = useState('');
    const [editTitle, setEditTitle] = useState(title);
    const [editMemo, setEditMemo] = useState(memo);

    
    // 최솟값 날짜
    // 최대값 날짜
    const [maxdate, setMaxdate] = useState('');

    // 저금 저장 목록 클릭 시 마다 모달 변함
    useEffect(() => {
      const fetchData = async () => {
        const savingRef = doc(db, 'money_saving', id);
        const savingSnap = await getDoc(savingRef);
        if (savingSnap.exists()) {
          const savingData = savingSnap.data();
          setValue(new Date());
          setClickday(savingData.clickday);
          setStartday(savingData.startday);
          setEndday(savingData.endday);
          setEditAmount(savingData.amount);
          setPeriodunit(savingData.periodunit);
          setEditTitle(savingData.title);
          setEditMemo(savingData.memo);
        }
      };
  
      fetchData();
    }, [id]);
  
    const gu = (i) => {
      let year = i.getFullYear();
      let month = ('0' + (i.getMonth() + 1)).slice(-2);
      let day = ('0' + i.getDate()).slice(-2);
      let when = `${year}-${month}-${day}`;
  
      setClickday(when);
      setCheck(false);
    };
  
    const startperiod = (i) => {
      let year = i.getFullYear();
      let month = ('0' + (i.getMonth() + 1)).slice(-2);
      let day = ('0' + i.getDate()).slice(-2);
      let when = `${year}-${month}-${day}`;
  
      setStartday(when);
      setCheck2(false);

        // 선택한 날짜 이전의 날짜를 mindate로 설정
 // setMindate(when);
    };
  
    const endperiod = (i) => {
      let year = i.getFullYear();
      let month = ('0' + (i.getMonth() + 1)).slice(-2);
      let day = ('0' + i.getDate()).slice(-2);
      let when = `${year}-${month}-${day}`;
  
      setEndday(when);
      setCheck3(false);

      //setCheck(false); // 캘린더 모달창 닫기
    };
  
    const handleHyphen = (event) => {
      const value = event.target.value.replace(/[^\d]/g, '');
      const formattedValue = new Intl.NumberFormat().format(value);
      event.target.value = formattedValue;
    };

    // 파이어스토어에 업데이트
    const handleSubmit = async (e) => {
      e.preventDefault();

      // 파이어스토어에서 해당 문서를 가져옴
      const savingRef = doc(db, 'money_saving', id);
      const savingSnap = await getDoc(savingRef);
      if (savingSnap.exists()) {
        await updateDoc(savingRef, {
            amount: editAmount,
          clickday: clickday,
          startday: clickday,
          startDate : clickday,
          endday: endday,
          memo: editMemo,
          periodunit: periodunit,
          title: editTitle,
        });
      }
  
      closeSubModal();

      // 데이터 업데이트 후 상위 컴포넌트의 fetchData 함수 호출
      handleDataUpdate();
    };
  
    const onChange = (date) => {
      setValue(date);
    };

    const deleteMoney = async() => {
      await deleteDoc(doc(db, "money_saving", id));
      handleDataUpdate();
      closeSubModal();
    }

    const handleDateSelection = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        setClickday(formattedDate);
        setCheck(false);
      };


    return (
        <div
        style={{
            position: 'fixed',
            top: '100px',
            right: '90px',
            display: 'flex',
            width: '600px',
            height: '700px',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            border: 'solid 2px black '
          }}
          >
            <h1>저금</h1>

            <form
                onSubmit={handleSubmit}
            >
            <h2>저금예정일</h2>
                <div>{clickday}
                    <button
                        type='button'
                        onClick={() => {setCheck((e) => !e); setModal(false);}}
                    >
                    {isCheck ? "닫힘" : "열림"}
                    </button>
                    {isCheck && (
                        <div className='modal-cal modal-cal2'>
                            
                            <Calendar
                                formatDay={(locale, date) => moment(date).format('D')}
                                onChange={onChange} 
                                value={value}
                                onClickDay={handleDateSelection}

                            />
                        </div>
                        
                    )}
                </div>
            
            <br />
<hr />

            <h2>기간</h2>

                {/* test 라이브러리로 기간선택 */}
                {<div>
                    {clickday}~{endday} {periodunit ? `/ ${periodunit}` : null}
                    <button
                        type="button"
                        onClick={() => {setModal((e) => !e);}}
                    >
                        {modal ? "닫힘" : "열림"}
                    </button>
                    {/* 기간선택 모달창 */}
                    {modal && (
                    <div className='saving-period'>
                        {/* 시작일 */}
                        

                        {/* 종료일 */}
                        <button
                            type='button'
                            onClick={()=>{setModal(false)}}

                        >
                        <p>종료일</p>
                        </button>
                        <div className='input_endDate'>
                                                <p>종료일</p>
                                                <Calendar 
                                                    formatDay={(locale, date) => moment(date).format('D')}
                                                    onChange={onChange} 
                                                    value={value}
                                                    onClickDay={(value, event) => {endperiod(value); setCheck3(false);}}
                                                    minDate={new Date(startday)} // startday를 최소 날짜로 설정
                                                    className='modal_calendar period'
                                                />
                                            </div>

                        {/* x닫기 버튼 */}
                        <button
                        onClick={() => {setModal((e) => !e);}}
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
                                        필수선택
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
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                    
                    />
                    
                    
                    
                </div>

            <br />
            <h2>제목</h2>
                <div>
                    <input
                        type='text'
                        required
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                    />
                </div>
                

            <br />
            <h2>메모</h2>
                <div>
                    <textarea
                        type='text'
                        
                        value={editMemo}
                        onChange={e => setEditMemo(e.target.value)}
                    />

                    
                </div>
            

            <br />
            <button type='sumbit' >수정</button><br />
            <button type='button' onClick={deleteMoney}>삭제</button>
            </form>
<hr />

        </div>
    )
}
