import React from 'react'
import styled from 'styled-components'

const SearchDateStyled = styled.div `
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 50px;

    & button {
        width: 200px;
        height: 45px;
        flex-shrink: 0;
        border-radius: 50px;
        border: 1px solid #CDCDCD;
        background: #FFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 15px;

        & > img {
            width: 17.5px;
        }

        & > span {
            font-size: 1.05rem;
            color: #8A8A8A;
            letter-spacing: 0.1em;
            padding-top: 3px;
        }
    }

    & h2 {
        font-size: 2.1rem;
        padding-top: 8px;
    }
`;

export default function SearchDate({ children, ...rest }) {
  return <SearchDateStyled {...rest}>{children}</SearchDateStyled>;
}