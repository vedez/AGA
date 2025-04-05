"use client";

import useTranslation from "@/hooks/useTranslation";
import usePageBackground from "@/hooks/usePageBackground";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
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

    usePageBackground('TERTIARY', 0.7);

    return (
        <ProtectedRoute>
            <div className=" flex flex-col screen-size">
                <main className="flex-grow">
                    <div className="center">
                        <Logo />
                        <ShortNav />
                    </div>

                    <div className="flex flex-row gap-5 justify-between">
                        <div className="flex flex-col gap-5">
                            <Calendar />
                            <Weather />
                        </div>
                        <div className="flex flex-col gap-5">
                            <TaskSetter />
                        </div>
                        <div className="flex flex-col gap-5">
                            <Mood />
                            <FocusMode />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}
