import React, { useState, } from 'react';
import Calendar from 'react-calendar';
import {  doc,  updateDoc, } from 'firebase/firestore';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faGear, faCoins } from "@fortawesome/free-solid-svg-icons";

import EditForm from '../../member_HHS/styleComponent/DateDetail/EditForm';

import {db} from '../../database/firebase'

import { SelectDate, SelectPeriod } from '../../member_PCH/features/IconInModal';
import CloseBtn from '../../member_HHS/styleComponent/DateDetail/CloseBtn';
// import '../css/saving.css'
import '../css/savingList.css'



export default function SavingListModifyComp({tmp, getSavingData, closeSubModal}) {
    

    const [open, setOpen] = useState(false);
    const [value, onChange] = useState(new Date());

    // 열기 닫기
        const [showCal, setCheck] = useState(false);

        const [modal, setModal] = useState(false);

        const [showPeriod, setShowPeriod] = useState(false);

        // (기간)시작날짜
        const [ischeck2, setCheck2] = useState(true);
        // (기간) 끝난 날짜
        const [ischeck3, setCheck3] = useState(false);

        const [mindate, setMindate] = useState('');

    
    

    // 수정된 값들
    const [correctiontitle, setCorrectiontitle] = useState(tmp.title);
    const [correctionperiodunit, setCorrectionperiodunit] = useState(tmp.periodunit);
    const [correctionclickday, setCorrectionclickday] = useState(tmp.clickday)
    const [correctionstart, setCorrectionstart] = useState(tmp.startday);
    const [correctionend, setCorrectionend] = useState(tmp.endday);
    const [correctionamount, setCorrectionamount] = useState(tmp.amount);
    const [correctionmemo, setCorrectionmemo] = useState(tmp.memo);

    
    // (저금예정일 선택)클릭한 날짜
    function gu (i) {
        let year = i.getFullYear()
        let month =  ('0' + (i.getMonth() + 1)).slice(-2);
        let day = ('0' + (i.getDate())).slice(-2);
        // 누른 날짜 yyyy-mm-dd 로 변환하기
        let when = `${year}-${month}-${day}`

        setCorrectionclickday(when)
        setCheck(false)
    }

    // (기간)시작날짜 
    function startperiod (i) {
        let year = i.getFullYear()
        let month =  ('0' + (i.getMonth() + 1)).slice(-2);
        let day = ('0' + (i.getDate())).slice(-2);
        // 누른 날짜 yyyy-mm-dd 로 변환하기
        let when = `${year}-${month}-${day}`

    
        setCorrectionstart(when)
        setCheck2(false)
    }

    // (기간)끝 날짜
    function endperiod (i) {
        let year = i.getFullYear()
        let month =  ('0' + (i.getMonth() + 1)).slice(-2);
        let day = ('0' + (i.getDate())).slice(-2);
        // 누른 날짜 yyyy-mm-dd 로 변환하기
        let when = `${year}-${month}-${day}`

    
        setCorrectionend(when)
        setCheck3(false)
    }

    // 금액 ,표시 ex1,000,000
    const handleHyphen = (event) => {
        const value = event.target.value.replace(/[^\d]/g, ''); // 숫자 이외의 문자 제거
        const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
        event.target.value = formattedValue;
    };

    //값 업데이트
    const updateData = async(id) => {
        console.log(id)
        console.log("수정됨?")

        await updateDoc(doc(db,"money_saving",id), {
            title : correctiontitle,
            clickday : correctionclickday,
            periodunit : correctionperiodunit,
            startday : correctionstart,
            endday : correctionend,
            amount : correctionamount,
            memo : correctionmemo
        });
        getSavingData();
        closeSubModal();
    }

    /** 모달창 닫기/수정/삭제 */
    // 수정 모달창 닫기
    const handleClose = () => {
        closeSubModal();
    };  



    return (
        // <EditForm>
            <div id='modi'
                className='content'
            >
                <CloseBtn
                    type = "button"
                    onClick = { handleClose }
                    style= {{
                        marginBottom:"-0px"
                    }}
                >
                    X
                </CloseBtn>
                <h1 className='saving'>저금수정</h1>
        
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateData(tmp.id);
                    // setOpen(false)
                    }
                }
                id='input_form'
            >
                <div className='input_content'>
                            <div className='date'>
                                <p>저금예정일</p>
                                <div className='input_box'>
                                    <span>{correctionclickday}</span>
                                    <button
                                        onClick={() => {setCheck((e) => !e); setModal(false);}}
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
                                                onClick={()=>{setCheck(false)}}
                                                className='close_btn'
                                            >
                                                X
                                            </button>
                                            <Calendar 
                                                onChange={onChange} 
                                                value={value}
                                                onClickDay={(value, event) => gu(value)}
                                                className='modal_calendar'
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* 기간 바꾸기 시작 */}
                            <div className='period'>
                                <p>기간</p>

                                <div className='input_box'>
                                    <span>{correctionstart} ~ {correctionend} </span>
                                    {/* 달력버튼 */}
                                    <button 
                                        type='button'
                                        onClick={() => {setModal((e) => !e);}}
                                        >
                                        <SelectPeriod showPeriod={showPeriod}/>
                                    </button>
                                </div>
                                <div className='period_modal'>
                                {/* 기간선택 모달창 */}
                                        {modal && (
                                        <div className='input_period'>
                                            {/* 종료일 */}
                                            <button
                                                type='button'
                                                onClick={() => {setModal((e) => !e);} }
                                                className='close_btn'
                                            >
                                                X
                                            </button>
                                            <div className='flex'>
                                                <div className='input_endDate'>
                                                    <p>종료일</p>
                                                    <Calendar 
                                                        onChange={onChange} 
                                                        value={value}
                                                        onClickDay={(value, event) => {endperiod(value); setCheck3(false);}}
                                                        minDate={new Date()}
                                                        className='modal_calendar period'
                                                    />
                                                </div>
                                                
                                                <div className='input_cycle'>
                                                    <p>반복주기</p>
                                                    <div className='select'>
                                                        <select 
                                                            name='cycle'
                                                            value={correctionperiodunit}
                                                            onChange={(e) => setCorrectionperiodunit(e.target.value)}
                                                            className={ correctionperiodunit !== null ? "active" : ""}
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
                                                    {/* <button
                                                    type='button' 
                                                    onClick={()=>{setCorrectionperiodunit(false)}}
                                                    disabled={!endday || !periodunit}
                                                    className= {!endday || !periodunit ? "disabled" : ""}
                                                    >
                                                        입력
                                                    </button> */}
                                                    </div>
                            
                                            </div>
                                        </div>
                                )}
                                </div>
                            </div>
        
        
                            <div className='price'>
                                <p>금액</p>
                                <div className='input_box'>
                                <input 
                                    className='input_price'
                                    type="text"
                                    required
                                    onInput={handleHyphen}
                                    value={correctionamount}
                                    onChange={e => setCorrectionamount(e.target.value)}
                                />
                                <span className='won'>₩</span>
                                </div>
                            </div>
        
                            <div className='title'>
                                <p>제목</p>
                                <div className='input_box'>
                                    <input
                                        className='input_price' 
                                        type="text"
                                        required
                                        value={correctiontitle}
                                        onChange={(e) => setCorrectiontitle(e.target.value)}
                                    />
                                </div>
                            </div>
                                            
    
                            <div className='memo'>
                                <p>메모</p>
                                <div>
                                <textarea 
                                    type="text"
                                    value={correctionmemo}
                                    onChange={e => setCorrectionmemo(e.target.value)}
                                />
                                </div>
                            </div>
                        </div>
        
                                            
                            <button
                                type='sumbit'
                                className='submit_btn'
                            >입력
                            </button>
                        
                    {/* )} */}
            </form>
            </div>
        // </EditForm>
    )
}
