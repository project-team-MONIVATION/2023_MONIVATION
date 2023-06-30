import React from 'react'
import styled from 'styled-components'

const AccordionBtn = styled.button `
    @font-face {
        font-family: 'EliceDigitalBaeum-Bd';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_elice@1.0/EliceDigitalBaeum-Bd.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
    }

    position: relative;
    justify-content: space-between;
    width: 500px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 50px;
    border: none;
    background: #fff;
    margin-left: 20px;
    margin-right: 20px;
    top: 40px;
    transition: box-shadow 0.5s, 0.6s ease-in-out;
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.20);

    & div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & h3 {
            font-size: 1.3rem;
            letter-spacing: 0.1em;
            margin: 0 25px;
        }
        & h3:nth-child(1) {
            margin-top: 3px;
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
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
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