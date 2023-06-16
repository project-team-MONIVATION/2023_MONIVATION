import React, {useEffect, useRef, useState, MouseEvent} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { Timestamp, collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import {db} from '../../database/firebase'

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
    responsive : false,
    legend: {
        align: 'bottom'  //  or 'left', 'bottom', 'right'(default)
    },
    scale: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                }
            }
        ]
    },
}



export default function StatisticsComp() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const inputRef = useRef([]);

    // useEffect(() => {
    //     getSavingData();
    // }, [user]); // [user] 가바뀔떄마다 돈다

    // 현재 달 첫날 마지막날
    const [ nowmonthfirstday, setNowmonthfirstday] = useState('');
    const [ nowmonthlastday, setNowmonthlastday] = useState('');

    

    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
            ],
    };

    const chageDateOneMonth = async () => {
        var date = new Date();

        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        

        setNowmonthfirstday(firstDay);
        setNowmonthlastday(lastDay);
    }

    console.log(nowmonthfirstday)    
    console.log(nowmonthlastday)    


    // const getSavingData = async () => {
    //     let s = nowmonthfirstday;
    //     let e = nowmonthlastday;

    //     // 12시 0분 0초를 못 담아서 하루 를 빼줘야 그 날에 대입이됨
    //     let startdayM = s;
    //     startdayM.setDate(s.getDate() - 1);
    //     console.log(startdayM)

    //     const fmCollectionRef = collection(db, "money_expense");
    //     const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid), where('date', '>=', startdayM), where('date', '<=', e)) 
        
    
    //     let dayFilterDateList = [];
        
        
    //     try {
    //         // 전부 뽑아옴
    //         const fmQuerySnapshot = await getDocs(fmQuery);
            
    //         fmQuerySnapshot.forEach((doc) => {
    //             dayFilterDateList.push(doc.data())
    //         });
    //         console.log("값이 나왔냐?",dayFilterDateList)
    //     }

    //     catch (error) {
    //         console.log("실패했습니다", error);
    //     }
    // };

    
    return (
        <div>
            통계 컴프
            {/* 현재달 */}
            {/* 라벨 */}

            <Doughnut 
                data={data} 
                options={options}
                width="200px" height="200px"
            />;
            <button
                onClick={() => {chageDateOneMonth()}}
            >
                test
            </button>
            
        </div>
    )
}
