import useTranslation from "@/hooks/useTranslation";

export default function CreateAccount() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <div>
                <h1>{translations.createNewAccount || "Create New Account"}</h1>
                <h2>{translations.alreadyRegistered || "Already Registered? Login"}</h2>
            </div>

            <form>

            </form>
        </div>
    );
}