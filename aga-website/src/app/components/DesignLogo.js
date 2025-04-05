import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";

export default function DesignLogo() {
    const { translations } = useTranslation();

    return(
        <div className="flex flex-col items-center justify-center ">
            <div className="mb-6 rounded-2xl shadow-2xl">
                <Image
                    src="/assets/logo-animated.gif"
                    alt={translations.altText?.logo || "AGA Logo"}
                    width={250}
                    height={250}
                    className="rounded-2xl"
                    unoptimized
                    priority
                />
            </div>
            
            <h1 className="text-4xl pt-4 font-bold text-white mb-2">AGA</h1>
            <h2 className="text-xl text-white font-bold text-center font-mono">Advanced Guidance Assistance</h2>
        </div>
    );
}