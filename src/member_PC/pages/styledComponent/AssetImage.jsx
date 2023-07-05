import React from 'react'
import styled from 'styled-components'

const ImageBox = styled.div`
    background-color: white;
    background-size: cover;
    width: 220px;
    height: 220px;
    margin: auto;
    border-radius: 20px 20px 0 0;
`

export default function AssetImage({children, ...rest}) {
    return (
        <ImageBox {...rest}>{children}</ImageBox>
    )
}