import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../database/firebase';
import Slider from 'react-slick';
import styled from 'styled-components';


const BMslider = styled.div`
  width: 80%;
  margin: auto;
  margin-top: 50px;
`

const BMcard = styled.div`
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  background-color: #e9e9e9;
  width: 85%;
  height: 380px;
  margin: auto;
`

const ImgDiv = styled.div`
  width: 100%;
  margin: auto;
  background-size: cover;
  background-position: center;
`

const TextBox = styled.div`
  margin: 15px 0;
`

const Name = styled.p`
  font-size: 20px;
  font-weight: bold;
`

const FieldSpan = styled.span`
  display: inline-block;
  box-sizing: border-box;
  padding: 5px 10px;
  margin: 0 5px;
  margin-top: 10px;
  border-radius: 30px;
  background-color: #ffffff;
  font-weight: bold;
`

export default function BestManagerSlideComp() {
  const [bestFmList, setBestFmList] = useState([]);

  const settings = {
    dots: true,
    arrow : false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  }

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

  const resizeImages = () => {
    const imgElements = document.getElementsByClassName('img');
    for (let i = 0; i < imgElements.length; i++) {
      const img = imgElements[i];
      const width = img.offsetWidth; // 이미지 요소의 너비를 측정
      img.style.height = `${width}px`; // width 값을 height로 설정하여 정사각형 만들기
    }
  }

  useEffect(() => {
    resizeImages();
    window.addEventListener('resize', resizeImages); // 창 크기가 변경될 때마다 이미지 크기 조정
    return () => {
      window.removeEventListener('resize', resizeImages); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    }
  }, [bestFmList])

  return (
    <BMslider>
      <Slider {...settings}>
      {
        bestFmList.map((fm,i)=>(
          <div key={i} >
            <BMcard>
              <ImgDiv 
                className='img'
                style={{
                  backgroundImage: `url(${fm.photo})`,
                }}
              />
              <TextBox>
                <Name>{fm.name}</Name>
                <div>
                  {
                    fm.field && fm.field.map((f, i) => (
                      <FieldSpan key={i}>{f}</FieldSpan>
                    ))
                  }
                </div>
              </TextBox>
            </BMcard>
          </div>
        ))
      }
      </Slider>
    </BMslider>
  )
}
