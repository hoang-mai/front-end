import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCoins, faCalendarAlt, faSave, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { put } from '@/app/Services/callApi';
import { adminAllowances } from '@/app/Services/api';
import SelectComponent from '@/app/Components/select';
import PersonIcon from '@mui/icons-material/Person';

export interface Allowance extends Record<string, any> {
    id: number;
    userId: number;
    month: string;
    year: number;
    amount: string;
    received: string;
    receivedAt: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface EditAllowanceModalProps {
    readonly data: Allowance;
    readonly showEdit: boolean;
    readonly setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas?: React.Dispatch<React.SetStateAction<Allowance[]>>;
}

function EditAllowanceModal({
    data,
    showEdit,
    setShowEdit,
    setDatas,
}: EditAllowanceModalProps) {
    const [amount, setAmount] = useState<string>(data.amount.replace(/\./g, '').replace(',', '.'));
    const [notes, setNotes] = useState<string>(data.notes ?? '');
    const [month, setMonth] = useState<string>(data.month.split('/')[0]);
    const [year, setYear] = useState<string>(data.year.toString());
    const [error, setError] = useState<string>('');
    const [errorMonth, setErrorMonth] = useState<string>('');
    const [errorYear, setErrorYear] = useState<string>('');
    const [errorAmount, setErrorAmount] = useState<string>('');

    const receivedOptions: Option[] = [
        { id: 1, label: 'Đã nhận' },
        { id: 2, label: 'Chưa nhận' }
    ];

    const defaultReceivedOption: Option = { id: 0, label: 'Chọn trạng thái' };
    const [selectedReceivedOption, setSelectedReceivedOption] = useState<Option>(
        data.received === 'Đã nhận' ? receivedOptions[0] : receivedOptions[1]
    );

    const handleOnChangeMonth = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setErrorMonth("");
            setMonth(e.target.value);
            return;
        }
        if (isNaN(Number(e.target.value))) {
            setErrorMonth("Tháng không hợp lệ");
            return;
        }
        if (Number(e.target.value) < 1 || Number(e.target.value) > 12) {
            setErrorMonth("Tháng không hợp lệ");
            return;
        }
        setErrorMonth("");
        setMonth(e.target.value);
    }

    const handleOnChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setErrorYear("");
            setYear(value);
            return;
        }

        if (isNaN(Number(e.target.value))) {
            setErrorYear("Năm không hợp lệ");
            return;
        }
        if (value.length > 4 || (value.length === 4 && Number(value) < 1900)) {
            setErrorYear("Năm không hợp lệ");
            return;
        }
        setErrorYear("");
        setYear(value);
    };

    const handleOnChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setErrorAmount("");
            setAmount(value);
            return;
        }
        if (isNaN(Number(value))) {
            setErrorAmount("Số tiền không hợp lệ");
            return;
        }
        setErrorAmount("");
        setAmount(value);
    }

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!month || parseInt(month) < 1 || parseInt(month) > 12) {
            setErrorMonth('Tháng phải từ 1 đến 12');
            return;
        }

        if (!year || year.length !== 4) {
            setErrorYear('Năm phải có 4 chữ số');
            return;
        }

        const apiAmount = parseFloat(amount).toString();
        const received = selectedReceivedOption.id === 1;

        toast.promise(
            put(adminAllowances + '/' + data.id, {
                amount: apiAmount,
                notes: notes,
                received: received,
                month: month,
                year: parseInt(year),

            }),
            {
                pending: 'Đang cập nhật trợ cấp',
                success: 'Cập nhật trợ cấp thành công',
                error: 'Cập nhật trợ cấp thất bại',
            }
        ).then((res) => {
            const displayAmount = formatAmountForDisplay(apiAmount);

            setDatas?.((prev) =>
                prev
                    
                    .map((allowance) =>
                        allowance.id === data.id
                            ? {
                                ...allowance,
                                amount: displayAmount,
                                notes: notes,
                                month: `${month}/${year}`,
                                year: parseInt(year),
                                received: received ? 'Đã nhận' : 'Chưa nhận',
                                receivedAt: received ? new Date() : null,
                            }
                            : allowance
                    )
            );

            setShowEdit(false);
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        });
    };

    const formatAmountForDisplay = (amountStr: string): string => {
        const amount = parseFloat(amountStr);
        const [intPart, decimalPart = ''] = amount.toFixed(2).split('.');

        const formattedInt = Number(intPart).toLocaleString('vi-VN');

        if (decimalPart === '00') {
            return `${formattedInt}`;
        } else {
            return `${formattedInt},${decimalPart}`;
        }
    };

    return (
        <Modal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowEdit(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Chỉnh sửa trợ cấp</h2>
                </div>

                <div className="p-6 ">
                    

                    <form className="space-y-2">
                        <div className="form-group">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                Số tiền <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faCoins} className="text-gray-400" />
                                </div>
                                <input
                                    placeholder="Nhập số tiền"
                                    type="text"
                                    id="amount"
                                    value={amount}
                                    onChange={handleOnChangeAmount}
                                    className={`appearance-none block w-full pl-10 pr-12 py-3 border ${errorAmount ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorAmount ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                    VND
                                </span>
                            </div>
                            <p className='h-5 text-red-500 text-sm mt-1'>{errorAmount}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tháng <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                    </div>
                                    <input
                                        placeholder="1-12"
                                        type="text"
                                        id="month"
                                        value={month}
                                        onChange={handleOnChangeMonth}
                                        className={`appearance-none block w-full pl-10 py-3 border ${errorMonth ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorMonth ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                                    />
                                </div>
                                <p className='h-5 text-red-500 text-sm mt-1'>{errorMonth}</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                                    Năm <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                    </div>
                                    <input
                                        placeholder="YYYY"
                                        type="text"
                                        id="year"
                                        value={year}
                                        onChange={handleOnChangeYear}
                                        className={`appearance-none block w-full pl-10 py-3 border ${errorYear ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorYear ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                                    />
                                </div>
                                <p className='h-5 text-red-500 text-sm mt-1'>{errorYear}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label htmlFor="received" className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái <span className="text-red-500">*</span>
                                </label>
                                <SelectComponent
                                    selected={selectedReceivedOption}
                                    setSelected={setSelectedReceivedOption}
                                    options={receivedOptions}
                                    defaultOption={defaultReceivedOption}
                                    width="w-full"
                                />

                            </div>

                            <div className="form-group">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ghi chú
                                </label>
                                <div className="relative">
                                    <textarea
                                        placeholder="Thêm ghi chú (nếu có)"
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="appearance-none block w-full py-2 px-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)] resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6 items-center justify-center" >
                            <button
                                type="submit"
                                disabled={month === '' || year === '' || amount === '' || errorMonth !== '' || errorYear !== '' || errorAmount !== '' || year.length < 4}
                                className="btn-text inline-flex  justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200"
                                onClick={handleOnSubmit}
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Cập nhật trợ cấp
                            </button>
                            <button
                                onClick={() => setShowEdit(false)}
                                className="bg-red-700 text-white py-2.5 px-8 rounded-lg hover:bg-red-800 active:bg-red-900 focus:outline-none focus:shadow-outline font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center">
                                <FontAwesomeIcon icon={faXmark} className="mr-2" />
                                Hủy
                            </button>

                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    );
}

export default EditAllowanceModal;