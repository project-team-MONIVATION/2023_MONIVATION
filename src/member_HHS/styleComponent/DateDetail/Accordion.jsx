import React from 'react'
import styled from 'styled-components'

const AccordionBtn = styled.button `
    @font-face {
        font-family: 'EliceDigitalBaeum-Bd';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_elice@1.0/EliceDigitalBaeum-Bd.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
    }

    box-sizing: border-box;
    width: 100%;
    height: 45px;
    justify-content: space-between;
    flex-shrink: 0;
    border-radius: 50px;
    border: none;
    border: 1px solid #CDCDCD;
    padding: 0;

    & div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 25px;
        & h3 {
            font-size: 1.5rem;
            letter-spacing: 0.1em;
            padding-top: 3px;
        }
        & h3:nth-child(1) {
            & span {
                color: #6717CD;
                font-family: 'Cafe24Ssurround';

            }
        }
        & h3:nth-child(2) span {
            font-size: 1rem;
            font-family: 'EliceDigitalBaeum-Bd';
        }
    }

    :hover {
        background-color: #CDCDCD;
    }

`;

export default function Accordion({ children, active, onClick }) {
    return (
        <AccordionBtn className={active ? 'active' : ''} onClick={onClick}>
            {children}
        </AccordionBtn>
    );
  }