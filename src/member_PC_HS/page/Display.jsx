import React, { useState, useEffect } from 'react'
import { db } from '../../database/firebase';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { getDocs, query, collection, where } from 'firebase/firestore';

export default function Display() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [datalist, setDatalist] = useState([]);
  console.log(user)

  useEffect(() => {
    const getData = async () => {
      try {
        const fmCollectionRef = collection(db, 'financial_managers');
        const puCollectionRef = collection(db, 'personal_users');
        const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
        const puQuery = query(puCollectionRef, where('uid', '==', user.uid));

        const [fmQuerySnapshot, puQuerySnapshot] = await Promise.all([
          getDocs(fmQuery),
          getDocs(puQuery),
        ]);

        if (fmQuerySnapshot.empty && puQuerySnapshot.empty) {
          // uid값을 찾을 수 없음
          navigate('/calendar');
        } else {
          // uid에 해당하는 사용자가 존재하므로 로그인 처리
          // 데이터를 활용하여 필요한 작업을 수행
          const dataArray = [];
          fmQuerySnapshot.forEach((doc) => {
            dataArray.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          puQuerySnapshot.forEach((doc) => {
            dataArray.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setDatalist(dataArray);
        }
      } catch (error) {
        console.log("실패했습니다: ", error);
      }
    };

    getData();
  }, [user]);
  console.log(datalist);

  return (
    <div>
      { datalist[0] && datalist[0].name}
      { datalist[0] && datalist[0].uid}
      { datalist[0] && datalist[0].phone}
    </div>
  )
}
