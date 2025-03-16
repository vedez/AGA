import useTranslation from "@/hooks/useTranslation";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileIcon() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div id="defeault-profile-icon">
            <FaUserCircle size={30}/>
        </div>
    );
}