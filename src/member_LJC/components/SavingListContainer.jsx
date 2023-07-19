import React from 'react'
import Modal from 'react-modal';
import SavingList from '../pages/SavingList';
import { useState } from 'react';

import SavingListModifyComp from './SavingListModifyComp';

import { useSelector } from 'react-redux';
import { collection, deleteDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import {db} from '../../database/firebase'

import DateDetailBox from '../../member_HHS/styleComponent/DateDetail/DateDetailBox';

import '../../member_PCH/styles/editForm.css'

import ModalWrap from '../../member_HHS/styleComponent/DateDetail/ModalWrap';

export default function SavingListContainer({closeSavingListContainerModal}, openmodal) {

    const [alltmp, setAlltmp] = useState([]);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    /** 모달창 닫기/수정/삭제 */
    // 수정 모달창 닫기
    const handleClose = () => {
        closeSavingListContainerModal();
    };  


    // 수정 모달 열기/닫기
    const [modifyCompOpen, setModifyCompOpen] = useState(false);
    
    const closeSubModal = () => {
        setModifyCompOpen(false);
    };

    const [savingList , setSavingList] = useState([]);

    // 
    const getSavingData = async () => {
        try {
            const fmCollectionRef = collection(db, "money_saving");
            const fmQuery = query(fmCollectionRef, where('user', '==', user.uid));
            const fmQuerySnapshot = await getDocs(fmQuery);

            if (!user.uid) {
                navigate('/account/login');
            } else {
                let dataArray = [];
                fmQuerySnapshot.forEach((doc) => {
                    dataArray.push({
                    ...doc.data(),
                    id: doc.id,
                });
                });
                setSavingList(dataArray);
            }
        } catch (error) {
            console.log("실패했습니다", error);
        }
    };

    return (
        
            <DateDetailBox>
                <div>
                <Modal
                    id='calendar_modal'
                    isOpen={openmodal}
                    style={{
                        overlay: {
                        //position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        zIndex: 20,
                        },
                        content: {
                        boxSizing: 'border-box',
                        width: '580px',
                        height: '790px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50px',
                        border: 0,
                        overflow: "hidden",
                        }
                    }}
                    >
                    <div className='content_container'>
                    <button 
                        className='close_btn'
                        onClick={handleClose}
                    >
                        X
                    </button>
                        <SavingList 
                            setAlltmp ={setAlltmp}
                            alltmp = {alltmp}
                            setModifyCompOpen = {setModifyCompOpen}

                        />
                    </div>
                </Modal>
                </div>

                <div>
                {modifyCompOpen && (
                    // <ModalWrap>
                    // <div>
                    <SavingListModifyComp
                        tmp={alltmp}
                        getSavingData={getSavingData}
                        closeSubModal = {closeSubModal}
                        style={{zIndex:50 , backgroundColor:"red"}}
                    />
                    // </div>
                    // </ModalWrap>
                )}
                </div>
            </DateDetailBox>
        


        
    )
}
