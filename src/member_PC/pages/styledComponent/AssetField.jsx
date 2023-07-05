import React from 'react'
import styled from 'styled-components'

const FieldDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function AssetField({children, ...rest}) {
    return (
        <FieldDiv {...rest}>{children}</FieldDiv>
    )
}