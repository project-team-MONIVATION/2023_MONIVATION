import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CategoryBtn from '../features/CategoryBtn';
import IncomeComp from './IncomeComp';
import IncomeRepeatComp from './IncomeRepeatComp';

export default function IncomeModalComp() {
  const [showIncome, setShowIncome] = useState(true);
  const [showRepeatIncome, setShowRepeatIncome] = useState(false);

  const onShowIncome = () => {
    setShowIncome(true); 
    setShowRepeatIncome(false);
  }

  const onShowRepeatIncome = () => {
    setShowIncome(false);
    setShowRepeatIncome(true);
  }

  return (
    <div>
      <button onClick={ onShowIncome }>일반수입</button>
      <button onClick={ onShowRepeatIncome }>반복수입</button>

      {/** 일반수입 입력 */}
      {
        showIncome && <IncomeComp/>
      }

      {/** 반복수입 입력 */}
      {
        showRepeatIncome && <IncomeRepeatComp/>
          /*
          
        */
      }
    </div>
  )
}
