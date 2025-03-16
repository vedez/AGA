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


export default function Main() {
    const { language, setLanguage, translations } = useTranslation();

    return (
        <main>
            <div className="center">
                <Logo />
                <ShortNav />
            </div>

            <div>
                <div>
                    <Weather />
                    <FocusMode />
                </div>
                <div>
                    <TaskSetter />
                </div>
                <div>
                    <Calendar />
                    <Mood />
                </div>
            </div>
            <Footer />
        </main>
    );
}
