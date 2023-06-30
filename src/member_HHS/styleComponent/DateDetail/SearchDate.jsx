import React from 'react'
import styled from 'styled-components'

const SearchDateStyled = styled.div `
    position: relative;
    display: flex;
    justify-content: space-between;

    & button {
        width: 172px;
        height: 39px;
        flex-shrink: 0;
        border-radius: 50px;
        border: none;
        box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.20);
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
            right: 20px;
        }
    }

    & h2 {
        font-size: 2.1rem;
        margin-top: 56px;
        margin-right: 20px;
    }
`;

export default function SearchDate({ children, ...rest }) {
  return <SearchDateStyled {...rest}>{children}</SearchDateStyled>;
}