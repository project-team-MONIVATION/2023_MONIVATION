import React from 'react'
import styled from 'styled-components'

const AccordionBtn = styled.button `
    position: relative;
    display: flex;
    justify-content: space-between;
    
    width: 525px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 50px;
    border: 1px solid #CDCDCD;
    background: #FFF;
    :hover {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  &.active {
    font-weight: bold;
  }

  :after {
    content: '\002B';
    font-weight: bold;
    float: right;
    margin-left: 5px;
  }

  &.active:after {
    content: "\2212";
  }
`;

export default function Accordion({ children, ...rest }) {
  return <AccordionBtn {...rest}>{children}</AccordionBtn>;
}