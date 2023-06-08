import React from 'react'
import styled from 'styled-components';

const CategoryButton = styled.label`
  padding: 7px 14px;
  background-color: #F4E8AE;
  border: 0;
  border-radius: 50px;
  cursor: pointer;
`

export default function CategoryBtn({children, name, value, ...rest}) {
  const onClickCategory = (e) => {
    rest.onChange(e)
  }
  return (
    <CategoryButton>
      <input 
        type="radio" 
        name={name}
        value={value}
        onChange={onClickCategory} 
        {...rest} 
    />
      {children}
    </CategoryButton>
  )
}
