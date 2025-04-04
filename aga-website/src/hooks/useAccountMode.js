import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function useAccountMode() {
    const searchParams = useSearchParams();
    const [activeMode, setActiveMode] = useState("create");

    useEffect(() => {
        // get the mode from the URL query
        const mode = searchParams.get("mode");
        // set the active mode based on the query param (default create)
        if (mode === "login") {
            setActiveMode("login");
        } else {
            setActiveMode("create");
        }
    }, [searchParams]);

    // function to switch between create account and login
    const switchMode = () => {
        setActiveMode(activeMode === "create" ? "login" : "create");
    };

    return { activeMode, switchMode };
} 