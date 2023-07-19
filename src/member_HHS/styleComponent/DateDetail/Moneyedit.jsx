import React from 'react'
import styled from 'styled-components'

const Inputbtnsstyled = styled.div `
  position: absolute;
  bottom: 50px;
  
  & input {
    margin-right: 10px;
  }
  & input, 
  & button {
    background-color: rgb(115, 91, 243);
    border: none;
    border-radius: 50px;
    width: 150px;
    height: 50px;
    color: #fff;
    font-size: 23px;
    font-family: 'Cafe24Ssurround';

    :hover {
      box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);
    }
  }

`;

export default function Moneyedit({ children, ...rest }) {
  return <Inputbtnsstyled {...rest}>{children}</Inputbtnsstyled>;
}