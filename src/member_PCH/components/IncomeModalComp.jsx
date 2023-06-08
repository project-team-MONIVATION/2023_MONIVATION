import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import InputIncomeComp from './InputIncomeComp';
import InputIncomeRepeatComp from './InputIncomeRepeatComp';

export default function IncomeModalComp({ setModalIsOpen }) {
  const [showIncome, setShowIncome] = useState(true);
  const [showIncomeRepeat, setShowIncomeRepeat] = useState(false);

  const onShowIncome = () => {
    setShowIncome(true); 
    setShowIncomeRepeat(false);
  }

  const onShowRepeatIncome = () => {
    setShowIncome(false);
    setShowIncomeRepeat(true);
  }

  const handleSubmit = () => {
    // submit 후 모달을 닫기 위함
    setModalIsOpen(false);
  };

  return (
    <div>
            <button onClick={ onShowIncome }>일반수입</button>
            <button onClick={ onShowRepeatIncome }>반복수입</button>

            {/** 일반수입 입력 */}
            {
              showIncome && <InputIncomeComp handleSubmit={handleSubmit}/>
            }

            {/** 반복수입 입력 */}
            {
              showIncomeRepeat && <InputIncomeRepeatComp handleSubmit={handleSubmit}/>
            }
    </div>
  )
}
