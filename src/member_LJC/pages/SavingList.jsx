import React, { useEffect, useState, } from 'react';
import { useSelector } from 'react-redux';
import { collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import {db} from '../../database/firebase'

import '../css/saving.css'
import SavingListModifyComp from '../components/SavingListModifyComp';

export default function SavingList() {
    const [value, onChange] = useState(new Date());
    const navigate = useNavigate();
    
    const user = useSelector((state) => state.user.user);

    const [savingList , setSavingList] = useState([]);

    useEffect(() => {
        getSavingData();
    }, [user]);

    // 불러오기
    const getSavingData = async () => {
        try {
            const fmCollectionRef = collection(db, "money_saving");
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
                setSavingList(dataArray);
            }
        } catch (error) {
            console.log("실패했습니다", error);
        }
    };

    
    // 값 삭제 함
    const deleteData = async (id) => {
        // doc(db,컬렉션이름,id)로 하나의 문서를 찾을 수 있다
        await deleteDoc(doc(db, "money_saving", id));
        getSavingData()
    }
    
    
    // 기간이 만료된 저금 알림창
    const checkCondition  = (endDt,endday) =>{
        if(endDt >= endday){
            return "[완료된 저금]"
        } else {
            return ""
        }
    }

    // total값 
    // 돈 예정일, 오늘 날짜, 금액, 기간타입, 기간마지막날
    const dateCondition  = (startDt,endDt,amount,periodunit,endday) =>{

        if(endDt >= endday){
            // 오늘 날짜가 저금기간 마지막날 보다 크거나 같을때
            // 기간 마지막날 - 돈 예정일
            let btMs = endday.getTime() - startDt.getTime() ;
            let btDay = btMs / (1000*60*60*24) ;

            // 문자열을 숫자열로
            const number = parseInt(amount.replace(/,/g, ''), 10);
            let price = "";
        
            if(periodunit === 'day') {
                // 차이 일수 (btDay)
                // day 값 계산
                let differenceDay = ((btDay+1).toFixed())*number
                // 금액 원화 표시 ,넣기
                
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
            return price
        

        }else if(startDt>endDt){
            let price = 0
            return price

        }else {
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

                        {/* list수정 컴포넌트 */}
                        <SavingListModifyComp
                            tmp={tmp}
                            getSavingData={getSavingData}
                        />

                        <h2>{tmp.title}</h2>
                        <div className='period-bord'>
                            기간 {tmp.startday} ~ {tmp.endday}
                        </div>
                        <p>{periodType(tmp.periodunit)} {tmp.amount}</p>
                        <p>지정날짜{tmp.clickday}</p>
                        <p>{dateCondition(new Date(tmp.clickday),new Date(value),tmp.amount,tmp.periodunit,new Date(tmp.endday))} total</p>

                        <p>{checkCondition(new Date(value),new Date(tmp.endday))}</p>
                    </div>
                )}
            </div>
        </div>
    )
}