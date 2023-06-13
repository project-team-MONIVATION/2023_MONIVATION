import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2'; // 원하는 차트 종류를 가져오세요.

import Calendar from 'react-calendar';

import { collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import {db} from '../../database/firebase'


ChartJS.register(ArcElement, Tooltip, Legend);




export const options = {
    responsive : false,
    scale: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                }
            }
        ]
    }
}

export default function MoneyChartExpense() {

    const navigate = useNavigate();
    
    const [value, onChange] = useState(new Date());
    const user = useSelector((state) => state.user.user);

    // 오늘 날짜
    const  today = new Date

    //날짜배열
    const [checkday, setCheckday] = useState('');

    // 클릭한 날짜
    const [onedayclick, setOnClickDay] = useState('');

    //카테고리
    const [categoryList , setCategoryList] = useState([]);
    //금액
    const [ priceList, setPriceList] = useState();
    

    useEffect(() => {
        getSavingData();
    }, [user]); // [user] 가바뀔떄마다 돈다

    

    // 누르면 그날의 카테고리와 가격이 나옴
    const getexpenseData = async (i) => {
        const fmCollectionRef = collection(db, "money_expense");
        const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
        const fmQuerySnapshot = await getDocs(fmQuery);
    
        let dataArray = [];
        let newArray = [];
    
        fmQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.date;
            const date = timestamp.toDate();
        
            // 클릭한 날짜와 데이터의 날짜를 비교
            if (
                i &&
                date.getDate() === i.getDate() &&
                date.getMonth() === i.getMonth() &&
                date.getFullYear() === i.getFullYear()
            ) {
                dataArray.push({
                ...data,
                id: doc.id,
                date: date.toLocaleDateString(),
            });
            }
        });
        console.log(dataArray);
        let allcategorys = [];
        let allprice = [];
            
        for (let i=0; i<dataArray.length; i++){
            let categorys = dataArray[i].category;
            let price = dataArray[i].price;
            
            allcategorys.push(categorys)
            allprice.push(price);
        }
            setCategoryList(allcategorys);
            setPriceList(allprice);
    }

    // 지출 불러오기
    const getSavingData = async () => {
        try {
            const fmCollectionRef = collection(db, "money_expense");
            const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
            const fmQuerySnapshot = await getDocs(fmQuery);
            
            if (!user.uid) {
                navigate('/account/login');
            } else {
                let dataArray = [];
                let newArray = [];

                fmQuerySnapshot.forEach((doc) => {
                    dataArray.push({
                        ...doc.data(),
                        id: doc.id,
                    });
                });

                // console.log(checkday.getDate())
                
                // switch(checkday.getDate()){
                //     case value.getDate() : 
                // let expenseday = [];

                // for (let i=0; i<dataArray.length; i++){
                //     let day = dataArray[i].date.toDate();
                //     expenseday.push(day.getDate())
                // }
                // setCheckday(expenseday)
                
                
                        // let allcategorys = [];
                        // let allprice = [];
                        
                        // for (let i=0; i<dataArray.length; i++){
                        //     let categorys = dataArray[i].category;
                        //     let price = dataArray[i].price;
                        
                        //     allcategorys.push(categorys)
                        //     allprice.push(price);
                        // }
                        // setCategoryList(allcategorys);
                        // setPriceList(allprice);

        }
    } catch (error) {
        console.log("실패했습니다", error);
    }
};



    
    
    const data = {
        labels: categoryList,
        datasets: [
            {
                label: '# of Votes',
                data: priceList,
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
                // hoverOffset: 4,
            },
        ],
    };


    return (
        <div>
            <h1>지출</h1>
            <button onClick={getexpenseData}>테스트</button>
            <div>
                <button>
                    <Link to="/calendar/chart/income">수입</Link>
                </button>
                <button>
                    <Link to="/calendar/chart/expense">지출</Link>
                </button>
            </div>

            <div>
                <Calendar 
                    onChange={onChange} 
                    value={value}
                    onClickDay={(value, event) => {getexpenseData(value);}}
                />
            </div>
            
            
            
            <Pie 
                data={data} 
                options={options} 
                width="800px" height="800px" 
            />
        </div>
    )
}
