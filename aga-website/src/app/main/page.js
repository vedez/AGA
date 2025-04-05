"use client";

import useTranslation from "@/hooks/useTranslation";
import Logo from "@/app/components/Logo";
import Footer from "@/app/components/Footer";
import ShortNav from "@/app/components/ShortNav";
import Weather from "@/app/components/Weather";
import FocusMode from "@/app/components/FocusMode";
import TaskSetter from "@/app/components/TaskSetter";
import Calendar from "@/app/components/Calendar";
import Mood from "@/app/components/Mood";
import usePageBackground from "@/hooks/usePageBackground";

export default function Main() {
    const { language, setLanguage, translations } = useTranslation();

    usePageBackground('TERTIARY', 0.7);

    return (
        <div className="flex flex-col screen-size">
            <main className="flex-grow flex flex-col">
                <div className="center">
                    <Logo />
                    <ShortNav />
                </div>

                <div className="flex-grow flex mt-[10%] sm:mt-[5%] mb-[10%] sm:mb-[5%]">
                    <div className="flex flex-col md:flex-row gap-5 justify-between px-4 w-full">
                        <div className="flex flex-col gap-5 w-full md:w-1/4 items-end">
                            <Calendar />
                            <Weather />
                        </div>

                        <div className="flex flex-col gap-5 w-full md:w-1/3">
                            <TaskSetter />
                        </div>

                        <div className="flex flex-col gap-5 w-full md:w-1/4 items-start">
                            <Mood />
                            <FocusMode />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
