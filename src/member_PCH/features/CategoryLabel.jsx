import React from 'react'
import styled from 'styled-components';

const CategoryLB = styled.label`
  padding: 7px 14px;
  background-color: #F4E8AE;
  border: 0;
  border-radius: 50px;
  cursor: pointer;
`

export default function CategoryLabel({children, ...rest}) {
  const handleChange = (e) => {
    rest.onChange(e)
  }
  return (
    <CategoryLB>
      <input type="radio" {...rest} onChange={handleChange} /> {/* 라디오 버튼에 onChange 이벤트 핸들러 추가 */}
      {children}
    </CategoryLB>
  )
}
