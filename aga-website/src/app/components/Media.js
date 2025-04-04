import { FaGithubSquare, FaInstagramSquare  } from "react-icons/fa";
import { FaSquareXTwitter, FaLinkedin } from "react-icons/fa6";

export default function Media({size =""}) {
    return(
        <div className="flex space-x-3"> 
            <a href="https://egggame.org/" target="_blank" rel="noopener noreferrer">
                <FaGithubSquare size={size} /></a>
            <a href="https://egggame.org/" target="_blank" rel="noopener noreferrer">
                <FaSquareXTwitter size={size} /></a>
            <a href="https://egggame.org/" target="_blank" rel="noopener noreferrer">
                <FaInstagramSquare size={size} /></a>
            <a href="https://egggame.org/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={size} /></a>
        </div>
    );
}