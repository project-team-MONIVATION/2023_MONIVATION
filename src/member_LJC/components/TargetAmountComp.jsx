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

export default function TargetAmountComp() {
    const [value, onChange] = useState(new Date());

    const navigate = useNavigate();
    
    const user = useSelector((state) => state.user.user);

    const [taList , setTaList] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [activeModal, setActiveModal] = useState(null);

    const [hdpercent, setHdpercent] = useState('');
    const [nowpercent, setNowpercent] = useState('');

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

    // useEffect(() => {
    //     getDateDiffHDpercent();
    //     getDateDiffNOWpercent();
    // }, [taList]);
    
    // const getDateDiffHDpercent = () => {
    //     // 현재 상태 값을 기반으로 hdpercent 값을 계산하는 로직을 이곳으로 이동합니다.
    //     const date1 = new Date(taList[0]?.endday);
    //     const date2 = new Date(taList[0]?.startday);
    //     const diffDate = date1.getTime() - date2.getTime();
    //     const result = Math.abs(diffDate / (1000 * 60 * 60 * 24));
    //     setHdpercent(result);
    // };
    
    // const getDateDiffNOWpercent = () => {
    //     // 현재 상태 값을 기반으로 nowpercent 값을 계산하는 로직을 이곳으로 이동합니다.
    //     const date1 = new Date();
    //     const date2 = new Date(taList[0]?.startday);
    //     const diffDate = date1.getTime() - date2.getTime();
    //     const result = Math.abs(diffDate / (1000 * 60 * 60 * 24));
    //     setNowpercent(result < 0 ? 0 : result);
    // };


    const getDateDiffHDpercent = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        
        const diffDate = date1.getTime() - date2.getTime();
        
        const result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
        console.log("백퍼샌트값",result)
        return result
    }

    // 오늘 날짜, 시작날짜 , 끝나는 날짜
    const getDateDiffNOWpercent = (d1, d2, d3) => {
        const date1 = d1
        const date2 = new Date(d2);
        const date3 = new Date(d3);
        
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

    return (
        <div>
            목표금액
            <br />

            
            {/* 모달로 */}
            {/* 제목 */}
            {/* 기간 */}
            {/* 금액 */}
            <button onClick={()=>{
                setModalIsOpen(true);
                openModal(1);
                }}>
                추가
            </button>
            {
                activeModal === 1 && (
                    <Modal isOpen={modalIsOpen}>
                    <div>
                        <h3>목표금액 추가 모달창</h3>
                        <button onClick={()=>setModalIsOpen(false)}>취소</button>
                        <TargetAmountInputComp setModalIsOpen={setModalIsOpen}/>
                    </div>
                    </Modal>
                )
            }

            {/* 모달로 리스트로 쫙 나오게 */}
            {/* 제목 */}
            {/* 기간 */}
            {/* 금액 */}
            {/* 삭제 */}
            <button onClick={()=>{
                setModalIsOpen(true);
                openModal(2);
                }}>
                변경(리스트)
            </button>
            {
                activeModal === 2 && (
                    <Modal isOpen={modalIsOpen}>
                    <div>
                        <h3>목표금액 수정,리스트 모달창</h3>
                        <button onClick={()=>setModalIsOpen(false)}>취소</button>
                        <TargetAmonutListComp setModalIsOpen={setModalIsOpen}/>
                    </div>
                    </Modal>
                )
            }

            {/* 슬라이드 */}
            
        <Slider {...settings}>

            {taList.map((tmp) =>
                <div>
                    <h3>{tmp.title}</h3>
                    <h3>{tmp.amount}</h3>
                    <h3>D-{Dday(tmp.endday, new Date())}</h3>
                    
                    
                    <ProgressBar num={getDateDiffNOWpercent(new Date(), tmp.startday, tmp.endday)} maxNum={getDateDiffHDpercent(tmp.endday, tmp.startday)}/>
                    {console.log(getDateDiffNOWpercent(new Date(), tmp.startday, tmp.endday))}
                </div>
            )}

            
            
        </Slider>
        </div>
    )
}
