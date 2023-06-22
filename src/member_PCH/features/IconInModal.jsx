import React from 'react'
import styled from 'styled-components'

/** 날짜 선택 아이콘 버튼 */
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


/** 기간 선택 아이콘 버튼 */
const SelectPeriodBtn = styled.div`
  width: 20px;
  height: 20px;
  //background-image: url(${require('../../assets/icon/calendar-plus.png')});
  background-image: ${ ({showPeriod}) => ( showPeriod ? `url(${require('../../assets/icon/calendar-plus-hover.png')})` : `url(${require('../../assets/icon/calendar-plus.png')})`) };
  &:hover {
    background-image: ${`url(${require('../../assets/icon/calendar-plus-hover.png')})`}
  }
`
export const SelectPeriod = ({showPeriod}) => {
  return(
    <SelectPeriodBtn showPeriod={showPeriod}/>
  )
}