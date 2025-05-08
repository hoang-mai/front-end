'use client'
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { adminEquipmentDistribution, adminEquipmentType } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddEquipmentDistribution from "./addEquipmentDistribution";
import EditEquipmentDistribution from "../[id]/editEquipmentDistribution";
import { useRouter } from "next/navigation";
import NotReceived from "./not-received/page";
import NoContent from "@/app/Components/noContent";

interface EquipmentDistribution extends Record<string, any> {

  id: number,
  year: number,
  equipmentTypeId: number,
  quantity: number,
  createdAt: Date,
  updatedAt: Date,
  equipmentTypeName: string,
  equipmentTypeDescription: string,
  equipmentTypeCreatedAt: Date,
  equipmentTypeUpdatedAt: Date
}
interface EquipmentType extends Record<string, any> {
  id: number,
  name: string,
  description: string,
  createdAt: Date,
  updatedAt: Date
}

function convertDataToEquipmentType(data: any): EquipmentType[] {
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  }));
}
function convertDataToEquipmentDistribution(data: any): EquipmentDistribution[] {
  return data.map((item: any) => ({
    id: item.id,
    year: item.year,
    equipmentTypeId: item.equipment_type_id,
    quantity: item.quantity,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
    equipmentTypeName: item.equipment_type.name,
    equipmentTypeDescription: item.equipment_type.description,
    equipmentTypeCreatedAt: new Date(item.equipment_type.created_at),
    equipmentTypeUpdatedAt: new Date(item.equipment_type.updated_at)
  }));
}
interface HeadCell {
  id: keyof EquipmentDistribution;
  label: string;
}
const headCells: HeadCell[] = [
  { id: 'year', label: 'Năm học', },
  { id: 'equipmentTypeName', label: 'Tên quân tư trang', },
  { id: 'quantity', label: 'Số lượng', },
  { id: 'equipmentTypeDescription', label: 'Mô tả', },
  { id: 'createdAt', label: 'Ngày tạo', },
  { id: 'updatedAt', label: 'Ngày cập nhật', },
];
const modal = {
  headTitle: 'Bạn có chắc chắn muốn xóa đợt cấp phát này không?',
  successMessage: 'Xóa đợt cấp phát thành công',
  errorMessage: 'Xóa đợt cấp phát thất bại',
  url: adminEquipmentDistribution,
}
function Equipment() {
  const router = useRouter();
  const [equipmentDistribution, setEquipmentDistribution] = useState<EquipmentDistribution[]>([]);
  const [equipmentType, setEquipmentType] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }


  useEffect(() => {
    get(adminEquipmentDistribution, {})
      .then((res) => {
        setEquipmentDistribution(convertDataToEquipmentDistribution(res.data.data));
      }).catch((err) => {
        setError(err.data.message);
        toast.error(err.data.message);
      }).finally(() => {
        setLoading(false);
      });
    get(adminEquipmentType, {})
      .then((res) => {
        setEquipmentType(convertDataToEquipmentType(res.data.data));
      }).catch((err) => {
        setError(err.data.message);
        toast.error(err.data.message);
      }).finally(() => {
        setLoading(false);
      });

  }, []);

  if (error) {
    return <div className='text-red-500'>{error}</div>
  }

  return (
    <>
      <div className='w-full flex justify-between items-center relative px-6 mb-4'>
        <div className='relative'>
          <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
          <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' />
        </div>

        <button className='btn-text text-white py-2 px-4 w-60 rounded-md' onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className='mr-2' />
          Tạo đợt cấp phát mới
        </button>

      </div>

      {loading ? (
        <LoaderTable />
      ) : (
        <>
          {equipmentDistribution.length === 0 ? <NoContent title="Không có đợt cấp phát nào" description="Vui lòng tạo thêm đợt cấp phát" />

            :
            <>
              <TableComponent
                dataCells={equipmentDistribution}
                headCells={headCells}
                search={search}
                onRowClick={(id) => {
                  router.push(`/admin/equipment/${id}`);
                }}
                modal={modal}
                EditComponent={EditEquipmentDistribution}
                setDatas={setEquipmentDistribution}
              />

              {showModal && <AddEquipmentDistribution equipmentType={equipmentType} setShowModal={setShowModal} showModal={showModal} setDatas={setEquipmentDistribution} />}

            </>
          }
        </>
      )}
    </>
  );
}

export default Equipment;