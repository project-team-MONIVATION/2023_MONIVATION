import React from "react";
import styled from "styled-components";

/* 수정함 body->div, overflow: hidden */
const Back = styled.div `
    background: linear-gradient(125deg, #21D6CC 10%, #7D21CF 90%);
    height: 100vh;  
    font-family: 'Cafe24Ssurround';
    position: relative;
    overflow: hidden;
`
const BackgroundImage1 = styled.div`
    background-size: 100vh;
    width: 200%;
    height: 100vh;
    background-image: ${`url(${require('../../assets/img/back_pattern.png')})`};
    /* background-repeat: repeat-x; */
    background-position: -150px, -250px;
    display: inline-block;
    position: absolute;
    top: -40vh;
    left: 0;
`;

const BackgroundImage2 = styled.div`
    background-size: 100vh;
    width: 200%;
    height: 100vh;
    background-image:  ${`url(${require('../../assets/img/back_pattern.png')})`};
    /* background-repeat: repeat-x; */
    background-position: -150px, -250px;
    display: inline-block;
    position: absolute;
    top: 35vh;
    left: -50vh;
`;

export default function BackGround({ children,...rest }) {
    return (
        <Back {...rest}>
            <BackgroundImage1 />
            <BackgroundImage2 />
        {children}
        </Back>
    );
}