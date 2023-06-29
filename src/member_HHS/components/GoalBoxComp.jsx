import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import {db} from '../../database/firebase'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ProgressBar from '../../member_LJC/components/ProgressBar';

import ProgressBarCircle from './ProgressBarCircle';

import { CircularProgressbar  } from 'react-circular-progressbar';
import '../css/mypage.css'

import 'react-circular-progressbar/dist/styles.css';


export default function GoalBoxComp() {
    const [value, onChange] = useState(new Date());

    const navigate = useNavigate();
    
    const user = useSelector((state) => state.user.user);

    const [taList , setTaList] = useState([]);


    const [activeModal, setActiveModal] = useState(null);

    const [hdpercent, setHdpercent] = useState('');
    const [nowpercent, setNowpercent] = useState('');

    // 오늘 날짜
    const YYYY = String(value.getFullYear())
    const MM = String(value.getMonth()+1).padStart(2,"0")
    const DD = String(value.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}-${MM}-${DD}`



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
        <div id='goal-box'>
        <Slider {...settings}>

            {taList.map((tmp) =>
                <div>
                    <h3>{tmp.title}</h3>
                    <h3>D-{Dday(tmp.endday, new Date())}<span>까지</span></h3>
                    <h3>{tmp.amount}<span>&#8361;</span><span>모으면 돼요!</span> </h3>

                    <div style={{width:"100px", height:"100px"}}>
                      <CircularProgressbar value={60} text={`60%`} />
                    </div>

                    <img src="/img/money-bag.png" alt="money-bag" />
                    
                    <ProgressBar num={getDateDiffNOWpercent(new Date(), tmp.startday, tmp.endday)} maxNum={getDateDiffHDpercent(tmp.endday, tmp.startday)}/>
                    {console.log(getDateDiffNOWpercent(new Date(), tmp.startday, tmp.endday))}

                      <p>{tmp.endday}</p>                    
                </div>
            )}
        </Slider>
        </div>
    )
}
