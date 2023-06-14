import React from 'react'
import styled from 'styled-components'

const ImgBox = styled.div `
    display : inline-block;
    width : 120px;
    background-color: gray;
    height: 150px;
    border-radius: 10px;
    margin: 10px;
    `
export default function ImgDivBox({children, ...rest}) {
  return (
    <ImgBox {...rest}>{children}</ImgBox>
  )
}
