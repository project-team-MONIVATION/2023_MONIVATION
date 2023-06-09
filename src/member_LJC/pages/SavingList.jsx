import React, { useEffect, useState, } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, query, where, Timestamp, } from 'firebase/firestore';
import { Navigate, useNavigate } from 'react-router-dom';

import {db} from '../../database/firebase'

import '../css/saving.css'
import SavingListModifyComp from '../components/SavingListModifyComp';

export default function SavingList() {
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

    // 값삭제
    // 값 삭제 함
    const deleteData = async (id) => {
        // doc(db,컬렉션이름,id)로 하나의 문서를 찾을 수 있다
        await deleteDoc(doc(db, "money_saving", id));
        getSavingData()
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
    

    // total값 
    const dateCondition  = (startDt,endDt,amount,periodunit) =>{
        let btMs = endDt.getTime() - startDt.getTime() ;
        let btDay = btMs / (1000*60*60*24) ;
        
        // 문자열을 숫자열로
        const number = parseInt(amount.replace(/,/g, ''), 10);
        let price = "";
        if(periodunit === 'day') {
            // 차이 일수 (btDay)
            // day 값 계산
            let differenceDay = ((btDay+1).toFixed())*number
            // 금액 원화 표시 ,넣기
            console.log((btDay+1).toFixed())
            console.log(differenceDay)
            price = differenceDay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        } else if(periodunit === 'week') {
            // week값 계산
            let differenceDay = (parseInt((btDay+7).toFixed()/7))*number
            // 금액 원화 표시 ,넣기
            price = differenceDay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else if (periodunit === 'month') {
            // month값 계산
            let differenceDay = (parseInt((btDay+30).toFixed()/30))*number
            // 금액 원화 표시 ,넣기
            price = differenceDay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else if (periodunit === 'year') {
            // year값 계산
            let differenceDay = (parseInt((btDay+365).toFixed()/365))*number
            // 금액 원화 표시 ,넣기
            price = differenceDay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return price;
    }

    const periodType = (i) => {
        let wht = "";
        if(i == 'day'){
            wht = '매일'
        } else if(i == 'week'){
            wht = '매주'
        } else if(i == 'month'){
            wht = '매월'
        } else if (i == 'year'){
            wht = '매년'
        }
        return wht
    }

    // const handleIodifyClick = (e) => {
        
    // }




    // const correction = (e) => {
    //     setCorrectiontitle(e.target.value)
    //     setCorrectionstartend(e.target.value)
    //     setCorrectionperiodunit(e.target.value)
    //     setCorrectionamount(e.target.value)
    //     setCorrectionmemo(e.target.value)
    // }









    // 메모 값 업데이트
    // const updateData = async(id) => {
    //     //수정할 필드의 값을 객체형태로 넣어줌
    //     let prom = prompt('느낀점을 입력하세요',"") 

    //     await updateDoc(doc(db,"readingbooks",id), {
    //         memo : prom
    //     });
    //     getData()
    // }




    // {correctionbtn && (
    //     <div>
    //         <form>
    //             <label htmlFor="">제목</label>
    //             <input type="text"
    //                 value={tmp.title}
    //                 onChange={e => setCorrectiontitle(e.target.value)}
    //             />

    //             {/* 기간 바꾸기 시작 */}
    //                 <label htmlFor="">기간(달력포함)</label>
    //                 <input type="text"
    //                     value={setCorrectionstart(tmp.startday)}
    //                 />
    //                 ~
    //                 <input type="text"
    //                     value={tmp.endday}
    //                 />
    //                 {/* 달력버튼 */}
    //                 <button 
    //                     type='button'
    //                     onClick={() => {setModal((e) => !e);}}
    //                 >
    //                     달력버튼
    //                 </button>
    //                     {/* 기간선택 모달창 */}
    //                         {modal && (
    //                         <div className='saving-period'>
    //                             {/* 시작일 */}
    //                             <button
    //                                 type='button'
    //                                 onClick={() => {setCheck2((e) => !e); }}
    //                             >
    //                             <p style={{ color: ischeck2 ? "#BB363F" : "#000" }}>시작일</p>
    //                             </button>
    //                             {ischeck2 && (
    //                                 <div className='modal-cal'>
    //                                     <Calendar 
    //                                         onChange={onChange}
    //                                         value={value}
    //                                         onClickDay={(value, event) => {startperiod(value); setCheck2(false); setCheck3(true); setMindate(value);}}
    //                                     />
    //                                 </div>
    //                             )}

    //                             {/* 종료일 */}
    //                             <button
    //                                 type='button'
    //                                 onClick={() => {setCheck3((e) => !e);} }
    //                             >
    //                             <p style={{ color: ischeck3 ? "#BB363F" : "#000" }}>종료일</p>
    //                             </button>
    //                             {ischeck3 && (
    //                                 <div className='modal-cal'>
    //                                     <Calendar 
    //                                         onChange={onChange} 
    //                                         value={value}
    //                                         onClickDay={(value, event) => {endperiod(value); setCheck3(false);}}
    //                                         minDate={mindate}
    //                                     />
    //                                 </div>
    //                             )}
    //                             </div>
    //                         )}
    //             {/* 기간 바꾸기 끝 */}



    //             <label htmlFor="">매월,매주,매일</label>
    //             <input type="text"
    //                 value={tmp.periodunit}
    //                 onChange={e => setCorrectionperiodunit(e.target.value)}
    //             />

    //             <label htmlFor="">금액</label>
    //             <input type="text"
    //                 value={tmp.amount}
    //                 onChange={e => setCorrectionamount(e.target.value)}
    //             />

    //             <label htmlFor="">메모</label>
    //             <input type="text"
    //                 value={tmp.memo}
    //                 onChange={e => setCorrectionmemo(e.target.value)}
    //             />

    //             <button
    //                 type='sumbit'
    //             >수정값입력
    //             </button>
    //         </form>
    //     </div>
    // )}




    
    


    



    return (
        <div>
            <div>
                {savingList.map((tmp) => 
                    <div key={tmp.id} className='saving-bord'
                        class="tooltip-link" data-tooltip={tmp.memo}
                    >
                        <button
                            onClick={()=> (deleteData(tmp.id))}
                        >
                            삭제
                        </button>

                        <SavingListModifyComp
                            tmp={tmp}
                        />


                        <h2>{tmp.title}</h2>
                        <div className='period-bord'>
                            기간 {tmp.startday} ~ {tmp.endday}
                        </div>
                        <p>{periodType(tmp.periodunit)} {tmp.amount}</p>
                        <p>지정날짜{tmp.clickday}</p>
                        <p>{dateCondition(new Date(tmp.clickday),new Date(value),tmp.amount,tmp.periodunit)} total</p>
                        
                    </div>


                )}
            </div>
            
                        
        </div>
    )
}