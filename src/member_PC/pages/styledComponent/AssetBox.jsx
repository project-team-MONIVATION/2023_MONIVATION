import React from 'react'
import styled from 'styled-components'

const BackgroundBox = styled.div`
    background-color: #D9D9D9;
    width: 200px;
    height: 250px;
    margin: 15px;
    display: inline-block;
    border-radius: 20px;
`

export default function AssetBox({children, ...rest}) {
    return (
        <BackgroundBox {...rest}>{children}</BackgroundBox>
    )
}