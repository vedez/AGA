"use client";

import useTranslation from "@/hooks/useTranslation";
import Logo from "@/app/components/Logo";
import Footer from "@/app/components/Footer";
import ShortNav from "@/app/components/ShortNav";
import Adverts from "@/app/components/Adverts";
import ContactForm from "@/app/components/ContactForm";
import ToolInfo from "@/app/components/ToolInfo";


export default function Help() {
    const { language, setLanguage, translations } = useTranslation();

    return (
        <main>
            <div>
                <Logo />
                <ShortNav />
            </div>

            <div>
                <div><Adverts /></div>
                <div>
                    <ContactForm />
                </div>
                <div><Adverts /></div>
            </div>
            <div>
                <ToolInfo />
            </div>
            <Footer />
        </main>
    );
}
