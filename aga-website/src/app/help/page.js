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

            <div className="flex sm:flex-row flex-col gap-5 justify-center md:p-10 py-5 center">
                <div className="flex flex-col hide sm:flex w-auto sm:w-[20%] md:w-[20%] lg:w-[33%] items-end">
                    <Adverts />
                </div>
                <div className="flex flex-col w-full sm:w-[60%] md:w-[60%] lg:w-[33%]">
                    <ContactForm />
                </div>
                
                <div className="flex flex-col w-auto sm:w-[20%] md:w-[20%] lg:w-[33%] items-start">
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
