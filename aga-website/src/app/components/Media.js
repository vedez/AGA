import useTranslation from "@/hooks/useTranslation";
import { FaGithubSquare, FaInstagramSquare  } from "react-icons/fa";
import { FaSquareXTwitter, FaLinkedin } from "react-icons/fa6";



export default function Media() {
    return(
        <div className="flex space-x-3"> 
            <button><FaGithubSquare size={25}/></button>
            <button><FaSquareXTwitter size={25}/></button>
            <button><FaInstagramSquare  size={25}/></button>
            <button><FaLinkedin size={25}/></button>
        </div>
    );
}