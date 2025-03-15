import useTranslation from "@/hooks/useTranslation";

export default function Login() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <div>
                <h1>{translations.signin || "Sign In"}</h1>
                <h2>{translations.notRegiestered || "New member? Sign Up"}</h2>
            </div>

            <form>
                
            </form>
        </div>
    );
}