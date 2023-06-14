import React, { useEffect } from 'react'
import styled, {keyframes} from 'styled-components'

export default function LogoFlowComp() {

  const Container = styled.div`
    height: 100%;
  `;

  const flowing = keyframes`
    0% {
      transform: translate3d(0,0,0);
    }
    100% {
      transform: translate3d(-50%,0,0);
    }
  `;

  const FlowBox = styled.div`
    position: relative;
    width: 100%;
    height: 60px;
    overflow: hidden;
    background-color: rgb(247, 224, 117);
    top: 50%;
    transform: translate(0,-50%);
    opacity: 0;
  `;

  const FlowWrap = styled.div`
    display: flex;
    top: 0;
    left: 0;
    align-items: center;
    width: 100%;
    height: 100%;
    white-space: nowrap;
  `;

  const Flow = styled.div`
    font-size: 3rem;
    animation: ${flowing} 30s linear infinite;
    animation-delay: 2s;
    span {
      display: inline-block;
      font-family: 'Cafe24Ssurround';
      font-weight: bold;
      padding: 0 20px;
      padding-top: 6px;
      color: white;
    }
  `;

  useEffect(() => {
    const timer = setTimeout(() => {
      const flowBox = document.getElementById('flow-box');
      if (flowBox) {
        flowBox.style.opacity = '1'
        flowBox.style.transition = 'all 1s'
      };
    }, 2000);

    return () => { clearTimeout(timer) }
  }, [])
  return (
    <Container>
      <FlowBox id='flow-box'>
        <FlowWrap>
          <Flow>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
            <span>MONIVATION</span>
          </Flow>
        </FlowWrap>
      </FlowBox>
    </Container>
  )
}
