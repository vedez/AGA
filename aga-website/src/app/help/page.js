"use client";

import Logo from "@/app/components/Logo";
import Footer from "@/app/components/Footer";
import ShortNav from "@/app/components/ShortNav";
import Adverts from "@/app/components/Adverts";
import ContactForm from "@/app/components/ContactForm";
import ToolInfo from "@/app/components/ToolInfo";
import usePageBackground from "@/hooks/usePageBackground";

export default function Help() {
    usePageBackground('SECONDARY', 0.7);

    return (
        <main>
            <div className="center">
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
