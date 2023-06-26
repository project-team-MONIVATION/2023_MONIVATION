import React from 'react'
import styled from 'styled-components'

const ImgBox = styled.div `
    display : inline-block;
    width : 120px;
    background-color: gray;
    height: 150px;
    border-radius: 10px;
    margin: 10px;
    cursor: pointer;
    `
export default function ImgDivBox({children, name, value, selectedImgCategory, ...rest}) {
  return (
    <ImgBox selectedImgCategory={selectedImgCategory} value={value}>
      <input
        type = "radio"
        name = {name}
        value = {value}
        style={{display : 'none'}}
        {...rest}
      />
        {children}
      </ImgBox>
  )
}
