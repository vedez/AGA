"use client";

import useTranslation from "@/hooks/useTranslation";
import Logo from "@/app/components/Logo";
import ShortNav from "@/app/components/ShortNav";
import Footer from "@/app/components/Footer";
import AboutImage from "@/app/components/AboutImage";
import AboutText from "@/app/components/AboutText";

export default function About() {
    const { translations } = useTranslation();

    return (
        <div className="flex flex-col screen-size relative">     
            {/* Header */}
            <div className="center">
                <Logo />
                <ShortNav />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 px-4 py-12 md:px-8 lg:px-16 max-w-7xl mx-auto relative">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

                    {/* Image - On top for mobile, on left for desktop */}
                    <div className="w-full md:w-2/5 max-w-sm mx-auto md:mx-0 md:mt-24">
                        <AboutImage />
                    </div>
                    
                    {/* Content - Below image on mobile, on right for desktop */}
                    <div className="w-full md:w-3/5 mx-auto text-center md:text-left max-w-lg md:max-w-none pt-8 md:pt-0">
                        <AboutText />
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <Footer className="mt-auto relative"/>
        </div>
    );
}
