import React, {useEffect, useRef, useState} from 'react'
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

    // 클릭한 날짜(일)
    const [onedayclick, setOnClickDay] = useState('');

    // 클릭한 날짜(기간)
    // 시작날짜
    const [startdayclick, setStartdayclick] = useState('');
    // 끝난날짜
    const [enddayclick, setEnddayclick] = useState('');

    // 클릭한 달 (현재 1개월 첫날/마지막날)
    // 첫날
    const [ nowmonthfirstday, setNowmonthfirstday] = useState('');
    // 마지막날
    const [ nowmonthlastday, setNowmonthlastday] = useState('');

        // 일(day )열기 닫기
        const [isCheck, setCheck] = useState(false);
        // (기간)시작날짜 열기 닫기
        const [ischeck2, setCheck2] = useState(false);
        // (기간) 끝난 날짜 열기 닫기
        const [ischeck3, setCheck3] = useState(false);

    //카테고리
    const [categoryList , setCategoryList] = useState([]);
    //금액
    const [ priceList, setPriceList] = useState();

    const inputRef = useRef([]);
    

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
            }
        } catch (error) {
            console.log("실패했습니다", error);
        }
    };
    
    // 일별
    // 누르면 그날의 카테고리와 가격이 나옴
    // const getexpenseData = async (i) => {
    //     const fmCollectionRef = collection(db, "money_expense");
    //     const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
    //     const fmQuerySnapshot = await getDocs(fmQuery);
    
    //     let dataArray = [];
    //     let newArray = [];
    
    //     fmQuerySnapshot.forEach((doc) => {
    //         const data = doc.data();
    //         const timestamp = data.date;
    //         const date = timestamp.toDate();
        
    //         // 클릭한 날짜와 데이터의 날짜를 비교
    //         if (
                
    //             date.getDate() === i.getDate() &&
    //             date.getMonth() === i.getMonth() &&
    //             date.getFullYear() === i.getFullYear()
    //         ) {
    //             dataArray.push({
    //             ...data,
    //             id: doc.id,
    //             date: date.toLocaleDateString(),
    //             });
    //         }
    //     });

    //     console.log(dataArray);
    //     let allcategorys = [];
    //     let allprice = [];
            
    //     for (let i=0; i<dataArray.length; i++){
    //         let categorys = dataArray[i].category;
    //         let price = dataArray[i].price;
            
    //         allcategorys.push(categorys)
    //         allprice.push(price);
    //     }
    //         setCategoryList(allcategorys);
    //         setPriceList(allprice);
    // }


    // 기간지정 비교 함수
    // 기간안에 데이터 들의 금액과 카테고리를 가져옴
    const getexpensechoiseData = async () => {
        let s = new Date(inputRef.current[0].value);
        let e = new Date(inputRef.current[1].value);
        console.log(s,e)

        if (e.getDate() === s.getDate() &&
            e.getMonth() === s.getMonth() &&
            e.getFullYear() === s.getFullYear()){
            const fmCollectionRef = collection(db, "money_expense");
            const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
            const fmQuerySnapshot = await getDocs(fmQuery);
    
            let dataArray = [];
            console.log("s=e",dataArray)
            
    
            fmQuerySnapshot.forEach((doc) => {
                const data = doc.data();
                const timestamp = data.date;
                const date = timestamp.toDate();
        
                // 클릭한 날짜와 데이터의 날짜를 비교
                if (
                    date.getDate() === s.getDate() &&
                    date.getMonth() === s.getMonth() &&
                    date.getFullYear() === s.getFullYear()
                ) {
                    dataArray.push({
                    ...data,
                    id: doc.id,
                    date: date.toLocaleDateString(),
                    });
                }
            });

        
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

        else {
            const fmCollectionRef = collection(db, "money_expense");
            const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
            const fmQuerySnapshot = await getDocs(fmQuery);
        
            let dataArray = [];
            console.log("s / e",dataArray)
            console.log(s,e)
            
        
            fmQuerySnapshot.forEach((doc) => {
                const data = doc.data();
                const timestamp = data.date;
                const date = timestamp.toDate();
                // 클릭한 날짜와 데이터의 날짜를 비교
                if (
                    s.getDate() < date.getDate() < e.getDate() &&
                    s.getMonth() < date.getMonth() < e.getMonth() &&
                    s.getFullYear() < date.getFullYear() < e.getFullYear()
                ) {
                    dataArray.push({
                    ...data,
                    id: doc.id,
                    date: date.toLocaleDateString(),
                    });
                    
                }
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
            });
        }
    }
    
    useEffect(() => {   
        handleTest()
    },[onedayclick])

    useEffect(() => {
        handleTest2()
    },[startdayclick,enddayclick])

    useEffect(() => {
        handleTest3()
    },[nowmonthfirstday,nowmonthlastday])


    const changeDate = (newDate) => {
        if(!newDate){
            newDate=new Date()
        }
        const YYYY = String(newDate.getFullYear())
        const MM = String(newDate.getMonth()+1).padStart(2,"0")
        const DD = String(newDate.getDate()).padStart(2,"0")
        const valueDate = `${YYYY}-${MM}-${DD}`
        return valueDate;
    }
    
    // 1개월 누르면 그 현재 월 첫일 ~ 현재 월 마직막 일
    const chageDateOneMonth = () => {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        setNowmonthfirstday(firstDay);
        setNowmonthlastday(lastDay);
    }

    // 클릭한 일 input value에 담기
    const handleTest = () => {
        inputRef.current[0].value = changeDate(onedayclick) 
        inputRef.current[1].value = changeDate(onedayclick)
        
    }
    // 기간으로 선택한 시작/끝 날짜 input value에 담기
    const handleTest2 = () => {
        inputRef.current[0].value = changeDate(startdayclick) 
        inputRef.current[1].value = changeDate(enddayclick)
    }

    // 현재 1개월 날짜(그 달의 1일 , 마직막 일) input value에 담기
    const handleTest3 = () => {
        inputRef.current[0].value = changeDate(nowmonthfirstday) 
        inputRef.current[1].value = changeDate(nowmonthlastday)
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
                    <input ref={el => (inputRef.current[0] = el)}  type="text"/>
                    ~  
                    <input ref={el => (inputRef.current[1] = el)}  type="text"/>
        <br />
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
                        onClickDay={(value, event) => {setOnClickDay(value);}}
                    />
                </div>
            )}

        <br />
            {/* 1개월 */}
            <button
                onClick={() => {chageDateOneMonth()}}
            >
                1개월
            </button>

            {/* 선택한 기간별 */}
            <div>

        <br />    
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
                                    onClickDay={(value, event) => {setStartdayclick(value); setCheck2(false); setCheck3(true); setMindate(value);}}
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
                                    onClickDay={(value, event) => {setEnddayclick(value); setCheck3(false);}}
                                    minDate={mindate}
                                />
                            </div>
                        )}
                <br />
                        
                
                        
                <br />
                        <button
                            onClick={() => getexpensechoiseData()}
                        >
                            조회
                        </button>
                        
                        <button
                            // onClick={() => chageDateOneMonth()}
                        >
                            test
                        </button>

                    </div>
                
            </div>


            

            
            
            
            
            <Pie 
                data={data} 
                options={options} 
                width="800px" height="800px" 
            />
        </div>
    )
}
