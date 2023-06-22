import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import InputIncomeComp from './InputIncomeComp';
import InputIncomeRepeatComp from './InputIncomeRepeatComp';

export default function IncomeModalComp({ setModalIsOpen }) {
  // 일반수입 모달 state
  const [showIncome, setShowIncome] = useState(true);
  // 반복수입 모달 state
  const [showIncomeRepeat, setShowIncomeRepeat] = useState(false);

  // 일반수입 모달 on
  const onShowIncome = () => {
    setShowIncome(true); 
    setShowIncomeRepeat(false);
  };

  // 반복수입 모달 on
  const onShowRepeatIncome = () => {
    setShowIncome(false);
    setShowIncomeRepeat(true);
  };

  // 일반수입 또는 반복수입 모달의 form에서 submit 후 모달을 닫기 위함
  const handleSubmit = () => {
    setModalIsOpen(false);
  };

  return (
    <div className='content'>
      <div className='btn_container'>
        <button 
          className={
            'content_btn ' +
            (showIncome ? 'active' : '')
          }
          onClick={ onShowIncome }
        >
          일반수입
        </button>
        <button 
          className={
            'content_btn ' +
            (showIncomeRepeat ? 'active' : '')
          }
          onClick={ onShowRepeatIncome }
        >
          고정수입
        </button>
      </div>

      { // 일반수입 입력 form
        showIncome && <InputIncomeComp handleSubmit={handleSubmit}/>
      }

      { // 반복수입 입력 form
        showIncomeRepeat && <InputIncomeRepeatComp handleSubmit={handleSubmit}/>
      }
    </div>
  )
}
