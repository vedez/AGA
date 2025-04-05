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

            <div className="flex sm:flex-row flex-col gap-5 justify-center sm:p-10 py-5 center">
                <div className="flex flex-col gap-5 hide">
                    <Adverts />
                </div>
                <div className="flex flex-col gap-5 w-full">
                    <ContactForm />
                </div>
                <div className="flex flex-col gap-5">
                    <Adverts />
                </div>
            </div>
            <div className="mb-5">
                <ToolInfo />
            </div>

            <Footer />
        </main>
    );
}
