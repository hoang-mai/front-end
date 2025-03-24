import React from "react";

const LoaderAvatar: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-2 animate-pulse" aria-label="Đang tải ảnh đại diện">
            <div className="w-16 h-16 rounded-full bg-gray-300"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
        </div>
    );
};

export default LoaderAvatar;
