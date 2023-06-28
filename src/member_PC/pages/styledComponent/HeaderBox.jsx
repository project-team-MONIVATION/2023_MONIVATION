import React from 'react'
import styled from 'styled-components'

const HBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin: auto;
`

export default function HeaderBox({children, ...rest}) {
    return (
        <HBox {...rest}>{children}</HBox>
    )
}