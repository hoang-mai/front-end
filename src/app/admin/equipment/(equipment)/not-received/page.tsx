"use client";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import { adminPendingEquipment } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Image from "next/image";
import NoContent from "@/app/Components/noContent";
import * as React from 'react';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EditIcon from '@mui/icons-material/Edit';

interface PendingEquipment {
  receiptId: number;
  equipmentName: string;
  equipmentDescription: string;
  distributionYear: number;
  quantity: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  manager?: string; // Added manager field
}

interface PendingData {
  student: Student;
  pendingCount: number;
  pendingEquipment: PendingEquipment[];
}

function convertDataToPendingData(data: any): PendingData[] {
  return data.map((item: any) => ({
    student: {
      id: item.student.id,
      name: item.student.name,
      email: item.student.email,
    },
    pendingCount: item.pending_count,
    pendingEquipment: item.pending_equipment.map((equipment: any) => ({
      receiptId: equipment.receipt_id,
      equipmentName: equipment.equipment_name,
      equipmentDescription: equipment.equipment_description,
      distributionYear: equipment.distribution_year,
      quantity: equipment.quantity,
    })),
  }));
}

function NotReceived() {
  const [value, setValue] = React.useState<Date | null>(new Date());
  const [pendingData, setPendingData] = useState<PendingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [selectedEquipment, setSelectedEquipment] = useState<PendingEquipment | null>(null);


  const fetchData = (selectedYear: number) => {
    setLoading(true);
    get(`${adminPendingEquipment}/${selectedYear}`, {})
      .then((res) => {
        setPendingData(convertDataToPendingData(res.data.data));
      }).catch((err) => {
        setError(err.data.message);
        toast.error(err.data.message);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(value?.getFullYear() ?? new Date().getFullYear());
  }, [value]);

  if (error) {
    return <div className='text-red-500'>{error}</div>
  }

  return (<>
    <div className="mb-6 w-30">
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker

        views={['year']} // 👈 chỉ hiện picker năm
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slotProps={{
                            textField: {
                                inputProps: {
                                    readOnly: true,
                                    
                                    
                                },
                                sx: {
                                    width: "100%",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        height: "2.5rem",
                                        borderColor: "var(--border-color)",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "var(--border-color-hover)",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "var(--border-color-focus)",
                                        borderWidth: "1px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "0.375rem",
                                        height: "2.5rem",
                                        "& fieldset": {
                                            borderColor: "var(--border-color)",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "var(--border-color-hover)",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "var(--border-color-focus)",
        
                                        }
                                    },
                                    "& .MuiInputBase-input": {
                                        paddingY: "0 !important",
                                        paddingX: "8px",
                                    },
                                },
                            },
                            popper: {
                                sx: {
                                    "& .Mui-selected": {
                                        backgroundColor: "#22c55e !important",
                                        color: "white",
                                    },
                                    "& .MuiPickersDay-root:hover": {
                                        backgroundColor: "#16a34a",
                                        color: "white",
                                    },
                                    zIndex:10001,
                                },
                            },
                        }}
      />
    </LocalizationProvider>
    </div>

    {loading ? (
      <LoaderTable />
    ) : (
      <div className="space-y-3">
        {pendingData.length > 0 ? (
          pendingData.map((item, index) => (
            <Accordion
              key={index}
              sx={{
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '12px',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  border: '1px solid var(--border-color)',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'var(--color-text)' }} />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: 'rgba(35, 113, 77, 0.05)',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid rgba(35, 113, 77, 0.2)',
                  }
                }}
              >
                <div className="flex items-center w-full">
                  <Image 
                    src="/avatarDefault.svg" 
                    alt="Student avatar" 
                    width={40} 
                    height={40} 
                    className="rounded-full mr-3" 
                  />
                  <div className="flex flex-col">
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 'bold',
                        color: 'var(--color-text)'
                      }}
                    >
                      {item.student.name}
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {item.pendingCount} thiết bị chưa nhận
                      </span>
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)'
                      }}
                      className="flex items-center"
                    >
                      
                      {item.student.email}
                    </Typography>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: '16px' }}>
                <div className="space-y-3">
                  {item.pendingEquipment.map((equipment, idx) => (
                    <div key={idx} className="p-4 border border-green-100 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-600 text-sm">Tên thiết bị:</span>
                          <span className="ml-1 font-medium text-green-800">{equipment.equipmentName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Năm phân phối:</span>
                          <span className="ml-1 font-medium text-green-800">{equipment.distributionYear}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600 text-sm">Mô tả:</span>
                          <span className="ml-1 text-green-800">{equipment.equipmentDescription}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Số lượng:</span>
                          <span className="ml-1 font-medium text-green-800">{equipment.quantity}</span>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            <NoContent title="Không có học viên nào chưa nhận thiết bị" description={`Không có học viên nào chưa nhận thiết bị năm ${value?.getFullYear()}`} />
          </div>
        )}
      </div>
    )}
  </>);
}

export default NotReceived;