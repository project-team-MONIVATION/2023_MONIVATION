import React from 'react'
import styled from 'styled-components'

const WrapBox = styled.div `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; 
    height: 90vh;
    box-sizing: border-box;
    padding: 2vh 20px;
    text-align : center;
    border-radius: 50px;
    background-color: white;
    overflow: hidden;
    filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
    & label {
      padding-left: 20px;
    }
` 

export default function InnerDiv({children, ...rest}) {
  return (
    <WrapBox {...rest}>{children}</WrapBox>
  )
}
