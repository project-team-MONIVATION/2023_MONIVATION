import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import {db} from '../../database/firebase'

import Calendar from 'react-calendar';
import styled from 'styled-components';
import Modal from 'react-modal';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import TargetAmountInputComp from './TargetAmountInputComp';
import TargetAmonutListComp from './TargetAmonutListComp';
import ProgressBar from './ProgressBar';

// 폰트어썸
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faGear, faCoins } from "@fortawesome/free-solid-svg-icons";

import '../css/moneyCalendar.css'

export default function TargetAmountComp() {
    const [value, onChange] = useState(new Date());

    const navigate = useNavigate();
    
    const user = useSelector((state) => state.user.user);

    const [taList , setTaList] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [activeModal, setActiveModal] = useState(null);

    

    

    // 오늘 날짜
    const YYYY = String(value.getFullYear())
    const MM = String(value.getMonth()+1).padStart(2,"0")
    const DD = String(value.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}-${MM}-${DD}`

    

    const openModal = (modalId) => {
        setActiveModal(modalId);
    };

    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
    };

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
                
            }
        } catch (error) {
            console.log("실패했습니다", error);
        }
    };



    const getDateDiffHDpercent = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        
        const diffDate = date1.getTime() - date2.getTime();
        
        const result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
        
        
        return result
    }
    

    // 오늘 날짜, 시작날짜 , 끝나는 날짜
    const getDateDiffNOWpercent = (d1, d2, d3) => {
        const date1 = d1
        const date2 = new Date(d2);
        const date3 = new Date(d3);
        console.log("dgsdga", date1,date2,date3)
        
        const diffDate = date1.getTime() - date2.getTime();
        const hdpercent = date3.getTime() - date2.getTime();

        let result = "";

        if(diffDate < 0){
            const diffDate = 0
            result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
            
        } else if (hdpercent < diffDate){
            const diffDate = hdpercent
            result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일

        } else {
            result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
        }
        
        return result
    }
    

    const Dday = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = d2;
        
        const diffDate = date1.getTime() - date2.getTime();
        
        let reasult = "";

        if(diffDate < 0) {
            const diffDate = 0
            reasult = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
        } else {
            reasult = Math.abs(diffDate / (1000 * 60 * 60 * 24)).toFixed(0); // 밀리세컨 * 초 * 분 * 시 = 일
        }

        console.log("d-day",reasult)

        
        
        return reasult
    }

    

    const dealt = (d1, d2) => { 
        let maxnum = getDateDiffHDpercent(d2, d1);
        let num = getDateDiffNOWpercent(new Date(), d1, d2)
        console.log("몇필셀?" ,Math.floor((num / maxnum) * 100))
        return Math.floor((num / maxnum) * 100); 
    }


    return (
        <div>
        {/* 슬라이드 */}
        <Slider {...settings}>

            {taList.map((tmp) =>
                <div id='target_A'
                    className='targetA_component'
                >
                    <div className='targetA_list'>
                        <div className='A_title'>{tmp.title}</div>
                        <div className='A_amount'>{tmp.amount}</div>
                    </div>
                    
                    <div className='targetA_bar'>
                        <div
                            className='A_bar_icon'
                            style={{
                                // width: '60px',
                                // height: '40px',
                                // marginRight: "1px",
                                // backgroundColor: '#735BF3',
                                transform: `translateX(${dealt(tmp.startday, tmp.endday)*0.9}%)`,
                                transition : 'all 0.3s',
                                // borderRadius: '15px'
                            }}
                        >
                                D-{Dday(tmp.endday, new Date())}&nbsp;  
                                <FontAwesomeIcon icon={faCoins}/>
                        </div>
                        <div 
                            style={{width : "100%", 
                            // position : "relative" 
                        }}
                        >
                            <ProgressBar num={getDateDiffNOWpercent(new Date(), tmp.startday, tmp.endday)} maxNum={getDateDiffHDpercent(tmp.endday, tmp.startday)}/>
                            {/* <div style={{position : "absolute", textAlign : "center"}}>
                            </div> */}
                            {console.log("num",getDateDiffNOWpercent(new Date(), tmp.startday, tmp.endday))}
                            {console.log("max",getDateDiffHDpercent(tmp.endday, tmp.startday))}

                        </div>
                    </div>
                </div>
            )}

            
            
        </Slider>
        </div>
    )
}
