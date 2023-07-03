import React from 'react';
import styled from 'styled-components';

const MoneyListPanel = styled.div`
    position: relative;
    top: 0px;
    background-color: rgb(255, 255, 255);
    max-height: ${({ active }) => (active ? '700px' : '0')};
    overflow: hidden;

    & div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & h3 {
            font-size: 1.3rem;
            letter-spacing: 0.1em;
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
`;

export default function MoneyList({ children, active }) {
  return <MoneyListPanel active={active}>{children}</MoneyListPanel>;
}
