import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function useAccountMode() {
    const searchParams = useSearchParams();
    const [activeMode, setActiveMode] = useState("create");

    useEffect(() => {
        // Get the mode from the URL query parameter
        const mode = searchParams.get("mode");
        // Set the active mode based on the query parameter, default to "create"
        if (mode === "login") {
            setActiveMode("login");
        } else {
            setActiveMode("create");
        }
    }, [searchParams]);

    // Function to switch between create account and login
    const switchMode = () => {
        setActiveMode(activeMode === "create" ? "login" : "create");
    };

    return { activeMode, switchMode };
} 