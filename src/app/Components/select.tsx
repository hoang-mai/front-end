'use Client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FC, useState, useEffect,useRef } from 'react';

interface SelectProps {
    selected: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>
    options: string[];
    defaultOption: string;
    opacity?: boolean;
    mdWidth?: string;
    lgWidth?: string;
    width?: string;
}
const SelectComponent: FC<SelectProps> = ({ selected, setSelected, options, defaultOption, opacity, mdWidth, lgWidth, width }) => {
    const [showSelect, setShowSelect] = useState<boolean>(false);
    const showSelectRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (showSelectRef.current && !showSelectRef.current.contains(event.target as Node)) {
                setShowSelect(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSelectRef]);
    return (

        <div ref={showSelectRef} className={`relative h-10 ${mdWidth} ${lgWidth} ${width}`}>
            <button onClick={(e) =>{ 
                e.preventDefault()
                setShowSelect((prev) => !prev)
            }
        } 
        className="relative h-10 w-full" >
                <p
                    className={`${(selected === defaultOption && opacity) ? "text-gray-500" : "text-black"}  flex items-center h-full w-full border rounded-lg border-(--border-color) px-2 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus)`}
                >
                    {selected}
                </p>
                <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 top-3 text-gray-400" />
            </button>
            {showSelect &&
                <div className="absolute w-full bg-green-500 border border-(--border-color) rounded-lg z-10">
                    <ul>
                        {options.map((option) =>
                            <li key={option}>
                                <button className="text-white hover:bg-green-600 rounded-lg p-2 hover:bg-gray-200 w-full text-left" onClick={() => { setSelected(option); setShowSelect(false) }}>{option}</button>
                            </li>
                        )
                        }
                    </ul>
                </div>
            }
        </div>

    );
};
export default SelectComponent;