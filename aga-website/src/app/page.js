"use client";
import Link from "next/link";

import useTranslation from "@/hooks/useTranslation";
import Logo from "@/app/components/Logo";
import Slogan from "@/app/components/Slogan";
import Footer from "@/app/components/Footer";
import ShortNav from "@/app/components/ShortNav";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useAuth } from "@/app/utils/AuthContext";


export default function Home() {
    const { translations } = useTranslation();

    return (
        <div className="flex flex-col screen-size">
            <main className="flex-grow">
                <div className="center">
                    <Logo />
                    <div className="horizontal-flex">
                        <ShortNav />
                    </div>
                </div>
                    <div className="flex items-center justify-start h-full">

                    <div className="w-full max-w-l sm:px-20 px-0">
                        <Slogan />

                        <p className="text-[#1f697c] text-bg-light-shadow leading-relaxed text-m py-4 max-w-md">
                            {translations.description ||
                            "The Advanced Guidance Assistant is designed to help you manage daily tasks and maintain a structured, balanced lifestyle, empowering you to unlock your full potential."}
                        </p>

                        <Link href="/about"> 
                            <button  className="third-button">{translations.button?.aboutUs || "About Us"}</button>
                        </Link>
                    </div>
                </div>

            </main>
            <Footer className="mt-auto" />
        </div>
    );
}