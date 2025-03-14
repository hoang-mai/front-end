import React from 'react';

interface LoaderLineProps {
    height?: string;
    width: string;
}

const LoaderLine: React.FC<LoaderLineProps> = ({ height,width }) => {
    return (
        <div className={` ${height} ${width} animate-pulse h-4 bg-gray-300 rounded`}></div>
    );
};

export default LoaderLine;