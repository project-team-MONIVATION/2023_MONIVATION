import React from 'react'
import styled from 'styled-components'

const AccordionStyled = styled.div `
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
        border: 1px solid #CDCDCD;
        background: #CDCDCD;
    }

    & button {
        width: 172px;
        height: 39px;
        flex-shrink: 0;
        border-radius: 50px;
        border: 1px solid var(--black-60, #8E8E8E);
        background: #FFF;
        margin-top: 50px;
        margin-left: 20px;
        position: relative;
        & > img {
            width: 17.5px;
            position: absolute;
            left: 20px;
            top: 10px;
        }

        & > span {
            font-size: 1.05rem;
            color: #8A8A8A;
            letter-spacing: 0.1em;
            position: absolute;
            top: 11px;
        }
    }

    & h2 {
        font-size: 2.1rem;
        margin-top: 56px;
        margin-right: 20px;
    }
`;

export default function Accordion({ children, ...rest }) {
  return <AccordionStyled {...rest}>{children}</AccordionStyled>;
}