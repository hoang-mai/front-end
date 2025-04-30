import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-green-700 text-white p-4 max-w-screen-3xl mx-auto">
            <div className="flex justify-center items-center">
                <h1 className="text-xl font-bold align-center">Hệ thống quản lý đào tạo học viên quân đội</h1>
            </div>
        </header>
    );
};

export default Header;