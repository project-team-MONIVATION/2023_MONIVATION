import React from 'react'
import styled from 'styled-components'

const AssetSpan = styled.span`
    font-size: 0.8rem;
    padding: 0 2px;
`

export default function FieldSpan({children, ...rest}) {
    return (
        <AssetSpan {...rest}>{children}</AssetSpan>
    )
}