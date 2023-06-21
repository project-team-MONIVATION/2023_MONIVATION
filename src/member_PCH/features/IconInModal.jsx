import React from 'react'
import styled from 'styled-components'

const SelectDateBtn = styled.div`
  width: 20px;
  height: 20px;
  //background-image: url(${require('../../assets/icon/calendar-plus.png')});
  background-image: ${ ({showCal}) => ( showCal ? `url(${require('../../assets/icon/calendar-plus-hover.png')})` : `url(${require('../../assets/icon/calendar-plus.png')})`) };
  &:hover {
    background-image: ${`url(${require('../../assets/icon/calendar-plus-hover.png')})`}
  }
`

export const SelectDate = ({showCal}) => {
  return (
    <SelectDateBtn showCal={showCal}/>
  )
}

export const selectPeriod = () => {
  return(
    <div></div>
  )
}