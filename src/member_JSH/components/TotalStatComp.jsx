import React from 'react'
import { useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';

export default function TotalStatComp() {
  // 일반 수입 리덕스
  const implist = useSelector((state)=>(state.imp));
  //const [inputs, setInputs] = useState();
  // 일반 지출 리덕스
  const exlist = useSelector((state)=>(state.ex));
  // 저금 리덕스
  const savelist = useSelector((state)=>(state.save));
  return (
    <div style={{height : "538px", 
    display : 'inline-block', 
    backgroundColor : 'lightgray', marginTop : '3.8rem',
    border : 'solid 1px black', marginRight : "0.6rem",
    minWidth : '150px'}}>
        <table>
          <tbody>
            <th>이번 달 총액</th>
            <tr>
              <td>반복 수입</td>
            </tr>
            <tr>
              <td>0,000,000원</td>
            </tr>
            <tr>
              <td>일반 수입</td>
            </tr>
            <tr>
              <td>0,000,000원</td>
            </tr>
            <tr>
              <td>반복 지출</td>
            </tr>
            <tr>
              <td>- 0,000,000원</td>
            </tr>
            <tr>
              <td>일반 지출</td>
            </tr>
            <tr>
              <td>- 0,000,000원</td>
            </tr>
            <tr>
              <td>현재 총 저금액</td>
            </tr>
            <tr>
              <td>0,000,000원</td>
            </tr>
            <tr>
              <td>현재 총 자산</td>
            </tr>
            <tr>
              <td>0,000,000원</td>
            </tr>
          </tbody>
        </table>
    </div>
  )
}
