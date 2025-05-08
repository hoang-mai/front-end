'use client'
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { get } from "./Services/callApi";
import { authTest } from "./Services/api";
import { useImage } from "./hooks/useImage";

function CheckRole() {
    const router = useRouter();
    const pathname = usePathname();
    const path = pathname.split("/")[1];
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login");
        } else {
            get(authTest).then((res) => {
                useImage.getState().setImage(res.data.user.image);
                switch (res.data.user.role) {
                    case 'manager':
                        if (path !== "manager") {
                            router.push("/manager");
                        }

                        return;
                    case 'admin':
                        if (path !== "admin") {
                            router.push("/admin");
                        }
                        return;
                    default:
                        if (path === "admin" || path === "manager") {
                            router.push("/");
                        }
                        return;
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