import React from 'react';

const ProgressBar = ({ num, maxNum }) => {
    const dealt = Math.floor((num / maxNum) * 100);

    const progressStyle = {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: 'white',
        position: 'relative',
    };

    const dealtStyle = {
        backgroundColor: 'red',
        width: `${dealt}%`,
        height: '100%',
        borderRadius: '50%',
        position: 'absolute',
        top: '0',
        left: '0',
        transformOrigin: '0 0',
        transform: `rotate(${360 * (dealt / 100)}deg)`,
        transition: 'transform 0.3s ease',
    };

    return (
        <div style={progressStyle}>
            <div style={dealtStyle}></div>
        </div>
    );
};

export default ProgressBar;
