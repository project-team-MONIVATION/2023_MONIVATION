import React, {useEffect, useRef, useState, MouseEvent} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { Timestamp, collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import {db} from '../../database/firebase'

import '../css/moneyCalendar.css'

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
    responsive : false,
    plugins: {
        legend: {
            display: false,
        }
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



export default function SIcomp() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const inputRef = useRef([]);

    useEffect(() => {
        if(user){
            getSavingData(); 
        }
    }, [user]); 
    // [user] 가바뀔떄마다 돈다

    
    // 총 금액
    const [ptotal, setPtotal]=  useState();
    //pie 그래프 카테고리
    const [categoryList , setCategoryList] = useState();
    //pie 그래프 금액
    const [ priceList, setPriceList] = useState();

    

    const data = {
        labels: categoryList,
        datasets: [
            {
                label: '금액',
                data: priceList,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(233, 333, 333, 0.2)',
                    '#55BABF',
                    '#00ff80',
                    '#931a1a',
                ],
                borderColor: [
                    '#fff',
                ],
                borderWidth: 1,
            },
            ],
    };

    


    // 데이터들 카테고리,가격 나열
    function samecategory(d) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
            };
        
            const dataList = d.map(({ category, price, date }) => {
            const formattedDate = date
                .toDate()
                .toLocaleString('en-US', options)
                .split('/')
                .join('-');
            const [month, day, year] = formattedDate.split('-');
            return {
                category,
                price,
                date: `${year}-${month}-${day}`
            };
            });
            // console.log("date도 나옴>?",dataList)
            return dataList;
    }

    // 파이 그래프에 필요한
    // 카테고리 중복제거,각 가격합침
    function deduplication (d) {
        const result = d.reduce((acc, item) => {
            const { category, price } = item;
            if(acc[category]){
                acc[category] += price;
            } else {
                acc[category] = price;
            }
            return acc;
        },{});
        return result
    }

    // 파이 그래프에 필요한
    // 객체를 { category: "카테고리명", total: 금액 } 형태의 배열로 변환
    function transform (d) {
        const transformedArray = Object.entries(d).map(([category, total]) => ({
            category,
            total,
        }));
        return transformedArray
    }

    // 총합
    function alltotal (d) {
        let totalAmount = 0;
        for(let i = 0; i< d.length; i++) {
            totalAmount += d[i].total;
        }
        return totalAmount
    }



    const getSavingData = async () => {
        var date = new Date();

        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


        
        // console.log(user);
        // console.log("달첫 ",firstDay)
        // console.log("달막 ",lastDay)

        const fmCollectionRef = collection(db, "money_income");
        const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid), where('date', '>=', firstDay), where('date', '<=', lastDay)) 
    
        let dayFilterDateList = [];
        
        // console.log("값이 나왔냐?",dayFilterDateList)
        
        try {
            // 전부 뽑아옴
            const fmQuerySnapshot = await getDocs(fmQuery);
            
            fmQuerySnapshot.forEach((doc) => {
                dayFilterDateList.push(doc.data())
            });

            const ctgpic = transform(deduplication(samecategory(dayFilterDateList)))
            // 총 합금액
            const alltotall = alltotal(ctgpic)
            setPtotal(alltotall)

            let allcategorys = [];
            let allprice = [];
        
            for (let i=0; i<ctgpic.length; i++){
                let categorys = ctgpic[i].category;
                let price = ctgpic[i].total;
                
                allcategorys.push(categorys);
                allprice.push(price);
            }
            setCategoryList(allcategorys);
            setPriceList(allprice);
        
        }



        catch (error) {
            console.log("실패했습니다", error);
        }
    };

    
    return (
        <div id='secomp'
            className='secomp_container'
        >
            {/* 현재달 */}
            {/* 라벨 */}
                
            <div className='piegp'>
                <Doughnut 
                    data={data} 
                    options={options}
                    width="140px" height="140px"
                />
            </div>

            
        </div>
    )
}
