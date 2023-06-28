import React, { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../database/firebase';

export default function BestManagerSlideComp() {
  const [bestFmList, setBestFmList] = useState([]);

  useEffect(()=>{
    const getList = async () => {
        const q = query(collection(db, "financial_managers"), orderBy("likeNum", "desc"), limit(8));
        const querySnapshot = await getDocs(q);

        let dataArray = [];
        querySnapshot.forEach((doc) => {
            let data = {
                id : doc.id,
                name : doc.data().name,
                likeNum : doc.data().likeNum,
                field : doc.data().field,
                photo : doc.data().photo,
            }
            dataArray.push(data)
        });
        setBestFmList(dataArray);
    }
    getList();
  },[])

  return (
    <div>
      {
        bestFmList.map((fm,i)=>(
          <div key={i}>
            {fm.name}
          </div>
        ))
      }
    </div>
  )
}
