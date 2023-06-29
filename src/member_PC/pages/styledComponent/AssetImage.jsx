import React from 'react'
import styled from 'styled-components'

const ImageBox = styled.div`
    background-color: white;
    background-size: cover;
    width: 160px;
    height: 160px;
    margin: auto;
    margin-top: 15px;
    border-radius: 20px;
`

export default function AssetImage({children, ...rest}) {
    return (
        <ImageBox {...rest}>{children}</ImageBox>
    )
}