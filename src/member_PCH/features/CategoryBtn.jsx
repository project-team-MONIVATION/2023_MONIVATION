import React from 'react'
import styled from 'styled-components';

const CategoryButton = styled.label`
  display: inline-block;
  padding: 8px 14px 6px 14px;
  border: 0;
  border-radius: 50px;
  margin-right: 5px;
  background-color: ${({selectedCategory, value}) => ( selectedCategory === value ? '#F4D750' : '#F4E8AE')};
  // font-weight: ${({selectedCategory, value}) => ( selectedCategory === value ? 'bold' : 'normal')};;
  cursor: pointer;
`

export default function CategoryBtn({children, name, value, selectedCategory, ...rest}) {

  const onClickCategory = (e) => {
    rest.onChange(e)
  }
  
  return (
    <CategoryButton selectedCategory={selectedCategory} value={value}>
      <input 
        type="radio" 
        name={name}
        value={value}
        onClick={onClickCategory}
        style={{display: 'none'}} 
        {...rest}
    />
      {children}
    </CategoryButton>
  )
}
