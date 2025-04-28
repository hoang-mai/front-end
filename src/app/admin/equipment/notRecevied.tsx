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
import SelectComponent from "@/app/Components/select";
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
    const [pendingData, setPendingData] = useState<PendingData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    
    useEffect(() => {
        get(adminPendingEquipment, {})
            .then((res) => {
                setPendingData(convertDataToPendingData(res.data.data));
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
    
    return (<>
        {loading ? (
            <LoaderTable />
          ) : (
            <>
              {pendingData.length > 0 ? (
                pendingData.map((item, index) => (
                    <Accordion key={index} >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography component="span">Accordion 1</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </AccordionDetails>
                  </Accordion>
                ))
              ):(
                <div className="text-center text-gray-500">Không có dữ liệu</div>
              )}
            </>
          )}
          </>
    );
}

export default NotReceived;