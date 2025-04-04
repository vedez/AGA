"use client";

import Logo from "@/app/components/Logo";
import Footer from "@/app/components/Footer";
import ShortNav from "@/app/components/ShortNav";
import Adverts from "@/app/components/Adverts";
import ContactForm from "@/app/components/ContactForm";
import ToolInfo from "@/app/components/ToolInfo";


export default function Help() {
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
