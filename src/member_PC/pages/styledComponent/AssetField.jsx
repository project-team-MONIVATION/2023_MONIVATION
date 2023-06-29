import React from 'react'
import styled from 'styled-components'

const FieldDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export default function AssetField({children, ...rest}) {
    return (
        <FieldDiv {...rest}>{children}</FieldDiv>
    )
}