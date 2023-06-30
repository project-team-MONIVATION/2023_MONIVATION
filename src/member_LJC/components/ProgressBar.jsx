import React from 'react';

const ProgressBar = ({ num, maxNum }) => {
    const dealt = Math.floor((num / maxNum) * 100);

    // console.log("현재퍼센트, 백퍼샌트",num,maxNum)
    const progressStyle = {
        width: '100%',
        height: '10px',
        backgroundColor: 'white',
    };

    const dealtStyle = {
        backgroundColor: 'red',
        width: `${dealt}%`,
        height: '100%',
    };
    console.log("나와라", dealt)

    return (
        <div style={progressStyle}>
            <div style={dealtStyle}></div>
        </div>
    );
};

export default ProgressBar;