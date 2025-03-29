'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { get } from "./Services/callApi";
import { authTest } from "./Services/api";

function CheckRole() {
    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login");
        } else {
            get(authTest).then((res) => {
                switch (res.data.user.role) {
                    case 'manager':
                        break;
                    case 'admin':
                        router.push("/admin");
                        break;
                    default:
                        router.push("/");
                        break;
                }
            });
        }
    }, [])
    return (
        <>
        </>
    );
}

export default CheckRole;