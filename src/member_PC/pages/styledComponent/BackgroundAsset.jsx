import React from "react";
import styled from "styled-components";

const Back = styled.body `
    background-image: linear-gradient(to right bottom, #21D6CC, #7D21CF);
    height: 100vh;  
    font-family: 'Cafe24Ssurround';
    position: relative;
`
const BackgroundImage = styled.div`
  background-size: 50%;
  width: 100%;
  height: 100%;
  background-image: url("img/back_pattern.png");
  /* background-repeat: repeat-x; */
  background-position: -150px, -250px;
  display: inline-block;
`;

export default function BackgroundAsset({ children,...rest }) {
    return (
        <Back {...rest}>
            <BackgroundImage />
        {children}
        </Back>
    );
}