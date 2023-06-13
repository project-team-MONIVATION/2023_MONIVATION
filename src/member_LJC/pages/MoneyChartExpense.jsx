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
    // 최솟값 날짜
    const [mindate, setMindate] = useState('');
    //날짜배열
    const [checkday, setCheckday] = useState('');

    // 클릭한 날짜
    const [onedayclick, setOnClickDay] = useState('');

    // 일(day )열기 닫기
    const [isCheck, setCheck] = useState(false);

    // 기간 선택 열기 닫기
    const [modal, setModal] = useState(false);
        // (기간)시작날짜
        const [ischeck2, setCheck2] = useState(true);
        // (기간) 끝난 날짜
        const [ischeck3, setCheck3] = useState(false);

    //카테고리
    const [categoryList , setCategoryList] = useState([]);
    //금액
    const [ priceList, setPriceList] = useState();
    

    useEffect(() => {
        getSavingData();
    }, [user]); // [user] 가바뀔떄마다 돈다

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
    
    // 일별
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

    const getexpensechoiseData = async (s,e) => {
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
                s,e &&
                s.getDate() < date.getDate() < e.getDate() &&
                s.getDate() < date.getMonth() < e.getMonth() &&
                s.getDate() < date.getFullYear() < e.getFullYear()
            ) {
                dataArray.push({
                ...data,
                id: doc.id,
                date: date.toLocaleDateString(),
                });
            }
        });


    }




    
    
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

            <div>
                <button>
                    <Link to="/calendar/chart/income">수입</Link>
                </button>
                <button>
                    <Link to="/calendar/chart/expense">지출</Link>
                </button>
            </div>

            {/* 일별  */}
            <button 
                onClick={() => {setCheck((e) => !e);}}
            >
                {isCheck ? "일" : "일"}
            </button>
            {isCheck && (
                <div className='modal-cal modal-cal2'>
                    <Calendar 
                        onChange={onChange} 
                        value={value}
                        onClickDay={(value, event) => {getexpenseData(value);}}
                    />
                </div>
            )}
            {/* 선택한 기간별 */}
            {<div>
                    
                    <button
                        onClick={() => {setModal((e) => !e);}}
                    >
                        {modal ? "기간선택" : "기간선택"}
                    </button>
                    {/* 기간선택 모달창 */}
                    {modal && (
                    <div className='saving-period'>
                        {/* 시작일 */}
                        <button
                            onClick={() => {setCheck2((e) => !e); setCheck(false); }}
                        >
                        <p style={{ color: ischeck2 ? "#BB363F" : "#000" }}>시작일</p>
                        </button>
                        {ischeck2 && (
                            <div className='modal-cal'>
                                <Calendar 
                                    onChange={onChange}
                                    value={value}
                                    onClickDay={(value, event) => {setCheck2(false); setCheck3(true); setMindate(value);}}
                                />
                            </div>
                        )}

                        {/* 종료일 */}
                        <button
                            onClick={() => {setCheck3((e) => !e); setCheck(false); } }
                        >
                        <p style={{ color: ischeck3 ? "#BB363F" : "#000" }}>종료일</p>
                        </button>
                        {ischeck3 && (
                            <div className='modal-cal'>
                                <Calendar 
                                    onChange={onChange} 
                                    value={value}
                                    onClickDay={(value, event) => {setCheck3(false);}}
                                    minDate={mindate}
                                />
                            </div>
                        )}

                        {/* x닫기 버튼 */}
                        <button
                        onClick={() => {setModal((e) => !e);}}
                        >
                        {modal ? "X" : "열림"}
                        </button>
                    </div>
                )}
            </div>}


            

            
            
            
            
            <Pie 
                data={data} 
                options={options} 
                width="800px" height="800px" 
            />
        </div>
    )
}
