import useTranslation from "@/hooks/useTranslation";

export default function RegisterLogin() {
    const { translations } = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
            <button className="main-button small-screen">{translations.button?.signIn || "Sign In"}</button>
            <button className="secondary-button small-screen hide">{translations.button?.createAccount || "Create Account?"}</button>
        </div>
    );
}
