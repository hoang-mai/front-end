'use client';
import { ReactNode, useState,useEffect, useLayoutEffect } from 'react';
import LeftSidebar from './leftSidebar';
interface ContextProps {
    readonly children: ReactNode;
}

export default function Context({ children }: ContextProps) {
    const [showLeftSidebar, setShowLeftSidebar] = useState<boolean>(window.innerWidth >= 768);
    return (
        <>
            <LeftSidebar showLeftSidebar={showLeftSidebar} setShowLeftSidebar={setShowLeftSidebar} />
            <main className={`transition-all duration-300  ${showLeftSidebar ? "lg:ml-72 md:ml-68 md:w-[calc(100%-18rem)]" : ""} w-screen`}
            >
                {children}
            </main>
        </>
    );
}