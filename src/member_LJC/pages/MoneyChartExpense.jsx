import React, {useEffect, useRef, useState, MouseEvent} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale,PointElement,LineElement, 
        Title, Filler,    } from 'chart.js';


import { Line, Pie, getElementAtEvent } from 'react-chartjs-2'; // 원하는 차트 종류를 가져오세요.

import Calendar from 'react-calendar'

import { collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import {db} from '../../database/firebase'




ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);



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


    

export default function MoneyChartExpense() {
    const navigate = useNavigate();
    const [value, onChange] = useState(new Date());
    const user = useSelector((state) => state.user.user);

    

    // 오늘 날짜
    const  today = new Date
    // 최솟값 날짜
    const [mindate, setMindate] = useState('');
    

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
    
    

    
    // 데이터들 카테고리,가격 나열
    function samecategory (d) {
        const dataList = d.map(({ category, price, date }) => ({
            category,
            price,
            date
        }));
        return dataList
    }

    // 중복제거,각 가격합침
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


    // 객체를 { category: "카테고리명", total: 금액 } 형태의 배열로 변환
    function transform (d) {
        const transformedArray = Object.entries(d).map(([category, total]) => ({
            category,
            total,
        }));
        return transformedArray
    }


    // 조회 누르면 각 조건에 맞는 데이터 들을 db에서 꺼내옴
    const getexpensechoiseData = async () => {
        let s = new Date(inputRef.current[0].value);
        let e = new Date(inputRef.current[1].value);

        // 12시 0분 0초를 못 담아서 하루 를 빼줘야 그 날에 대입이됨
        let startday = new Date(inputRef.current[0].value);
        startday.setDate(s.getDate() - 1);
        console.log(startday)

        const fmCollectionRef = collection(db, "money_expense");
        const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid), where('date', '>=', startday), where('date', '<=', e)) 
        
    
        let dayFilterDateList = [];
        
        
        try {
            // 전부 뽑아옴
            const fmQuerySnapshot = await getDocs(fmQuery);
            
            fmQuerySnapshot.forEach((doc) => {
                dayFilterDateList.push(doc.data())
            });


            
        
            // 배열 객체들을 카테고리 금액 만 남김
            // 중복된 카테고리 합치고 금액도 합침
            const ctgpic = transform(deduplication(samecategory(dayFilterDateList)))
            console.log(deduplication(samecategory(dayFilterDateList)))

            let allcategorys = [];
            let allprice = [];
                
            for (let i=0; i<ctgpic.length; i++){
                let categorys = ctgpic[i].category;
                let price = ctgpic[i].total;
                
                
                allcategorys.push(categorys)
                allprice.push(price);
            }
                setCategoryList(allcategorys);
                setPriceList(allprice);
                console.log(priceList)
                
                
        } 
        
        catch (error) {
            console.log('Error fetching data:', error);
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

    // 2개월 누르면 그 2개월 전 첫일 ~ 현재 월 마지막 일
    const chageDateTwoMonth = () => {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        setNowmonthfirstday(firstDay);
        setNowmonthlastday(lastDay);
    }

    // 3개월 누르면 그 3개월 전 첫일 ~ 현재 월 마지막 일
    const chageDateTreeMonth = () => {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 2, 1);
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

    

    const [Lineoptions] = useState({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
            },
    });

    const Linedata = {
        labels: categoryList,
        datasets: [
            {
                fill: true,
                label: 'Dataset 1',
                data: priceList,
                // .map((data) => data*100),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
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
                'rgba(233, 333, 333, 0.2)',
                '#55BABF',
                '#00ff80',
                '#931a1a',

                ],
                borderColor: [
                '#fff',
                
                ],
                borderWidth: 2,
                // hoverOffset: 4,
            },
        ],
    };

    

    // const Linedata = {
    //     labels,
    //     datasets: [
    //         {
    //             fill: true,
    //             label: 'Dataset 2',
    //             data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
    //             borderColor: 'rgb(53, 162, 235)',
    //             backgroundColor: 'rgba(53, 162, 235, 0.5)',
    //         },
    //         ],
    // };




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
                    <input ref={el => (inputRef.current[0] = el)}  type="text"
                        disabled
                    />
                    ~  
                    <input ref={el => (inputRef.current[1] = el)}  type="text"
                        disabled
                    />
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
                        onClickDay={(value, event) => {setOnClickDay(value); setCheck(false);}}
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
        <br />
            {/* 2개월 */}
            <button
                onClick={() => {chageDateTwoMonth()}}
            >
                2개월
            </button>
        <br />
            {/* 3개월 */}
            <button
                onClick={() => {chageDateTreeMonth()}}
            >
                3개월
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
                <br />
                        <button
                            // onClick={() => test()}
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

            <Line
                data={Linedata} 
                options={Lineoptions} 
                
            />
        </div>
    )
}
