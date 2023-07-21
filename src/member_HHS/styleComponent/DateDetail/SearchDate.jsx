import React from 'react'
import styled from 'styled-components'

const SearchDateStyled = styled.div `
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 50px;

    & h2 {
        font-size: 2.1rem;
        padding-top: 8px;
    }
`;

export default function SearchDate({ children, ...rest }) {
  return <SearchDateStyled {...rest}>{children}</SearchDateStyled>;
}