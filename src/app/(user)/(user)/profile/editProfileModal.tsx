import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import DatePickerComponent from "@/app/Components/datePicker";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SelectComponent from "@/app/Components/select";


interface EditProfileModalProps {
    showEdit: boolean;
    setShowEdit: (show: boolean) => void;
}
const EditProfileModal: React.FC<EditProfileModalProps> = ({
    showEdit,
    setShowEdit,
}) => {
    const [selected, setSelected] = React.useState<string>('Đảng viên / Đoàn viên');

    return (
        <Modal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            className="flex items-center justify-center z-modal" 
        >
            <Box className='xl:w-[60%] lg:w-[70%] md:w-[80%] h-[90%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Chỉnh sửa thông tin</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowEdit(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <div className='flex-1 w-full flex flex-col gap-4 overflow-y-auto '>
                    <h2 className='text-xl font-semibold text-(--color-text)'>Thông tin cá nhân</h2>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="fullName" className="text-lg md:w-1/3">Họ và tên:</label>
                        <input id="fullName" placeholder="Họ và tên" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="dob" className="text-lg md:w-1/3">Ngày sinh:</label>
                        <DatePickerComponent smWidth={"66.67%"} xsWidth={"100%"} value={null} onChange={(date) => console.log(date)} />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="rank" className="text-lg md:w-1/3">Cấp bậc:</label>
                        <input id="rank" placeholder="Cấp bậc" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="hometown" className="text-lg md:w-1/3">Quê quán:</label>
                        <input id="hometown" placeholder="Quê quán" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="unit" className="text-lg md:w-1/3">Đơn vị công tác:</label>
                        <input id="unit" placeholder="Đơn vị công tác" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="year" className="text-lg md:w-1/3">Năm công tác:</label>
                        <input id="year" placeholder="Năm công tác" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="party" className="text-lg md:w-1/3">Đảng viên / Đoàn viên:</label>
                        <SelectComponent mdWidth="md:w-2/3" width="w-full" options={['Đảng viên', 'Đoàn viên', 'Không']} defaultOption="Đảng viên / Đoàn viên" opacity={true} selected={selected} setSelected={setSelected} />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="phoneNumber" className="text-lg md:w-1/3">Số điện thoại:</label>
                        <input id="phoneNumber" placeholder="Số điện thoại" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' pattern="\d*" maxLength={10} onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                        }} />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="permanentAddress" className="text-lg md:w-1/3">Hộ khẩu thường chú:</label>
                        <input id="permanentAddress" placeholder="Hộ khẩu thường chú" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col gap-4'>
                        <h2 className='text-xl font-semibold text-(--color-text)'>Thông tin bố</h2>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="fatherFullName" className="text-lg md:w-1/3">Họ và tên:</label>
                            <input id="fatherFullName" placeholder="Họ và tên" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="fatherDob" className="text-lg md:w-1/3">Ngày sinh:</label>
                            <DatePickerComponent smWidth={"66.67%"} xsWidth={"100%"} value={null} onChange={(date) => console.log(date)} />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="fatherPhoneNumber" className="text-lg md:w-1/3">Số điện thoại:</label>
                            <input id="fatherPhoneNumber" placeholder="Số điện thoại" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' pattern="\d*" maxLength={10} onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                            }} />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="fatherHometown" className="text-lg md:w-1/3">Quê quán:</label>
                            <input id="fatherHometown" placeholder="Quê quán" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="fatherOccupation" className="text-lg md:w-1/3">Nghề nghiệp:</label>
                            <input id="fatherOccupation" placeholder="Nghề nghiệp" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <h2 className='text-xl font-semibold text-(--color-text)'>Thông tin mẹ</h2>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="motherFullName" className="text-lg md:w-1/3">Họ và tên:</label>
                            <input id="motherFullName" placeholder="Họ và tên" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="motherDob" className="text-lg md:w-1/3">Ngày sinh:</label>
                            <DatePickerComponent smWidth={"66.67%"} xsWidth={"100%"} value={null} onChange={(date) => console.log(date)} />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="motherPhoneNumber" className="text-lg md:w-1/3">Số điện thoại:</label>
                            <input id="motherPhoneNumber" placeholder="Số điện thoại" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' pattern="\d*" maxLength={10} onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                            }} />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="motherHometown" className="text-lg md:w-1/3">Quê quán:</label>
                            <input id="motherHometown" placeholder="Quê quán" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="motherOccupation" className="text-lg md:w-1/3">Nghề nghiệp:</label>
                            <input id="motherOccupation" placeholder="Nghề nghiệp" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>
                    </div>
                </div>
                <div className='flex justify-center gap-4 w-full mt-4'>
                    <button className='btn-text text-white w-20 h-10 rounded-lg'>Lưu</button>
                    <button className='bg-red-700 text-white w-20 h-10 rounded-lg hover:bg-red-800 active:bg-red-900' onClick={() => setShowEdit(false)}>Hủy</button>
                </div>
            </Box>
        </Modal>
    );
};

export default EditProfileModal;