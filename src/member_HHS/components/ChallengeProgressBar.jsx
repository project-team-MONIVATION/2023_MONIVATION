import React from 'react';

const ChallengeProgressBar = ({ num, maxNum }) => {
    const dealt = Math.floor((num / maxNum) * 100);

    // console.log("현재퍼센트, 백퍼샌트",num,maxNum)
    const progressStyle = {
        width: '100%',
        height: '9px',
        backgroundColor: '#D9D9D9',
    };

    const dealtStyle = {
        backgroundColor: 'red',
        width: `${dealt}%`,
        height: '100%',
        
    };

    return (
        <div style={progressStyle}>
            <div style={dealtStyle}></div>
        </div>
    );
};

export default ChallengeProgressBar;