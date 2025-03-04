import { vi } from "date-fns/locale/vi";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { FC } from "react";

interface DatePickerComponentProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    lgWidth?: string;
    mdWidth?: string;
    smWidth?: string;
    xsWidth?: string;
}

const DatePickerComponent: FC<DatePickerComponentProps> = ({ value, onChange, lgWidth, mdWidth,smWidth,xsWidth }) => {

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
                disableHighlightToday
                value={value}
                onChange={onChange}
                dayOfWeekFormatter={(day) => format(day, "eee", { locale: vi }).replace("Thứ ", "T")}
                slotProps={{
                    textField: {
                        sx: {
                            width: { xs: xsWidth, sm: smWidth, md: mdWidth, lg: lgWidth },
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
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
};
export default DatePickerComponent;