import React, {useEffect, useRef, useState, MouseEvent} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale,PointElement,LineElement, 
        Title, Filler,    } from 'chart.js';
        
import { Line, Pie, getElementAtEvent } from 'react-chartjs-2'; // 원하는 차트 종류를 가져오세요.

import Calendar from 'react-calendar'

import { Timestamp, collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import {db} from '../../database/firebase'

import '../css/moneyChart.css'
import '../css/select.css';

import SelcectComp from '../components/SelcectComp';
import { SelectDate } from '../../member_PCH/features/IconInModal';




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
    responsive : true,
    plugins: {
        legend: {
            display: true,
            align: "center",
            position: "bottom",
            fullSize: true,
            labels:{
                boxHeight: 100,
                padding: 30,
                usePointStyle: true,
                font: {
                    size: 12,
                    lineHeight : 3
                }
            }
            
        },
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

export const lineoptions = {
    // responsive 속성을 false로 지정한다.
    responsive: true,
    scales: {
        yAxes: [
            {
            ticks: {
                beginAtZero: true,
            },
            },
        ],
        },
    };


    

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

    // 한번반복(처음 시작했을때 useEffect 반복)
    const [checked, setChecked] = useState(false);

        // 일(day )열기 닫기
        const [isCheck, setCheck] = useState(false);
        // (기간)시작날짜 열기 닫기
        const [ischeck2, setCheck2] = useState(false);
        // (기간) 끝난 날짜 열기 닫기
        const [ischeck3, setCheck3] = useState(false);

    //pie 그래프 카테고리
    const [categoryList , setCategoryList] = useState();
    //pie 그래프 금액
    const [ priceList, setPriceList] = useState();

    // line 그래프 카테고리
    const [linecategoryList, setLinecategoryList] = useState();
    // line 그래프 금액
    const [linepriceList, setLinepriceList] = useState();
    // line 그래프 날짜
    const [linedateList, setLinedateList] = useState();

    // 기간에 맞는 들어있는
        // 총 금액
        const [ptotal, setPtotal]=  useState();

        // 날짜
        const [pdate, setPdate] = useState();

        // 카테고리
        const [pcategory, setPcategory] =useState();

        // 각 카테고리의 금액
        const [pamount, setPamount] = useState();

    const [list, setList] = useState([]);


    const inputRef = useRef([]);
    

    // useEffect(() => {
    //     getSavingData();
    // }, [user]); // [user] 가바뀔떄마다 돈다

    // // 지출 불러오기
    // const getSavingData = async () => {
    //     try {
    //         const fmCollectionRef = collection(db, "money_expense");
    //         const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
    //         const fmQuerySnapshot = await getDocs(fmQuery);
            
    //         if (!user.uid) {
    //             navigate('/account/login');
    //         } else {
    //             let dataArray = [];
    //             let newArray = [];

    //             fmQuerySnapshot.forEach((doc) => {
    //                 dataArray.push({
    //                     ...doc.data(),
    //                     id: doc.id,
    //                 });
    //             });
    //         }
    //     } catch (error) {
    //         console.log("실패했습니다", error);
    //     }
    // };
    
    

    
    // 데이터들 카테고리,가격 나열
    function samecategory(d) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
            };
        
            const dataList = d.map(({ category, price, date, memo }) => {
            const formattedDate = date
                .toDate()
                .toLocaleString('en-US', options)
                .split('/')
                .join('-');
            const [month, day, year] = formattedDate.split('-');
            return {
                category,
                price,
                date: `${year}-${month}-${day}`,
                memo,
            };
            });
        
            return dataList;
    }


    // 라인그래프
    //날짜 중복제거, 각 가격합침
    function linededuplication (d) {
        let checkdifferntdate = "date"

        
        for(let i=0; i<d.length-1; i++ ){
            if(d[i].date.slice(5,7) !== d[i+1].date.slice(5,7)){
                checkdifferntdate = "month"
                break
            }
        }
        for(let i=0; i<d.length-1; i++ ){
            if(d[i].date.slice(0,4) !== d[i+1].date.slice(0,4)){
                checkdifferntdate = "year"
                break
            }
        }
        
        console.log("dif",checkdifferntdate)
        
        
        if(checkdifferntdate == "date"){
            const result = {};
            d.forEach(obj => {
                const date = obj.date.slice(0,15); // 날짜 부분만 추출하여 비교
    
                console.log(date)
    
                if(result[date]){
                    result[date].price += obj.price;
                } else{
                    result[date] = {
                        price: obj.price,
                        date: obj.date
                    };
                }
            });
    
            const finalResult = Object.values(result).map(obj => {
                return {
                    price: obj.price,
                    date: obj.date
                };
            });
    
            return finalResult

        }else if (checkdifferntdate == "month"){

            const result = {};
            d.forEach(obj => {
                const date = obj.date.slice(5,7); // 달 부분만 추출하여 비교
    
                console.log("달",date)
    
                if(result[date]){
                    result[date].price += obj.price;
                } else{
                    result[date] = {
                        price: obj.price,
                        date: obj.date.slice(0,7)
                    };
                }
            });
    
            const finalResult = Object.values(result).map(obj => {
                return {
                    price: obj.price,
                    date: obj.date
                };
            });
            return finalResult

        }else if (checkdifferntdate == "year"){
            const result = {};
            d.forEach(obj => {
                const date = obj.date.slice(0,4); // 달 부분만 추출하여 비교
    
                console.log("년",date)
    
                if(result[date]){
                    result[date].price += obj.price;
                } else{
                    result[date] = {
                        price: obj.price,
                        date: obj.date.slice(0,4)
                    };
                }
            });
    
            const finalResult = Object.values(result).map(obj => {
                return {
                    price: obj.price,
                    date: obj.date
                };
            });
            return finalResult
        }
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
    
    // 총합
    function alltotal (d) {
        let totalAmount = 0;
        for(let i = 0; i< d.length; i++) {
            totalAmount += d[i].total;
        }
        return totalAmount
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

    // 조회 버튼
    // 조회 누르면 각 조건에 맞는 데이터 들을 db에서 꺼내옴
    const getexpensechoiseData = async () => {
        let s = new Date(inputRef.current[0].value);
        let e = new Date(inputRef.current[1].value);

        // 12시 0분 0초를 못 담아서 하루 를 빼줘야 그 날에 대입이됨
        let startday = new Date(inputRef.current[0].value);
        startday.setDate(s.getDate() - 1);
        


        const fmCollectionRef = collection(db, "money_expense");
        const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid), where('date', '>=', startday), where('date', '<=', e)) 
        
    
        let dayFilterDateList = [];
        
        
        try {
            // 전부 뽑아옴
            const fmQuerySnapshot = await getDocs(fmQuery);
            
            fmQuerySnapshot.forEach((doc) => {
                dayFilterDateList.push(doc.data())
            });

            // 파이 그래프
            // 중복된 카테고리 합침 
            // 중복된 카테고리의 금액도 합침
            const ctgpic = transform(deduplication(samecategory(dayFilterDateList)))
            // console.log(dayFilterDateList)

            // 선 그래프
            // 중복된 날짜 합침
            // 중복된 날짜의 금액 합침
            const ctpicdt = linededuplication(samecategory(dayFilterDateList))
            // console.log("라인 중복제거전",samecategory(dayFilterDateList))
            // console.log("라인 중복제거후",ctpicdt)

            const ctpicdtList = samecategory(dayFilterDateList)
            setList(ctpicdtList)
            // console.log("ctpicdtList 데이트덜",ctpicdtList)
            // console.log("라인 카테고리,가격,날짜",ctpicdt)

            
            // console.log('라인그래프 가격,날짜 가격합산된',linededuplication(samecategory(dayFilterDateList)))
            // console.log('중복제거',deduplication(samecategory(dayFilterDateList)))
            // console.log('배열로 변경',ctgpic)

            // 총 합금액
            const alltotall = alltotal(ctgpic)
            setPtotal(alltotall)

            
            // 받은 배열을 pie그래프 state로 뿌려주기
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
            

            // 받은 배열을 line그래프 state로 뿌려주기
            let lineallprice = [];
            let dates= [];

            for(let i=0; i<ctpicdt.length; i++){
                
                let price = ctpicdt[i].price;
                let date = ctpicdt[i].date;
                
                
                lineallprice.push(price);
                dates.push(date);
            }
            
            setLinepriceList(lineallprice);
            setLinedateList(dates);

            // 달이 다른게 있으면 월 라인으로 넣기




            // 년이 다른게 있으면 년 라인으로 넣기

            // 날짜 카테고리 가격 넣기
            let Pprice = [];
            let Pdates= [];
            let Pcategory= [];

            for(let i=0; i<ctpicdtList.length; i++){
                
                let price = ctpicdtList[i].price;
                let date = ctpicdtList[i].date;
                let category = ctpicdtList[i].category;
                
                
                Pprice.push(price);
                Pdates.push(date);
                Pcategory.push(category)
            }
            
            setPdate(Pdates);
            setPcategory(Pcategory);
            setPamount(Pprice);
        } 

            
        
        catch (error) {
            console.log('Error fetching data:', error);
        }

        
    }

    // console.log("잘담겼나?",linedateList)
    // console.log('2021-12-31'=='2021-12-31')

    // 1 . dayFilterDateList date형식으로 변환
    // 2 .reduce를 써서 날짜 중복이면 가격 합침
    // 3 .객체를 { date: "날짜", total: 금액 } 형태의 배열로 변환


    useEffect(() => {   
        handleTest()
    },[onedayclick])

    useEffect(() => {
        handleTest2()
    },[startdayclick,enddayclick])

    useEffect(() => {
        handleTest3()
    },[nowmonthfirstday,nowmonthlastday])

    useEffect(() => {
        chageDateOneMonth(); 
        if(user){
            getexpensechoiseData();
        } else{
            setChecked(true)
        }
    },[checked])
    
    

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


    
    // 라인 그래프
    const Linedata = {
        labels: linedateList,
        datasets: [
            {
                fill: true,
                label: '금액',
                data: linepriceList,
                // .map((data) => data*100),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    
    // 파이 그래프
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
                borderWidth: 2,
                // hoverOffset: 4,
            },
        ],
    };

    // select에 필요한것들
    const [selectedOption, setSelectedOption] = useState('fruits 🍊');
    const [isActive, setIsActive] = useState(false);

    const handleSelect = (item) => {
        
        setSelectedOption(item);
        setIsActive(false);
    };

    const toggleOptions = () => {
        setIsActive(!isActive);
    };


    return (
        <div className='pull_container'>
            <h1>지출</h1>
                <div className='container_wrap'>
                    <div className='wrap_1'>
                        <div className='income_expenditure_btn'>
                            <button>
                                <Link to="/calendar/chart/income">수입</Link>
                            </button>
                            <button>
                                <Link to="/calendar/chart/expense">지출</Link>
                            </button>
                        </div>

                        <div className='period_content'>
                            <div className='startday_endday_content'>
                                <div className='startday_content'>
                                    <div>
                                        <input ref={el => (inputRef.current[0] = el)}  
                                        type="text"
                                        disabled
                                            
                                        />
                                    </div>
                                    {/* 선택한 기간별 */}
                                    <div>
                                        {/* 시작일 */}
                                        <button
                                            onClick={() => {setCheck2((e) => !e); setCheck(false); }}
                                        >
                                            <SelectDate />
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
                                    </div>
                                </div>
                                <div className='endday_content'>
                                    <div>
                                        ~  
                                        <input ref={el => (inputRef.current[1] = el)}  
                                            type="text"
                                            disabled
                                            
                                        />
                                    </div>
                                    <div>
                                        {/* 종료일 */}
                                        <button
                                            onClick={() => {setCheck3((e) => !e); setCheck(false); } }
                                        >
                                        <SelectDate />
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
                                    </div>
                                </div>
                            </div>
            
                            {/* 일별  */}
                            {/* <button 
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
                            )} */}

                            <div className={`selectBox2 ${isActive ? 'active' : ''}`}>
                                <button className="label" onClick={toggleOptions}>
                                    {selectedOption}
                                </button>
                                {/* 1개월 */}
                                <ul className={`optionList ${isActive ? 'active' : ''}`}>
                                    <li onClick={() => {chageDateOneMonth(); handleSelect('1개월')}}
                                        className="optionItem"
                                    >
                                        1개월
                                    </li>
                                    <br />
                                    {/* 2개월 */}
                                    <li className="optionItem"
                                        onClick={() => {chageDateTwoMonth(); handleSelect('2개월')}}
                                    >
                                        2개월
                                    </li>
                                    <br />
                                    {/* 3개월 */}
                                    <li className="optionItem"
                                        onClick={() => {chageDateTreeMonth(); handleSelect('3개월')}}
                                    >
                                        3개월
                                    </li>
                                </ul>
                                <br />
                            </div>
                        </div>
                        
                        <br />
                        <div className='check_button'>
                            <button
                                onClick={() => getexpensechoiseData()}
                            >
                                조회
                            </button>
                        </div>
                    </div>            
                    <div className='charts_wrap'>
                        <div className='container_charts'>
                            <div className='item'>
                                <Pie 
                                    data={data} 
                                    options={options} 
                                    width="500vh" height="500vh" 
                                    
                                    />
                                    <h2>선택 기간의 지출 총금액</h2>
                                    {ptotal}
                            </div>
                            
                            <div className='item'>
                                <Line
                                    data={Linedata} 
                                    options={lineoptions} 
                                    // style={{ position: "relative", height: "40vh", width:"100vh" }}
                                    width="300%" height="100%"
                                    />
                            </div>

                            <div className='item'>
                                <div className='menulist'>
                                    <span>날짜</span>
                                    <span>카테고리</span>
                                    <span>가격</span>
                                    <span>메모</span>
                                </div>
                                <div className='item_tree_wrap box2'>
                                    {list.map((tmp)=> 
                                        <div className='item_child_three'>
                                            <div >
                                                {tmp.date}
                                            </div>
                                            <div > 
                                                {tmp.category}
                                            </div>
                                            <div >
                                                {tmp.price}
                                            </div>
                                            <div >
                                                {tmp.memo}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>                        
                </div>






        </div>
    )
}
