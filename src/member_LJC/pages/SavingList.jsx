import React, { useEffect, useState, } from 'react';
import { useSelector } from 'react-redux';
import { collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import {db} from '../../database/firebase'

import Modal from 'react-modal';

// 폰트어썸
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faGear, faCoins, faDeleteLeft, faX } from "@fortawesome/free-solid-svg-icons";

import SavingListModifyComp from '../components/SavingListModifyComp';
import '../css/saving.css'

import DateDetailBox from '../../member_HHS/styleComponent/DateDetail/DateDetailBox';

export default function SavingList({setAlltmp, setModifyCompOpen}) {
    const [value, onChange] = useState(new Date());
    const navigate = useNavigate();
    
    const user = useSelector((state) => state.user.user);

    const [savingList , setSavingList] = useState([]);

    // tmp 수정 모달로 옮기기
    // const [alltmp, setAlltmp] = useState([]);
    // 수정 모달 열기/닫기
    // const [modifyCompOpen, setModifyCompOpen] = useState(false);


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

    // ModifyComp (수정 모달창)에 전달할 값
    const openModifyComp  = (tmp) => {
        setAlltmp(tmp);
        setModifyCompOpen(true);
    }
    // 모달을 닫기 위한 이벤트 핸들러 함수
    // const closeSubModal = () => {
    //     setModifyCompOpen(false);
    // };




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


    // const periodType = (i) => {
    //     let wht = "";
    //     if(i == 'day'){
    //         wht = '매일'
    //     } else if(i == 'week'){
    //         wht = '매주'
    //     } else if(i == 'month'){
    //         wht = '매월'
    //     } else if (i == 'year'){
    //         wht = '매년'
    //     }
    //     return wht
    // }


    return (
        // <DateDetailBox>
        <div>
            <div id='savinglist_container' 
                className='content'>
                <h1 className='title'>저금내역</h1>
                <div className='list_container scrollbar'>
                    {savingList.map((tmp) => 
                        <div key={tmp.id} 
                            className='tooltip-link'
                            data-tooltip={tmp.memo}
                        >
                            <div className='top_wrap'>
                                <div className='top_title'>
                                    {tmp.title}
                                </div>
                                <div className='top_btns'>
                                    {/* 수정버튼 */}
                                    <button
                                        key={tmp.id}
                                        type='button'
                                        onClick={() => {openModifyComp(tmp)}}
                                        className='top_listchange'
                                        >
                                        <FontAwesomeIcon icon={faGear} size="sm"/>
                                    </button>

                                    {/* 삭제버튼 */}
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
                                        {tmp.startday} ~ {tmp.endday}
                                    </div>
                                </div>

                                <div className='middle_select_price'>
                                    <div className='periodunit_letter'>
                                        {tmp.periodunit}
                                    </div>
                                    {tmp.amount}₩
                                </div>
                                <div className='middle_total_price'>
                                    <div className='total_letter'>
                                        Total
                                    </div>
                                    <div className='total_price'>
                                        {dateCondition(new Date(tmp.clickday),new Date(value),tmp.amount,tmp.periodunit,new Date(tmp.endday)) ? dateCondition(new Date(tmp.clickday),new Date(value),tmp.amount,tmp.periodunit,new Date(tmp.endday)) : 0}
                                        ₩
                                    </div>
                                </div>
                                
                            </div>
                            
                            
                            
                            
                        </div>
                    )}
                </div>
            </div>
            <div>
                {/* {modifyCompOpen && (
                    <SavingListModifyComp
                        tmp={alltmp}
                        getSavingData={getSavingData}
                        closeSubModal = {closeSubModal}
                    />
                )} */}
            </div>
        </div>
        // </DateDetailBox>
    )



}