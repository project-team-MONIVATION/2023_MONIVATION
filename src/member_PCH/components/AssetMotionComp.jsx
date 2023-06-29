import React from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin: auto;
  margin-top: 10%;
`

const Card = styled.div`
  width: 90%;
  height: 380px;
  margin: auto;
  background-color: gray;
`

const cardVariants = {
  offscreen: {
    y: 300
  },
  onscreen: {
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};


export default function AssetMotionComp() {
  
  return (
    <CardContainer>
      <motion.div
        className="card-container"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        style={{ width: "inherit" }}
      >
        <motion.div 
          className="card"
          variants={cardVariants}
        >
          <Card>
            1
          </Card>
        </motion.div>
      </motion.div>
      <motion.div
        className="card-container"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        style={{ width: "inherit" }}
      >
        <motion.div 
          className="card"
          variants={cardVariants}
        >
          <Card>
            3
          </Card>
        </motion.div>
      </motion.div>
    </CardContainer>
  )
}
