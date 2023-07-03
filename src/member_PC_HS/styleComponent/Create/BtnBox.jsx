import React from 'react'
import styled from 'styled-components'

const WrapBtnBox = styled.div `
  display: inline-block;
  text-align: center;
  width: 550px;
  & > h2 {
    font-family: 'Cafe24SsurroundAir';
    margin: 17px 0 24px 0;
    font-size: 18px;
    font-weight: 300;
    letter-spacing: 1px;
  }
`

export default function BtnBox({children, ...rest}) {
  return (
    <WrapBtnBox {...rest}>{children}</WrapBtnBox>
  )
}
