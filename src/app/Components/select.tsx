'use Client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FC, useState, useEffect,useRef } from 'react';

interface SelectProps {
    selected: Option;
    setSelected: React.Dispatch<React.SetStateAction<Option>>
    options: Option[];
    defaultOption: Option;
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
                    className={`${(selected.label === defaultOption.label && opacity) ? "text-gray-500" : "text-black"}  flex items-center h-full w-full border rounded-lg border-(--border-color) px-2 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus)`}
                >
                    {selected.label || defaultOption.label}
                </p>
                <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 top-3 text-gray-400" />
            </button>
            {showSelect &&
                <div className="absolute w-full bg-green-100 border border-(--border-color) rounded-lg z-10">
                    <ul className="max-h-50 overflow-y-auto custom-scrollbar">
                        {options.map((option) =>
                            <li key={option.id}>
                                <button className=" hover:bg-green-300 rounded-lg p-2 w-full text-left" onClick={() => { setSelected(option); setShowSelect(false) }}>{option.label}</button>
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