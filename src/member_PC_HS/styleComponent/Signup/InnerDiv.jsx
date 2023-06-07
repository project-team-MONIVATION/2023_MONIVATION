import React from 'react'
import styled from 'styled-components'

const WrapBox = styled.div `
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 50px;
    background-color: white;
    width: 500px; 
    margin: auto; 
    text-align : center;
    border-radius: 40px;
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
