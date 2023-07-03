import React from 'react'
import styled from 'styled-components'

const EditFormBox = styled.div`
  box-sizing: border-box;
  width: 580px;
  height: 850px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 50px;
  border: 0;
  margin-left: 20px; 
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export default function EditForm({ children, ...rest }) {
  return (
    <EditFormBox {...rest}>{children}</EditFormBox>
  )
}
