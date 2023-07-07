import React, { useEffect, useState, } from 'react';
import { useSelector } from 'react-redux';
import { collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import {db} from '../../database/firebase'

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
                        <button
                            onClick={()=> (deleteData(tmp.id))}
                        >
                            삭제
                        </button>


                        <h2>{tmp.title}</h2>
                        <p>{tmp.startday}~{tmp.endday}</p>
                        <p>{tmp.amount}</p>
                        



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
