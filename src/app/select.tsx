'use Client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FC, useState,useRef, useEffect } from 'react';
interface SelectProps {
    selected: string;
    setSelected: (value: string) => void;
}
const SelectComponent: FC<SelectProps> = ({ selected, setSelected }) => {
    const [showSelect, setShowSelect] = useState<boolean>(false);
    
    const showSelectRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (showSelectRef.current && !showSelectRef.current.contains(event.target)) {
                setShowSelect(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSelectRef]);
    return (

        <div className='relative h-10 md:w-2/3 w-full'>
            <button onClick={() => setShowSelect(true)} className="relative h-10 w-full" >
                <p
                    className={`${selected !=="Đảng viên / Đoàn viên" ? "text-black" : "text-gray-500"}  flex items-center h-full w-full border rounded-lg border-(--border-color) px-2 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus)`}
                >
                    {selected}
                </p>
                <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 top-3 text-gray-400" />
            </button>
            {showSelect &&
                <div ref={showSelectRef} className="absolute w-full bg-green-500 border border-(--border-color) rounded-lg z-10">
                    <ul>
                        <li>
                            <button className="text-white hover:bg-green-600 rounded-lg p-2 hover:bg-gray-200 w-full text-left" onClick={() => { setSelected('Đảng viên'); setShowSelect(false); }}>Đảng viên</button>
                        </li>
                        <li>
                            <button className="text-white hover:bg-green-600 rounded-lg p-2 hover:bg-gray-200 w-full text-left" onClick={() => { setSelected('Đoàn viên'); setShowSelect(false) }}>Đoàn viên</button>
                        </li>
                        <li>
                            <button className="text-white hover:bg-green-600 rounded-lg p-2 hover:bg-gray-200 w-full text-left" onClick={() => { setSelected('Không'); setShowSelect(false) }}>Không</button>
                        </li>
                    </ul>
                </div>
            }
        </div>

    );
};
export default SelectComponent;