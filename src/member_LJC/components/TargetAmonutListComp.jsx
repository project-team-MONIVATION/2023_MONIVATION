import React, { useEffect, useState, } from 'react';
import { useSelector } from 'react-redux';
import { collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import {db} from '../../database/firebase'

// 폰트어썸
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faGear, faCoins, faDeleteLeft, faX } from "@fortawesome/free-solid-svg-icons";

import TargetAmountModifyComp from './TargetAmountModifyComp';
import '../css/saving.css'

export default function TargetAmonutListComp() {
    const navigate = useNavigate();
    
    const user = useSelector((state) => state.user.user);

    const [taList , setTaList] = useState([]);

    useEffect(() => {
        getTargetAmountData();
    }, [user]);

    // 불러오기
    const getTargetAmountData = async () => {
        try {
            const fmCollectionRef = collection(db, "money_target_amount");
            const fmQuery = query(fmCollectionRef, where('user', '==', user.uid));
            const fmQuerySnapshot = await getDocs(fmQuery);
            
        
            if (!user.uid) {
                navigate('/account/login');
            } else {
                let dataArray = [];
                fmQuerySnapshot.forEach((doc) => {
                    dataArray.push({
                    ...doc.data(),
                    id: doc.id,
                });
                });
                setTaList(dataArray);
                console.log(dataArray)
            }
        } catch (error) {
            console.log("실패했습니다", error);
        }
    };
    

    // 값 삭제 함
    const deleteData = async (id) => {
        // doc(db,컬렉션이름,id)로 하나의 문서를 찾을 수 있다
        await deleteDoc(doc(db, "money_target_amount", id));
        getTargetAmountData()
    }




    return (
        <div>
            <div id='savinglist_container' 
                className='content'>
                <h1 className='title'>목표금액내역</h1>
                <div className='list_container scrollbar'>
                {taList.map((tmp) =>
                    <div 
                        key={tmp.id} 
                        className='tooltip-link'
                        data-tooltip={tmp.memo}
                    >   
                        <div className='top_wrap'>
                            <div className='top_title'>
                                {tmp.title}
                            </div>
                            <div className='top_btns'>
                                <button
                                    onClick={()=> (deleteData(tmp.id))}
                                    className='top_listdelete'
                                >
                                    <FontAwesomeIcon icon={faX} size="sm"/>
                                </button>
                            </div>
                        </div>

                        <div className='middle_wrap'>
                            <div className='middle_period'>
                                <div className='period_content'>
                                    기간
                                </div>
                                <div className='period_date'>
                                    {tmp.startday}~{tmp.endday}
                                </div>
                            </div>
                        

                            <div className='middle_total_price'>
                                <div className='total_letter'>
                                    TargetAmount
                                </div>
                                <div className='total_price'>
                                    {tmp.amount}₩
                                </div>
                            </div>
                        </div>
                        



                        {/* list수정 컴포넌트 */}
                        {/* <TargetAmountModifyComp
                            tmp={tmp}
                            getTargetAmountData={getTargetAmountData}
                        /> */}
                    </div>
                )}
            </div>
        </div>
        </div>
    )
}
