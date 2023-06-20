import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';

import TargetAmountInputComp from './TargetAmountInputComp';

export default function TargetAmountComp() {

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [activeModal, setActiveModal] = useState(null);

    const openModal = (modalId) => {
        setActiveModal(modalId);
    };

    return (
        <div>
            목표금액
            <br />

            
            {/* 모달로 */}
            {/* 제목 */}
            {/* 기간 */}
            {/* 금액 */}
            <button onClick={()=>{
                setModalIsOpen(true);
                openModal(3);
                }}>
                추가
            </button>
            {
                activeModal === 3 && (
                    <Modal isOpen={modalIsOpen}>
                    <div>
                        <h3>목표금액 추가 모달창</h3>
                        <button onClick={()=>setModalIsOpen(false)}>취소</button>
                        <TargetAmountInputComp setModalIsOpen={setModalIsOpen}/>
                    </div>
                    </Modal>
                )
            }

            <button>수정</button>
            {/* 모달로 리스트로 쫙 나오게 */}
            {/* 제목 */}
            {/* 기간 */}
            {/* 금액 */}
            {/* 삭제 */}
            

            {/* 슬라이드 */}
        </div>
    )
}
