// 가계부 - 캘린더 페이지

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TotalStatComp from '../components/TotalStatComp'
import CalendarComp from '../components/CalendarComp'
// 통계
import SEcomp from '../../member_LJC/components/SEcomp';
import SIcomp from '../../member_LJC/components/SIcomp';
// 할부금
import InstallmentsComp from '../../member_LJC/components/InstallmentsComp';
// 목표금액
import TargetAmountComp from '../../member_LJC/components/TargetAmountComp';
import TargetAmountInputComp from '../../member_LJC/components/TargetAmountInputComp';
import TargetAmonutListComp from '../../member_LJC/components/TargetAmonutListComp';

// 폰트어썸
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faGear, faCoins } from "@fortawesome/free-solid-svg-icons";


import Modal from 'react-modal';

import MyChallengeSlideComp from '../components/MyChallengeSlideComp';

import '../../member_LJC/css/moneyCalendar.css';

export default function MoneyCalendar() {

  // 수입 지출 컴프 바꾸기위한 버튼
  const [open, setOpen] = useState(false);

  // 창 이동 
  const navigate = useNavigate();

  // 목표 금액 모달창
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalId) => {
    setActiveModal(modalId);
};

  useEffect(()=>{
    window.scrollTo({top: 0})
  },[])
  
  return (
    <div id='layout' style={{ position: "relative"}}>
      <div
        style={{
          display: "flex", 
          justifyContent: "center", 
          alignItems:"flex-start",
          height:"75%",
          maxHeight:"75%", 
          backgroundColor : "transparent", 
          maxWidth:"99%",
          margin: "auto",
          boxShadow: "0 0 10px 1px rgba(0,0,0,0.2)",
          borderRadius: "50px",
          marginBottom: "2%",
          position: "relative",
          boxSizing: "border-box",
          paddingTop: "80px",
          paddingBottom: "50px",
          boxSizing: "border-box"
        }}
      >
        <TotalStatComp />
        <CalendarComp />
      </div>


      <div
        id='MoneyCalendar'
        className='bottom_component_container'
      >
        {/* 통계 컴포넌트 */}
        
        <div 
        className='chart_component_container'
        >
          <div className='title'
            onClick={() => {navigate('/calendar/chart/expense')}} 
          >
            통계
          </div>
          <div className='chartbtn_container'>
            <div 
            className='back'
            style={{
              width: '60px',
              height: '40px',
              marginRight: "1px",
              backgroundColor: '#735BF3',
              transform: open ? 'translateY(0)' : 'translateY(40px)',
              transition : 'all 0.3s',
              borderRadius: '15px'
            }}
            />
            <div className='btns'>
              <button
                onClick={() => {setOpen((e) => !e);}}
                className='co_btn'
              >지출
              </button>

              <button
                onClick={() => {setOpen((e) => !e);}}
                className='co_btn'
              >수입
              </button>
            </div>
          </div>
          
            {open && (
            <div>
              <SEcomp/>
            </div>
            )}
            {! open && (
            <div>
              <SIcomp/>
            </div>
            )}
        </div>

        {/* 할부금 컴포넌트 */}

        <div 
          className='installment_component'
          >
            <div className='title'>
              할부금
            </div>
            <div className='installment_total'>
              <InstallmentsComp/>
            </div>
        </div>

        {/* JSH 챌린지 컴포넌트 */}
        <div 
          className='challenge_component'
          >
            <div className='title'>
              챌린지
            </div>
          <MyChallengeSlideComp />
        </div>
        
        {/* 목표금액 컴포넌트 */}
        <div 
          className='target_amount_component'
          >
          <div className='title_container'>
            <div className='title'>
              목표금액
            </div>
            <div className='title_btn'>
              
                <button onClick={()=>{
                    setModalIsOpen(true);
                    openModal(1);
                    }}
                    className='title_plusebtn'
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                {
                    activeModal === 1 && (
                        <Modal isOpen={modalIsOpen}>
                        <div>
                            <h3>추가</h3>
                            <button onClick={()=>setModalIsOpen(false)}>취소</button>
                            <TargetAmountInputComp setModalIsOpen={setModalIsOpen}/>
                        </div>
                        </Modal>
                        
                    )
                }
              
              
                <button onClick={()=>{
                    setModalIsOpen(true);
                    openModal(2);
                    }}
                    className='title_changebtn'
                >
                    <FontAwesomeIcon icon={faGear} />
                </button>
                {
                    activeModal === 2 && (
                        <Modal isOpen={modalIsOpen}>
                        <div>
                            <h3>목표금액 수정,리스트 모달창</h3>
                            <button onClick={()=>setModalIsOpen(false)}>취소</button>
                            <TargetAmonutListComp setModalIsOpen={setModalIsOpen}/>
                        </div>
                        </Modal>
                    )
                }
              
            </div>
        </div>


          <div>
            <TargetAmountComp/>
          </div>
          
        </div>

        {/** 비어있는 div */}
        <div className='empty'></div>
      </div>
    </div>
  )
}
