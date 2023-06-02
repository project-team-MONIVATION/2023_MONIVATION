import React from 'react'
import styled from 'styled-components';

const CategoryButton = styled.button`
  padding: 7px 14px;
  background-color: #F4E8AE;
  border: 0;
  border-radius: 50px;
  cursor: pointer;
`

export default function CategoryBtn({children, ...rest}) {
  return (
    <CategoryButton {...rest} onClick={(e)=>{e.preventDefault()}}>
      {children}
    </CategoryButton>
  )
}
