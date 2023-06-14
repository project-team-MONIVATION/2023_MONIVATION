import React, { useEffect, useState, } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, query, where, Timestamp, } from 'firebase/firestore';
import { Navigate, useNavigate } from 'react-router-dom';

import {db} from '../../database/firebase'

import '../css/saving.css'

export default function SavingListModify() {

    const [open, setOpen] = useState(false);
    const [value, onChange] = useState(new Date());
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    const [savingList , setSavingList] = useState([]);

    // 수정버튼 열기닫기
    const [correctionbtn, setCorrectionbtn] =useState(false);

    // 열기 닫기
        

        const [modal, setModal] = useState(false);

        // (기간)시작날짜
        const [ischeck2, setCheck2] = useState(true);
        // (기간) 끝난 날짜
        const [ischeck3, setCheck3] = useState(false);

        const [mindate, setMindate] = useState('');

    //기본 start날짜
    

    // 수정된 값들
    const [correctiontitle, setCorrectiontitle] = useState('');
    const [correctionperiodunit, setCorrectionperiodunit] = useState('');
    const [correctionstart, setCorrectionstart] = useState('');
    const [correctionend, setCorrectionend] = useState('');
    const [correctionamount, setCorrectionamount] = useState('');
    const [correctionmemo, setCorrectionmemo] = useState('');

    useEffect(() => {
        getSavingData();
    }, [user]);

    // 불러오기
    const getSavingData = async () => {
        try {
            const fmCollectionRef = collection(db, "money_saving");
            const fmQuery = query(fmCollectionRef, where('user', '==', user.uid));
            const fmQuerySnapshot = await getDocs(fmQuery);

            if (fmQuerySnapshot.empty) {
                navigate('/account/login');
            } else {
                let dataArray = [];
                fmQuerySnapshot.forEach((doc) => {
                    dataArray.push({
                    ...doc.data(),
                    id: doc.id,
                });
                });
                setSavingList(dataArray);
            }
        } catch (error) {
            console.log("실패했습니다", error);
        }
    };

    return (

        <div>
            <form
            >
                <div>
                    <button
                        type='button'
                        onClick={() => {setOpen((e) => !e);}}
                    >
                    수정임티
                    </button>
                    {open && (
                        <div>
                            <label htmlFor="">제목</label>
                            <input type="text"
                                onChange={setCorrectiontitle}
                            />

                            {/* 기간 바꾸기 시작 */}
                                <label htmlFor="">기간(달력포함)</label>
                                <input type="text"
                                    
                                />
                                ~
                                <input type="text"
                                    
                                />
                                {/* 달력버튼 */}
                                <button 
                                    type='button'
                                    onClick={() => {setModal((e) => !e);}}
                                >
                                    달력버튼
                                </button>
                                {/* 기간선택 모달창 */}
                                        {modal && (
                                        <div className='saving-period'>
                                            {/* 시작일 */}
                                            <button
                                                type='button'
                                                onClick={() => {setCheck2((e) => !e); }}
                                            >
                                            <p style={{ color: ischeck2 ? "#BB363F" : "#000" }}>시작일</p>
                                            </button>
                                            {ischeck2 && (
                                                <div className='modal-cal'>
                                                    <Calendar 
                                                        onChange={onChange}
                                                        value={value}
                                                        onClickDay={(value, event) => {setCheck2(false); setCheck3(true); setMindate(value);}}
                                                    />
                                                </div>
                                            )}

                                            {/* 종료일 */}
                                            <button
                                                type='button'
                                                onClick={() => {setCheck3((e) => !e);} }
                                            >
                                            <p style={{ color: ischeck3 ? "#BB363F" : "#000" }}>종료일</p>
                                            </button>
                                            {ischeck3 && (
                                                <div className='modal-cal'>
                                                    <Calendar 
                                                        onChange={onChange} 
                                                        value={value}
                                                        onClickDay={(value, event) => {setCheck3(false);}}
                                                        minDate={mindate}
                                                    />
                                                </div>
                                            )}
                                            </div>
                                        )}
                            {/* 기간 바꾸기 끝 */}



                            <label htmlFor="">매월,매주,매일</label>
                            <input type="text"
                                
                                onChange={e => setCorrectionperiodunit(e.target.value)}
                            />

                            <label htmlFor="">금액</label>
                            <input type="text"
                                
                                onChange={e => setCorrectionamount(e.target.value)}
                            />

                            <label htmlFor="">메모</label>
                            <input type="text"
                                
                                onChange={e => setCorrectionmemo(e.target.value)}
                            />

                            <button
                                type='sumbit'
                            >수정값입력
                            </button>

                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}
