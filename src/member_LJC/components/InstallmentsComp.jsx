
import React, {useEffect, useRef, useState, MouseEvent} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import { Timestamp, collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import {db} from '../../database/firebase'

import '../css/moneyCalendar.css'

export default function InstallmentsComp() {

    const user = useSelector((state) => state.user.user);

    const [totalinstallments, setTotalinstallments] = useState('');

    useEffect(() => {
        if(user){
            getinstallmentsData(); 
        }
    }, [user]); 


    // 데이터들 카테고리,가격 나열
    function samecategory(d) {
        const filteredData = d.filter(obj => obj.installment !== null);
        const prices = filteredData.map(obj => obj.price);
        // 할부금 리스트 
        // const filteredData
        return prices;
    }

    


    const getinstallmentsData = async () => {
        var date = new Date();

        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);


        const fmCollectionRef = collection(db, "money_expense");
        const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid), where('date', '>=', firstDay), where('date', '<=', lastDay)) 
    
        let dayFilterDateList = [];
        
        // console.log("값이 나왔냐?",dayFilterDateList)
        
        try {
            // 전부 뽑아옴
            const fmQuerySnapshot = await getDocs(fmQuery);
            
            fmQuerySnapshot.forEach((doc) => {
                dayFilterDateList.push(doc.data())
            });

            const pricesWithoutInstallment =samecategory(dayFilterDateList);
            
            const totalSum = pricesWithoutInstallment.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            setTotalinstallments(totalSum); // 총 합 출력

        }

        catch (error) {
            console.log("실패했습니다", error);
        }
    };

    return (
        <div 
            id='installment'
            className='total_price'>
                <div className='T_TOTAL'>
                    TOTAL
                </div>
                <div className='T_price'>
                    {totalinstallments}
                </div>
        </div>
    )
}
