"use client";

import useTranslation from "@/hooks/useTranslation";
import useUnitWordsRotator from "@/hooks/useUnitWordsRotator";
import usePageBackground from "@/hooks/usePageBackground";
import Logo from "@/app/components/Logo";
import ShortNav from "@/app/components/ShortNav";
import Footer from "@/app/components/Footer";
import Media from "@/app/components/Media";
import Image from "next/image";
import { FaTasks } from "react-icons/fa";
import { BsCalendarDate, BsChatSquareHeartFill } from "react-icons/bs";
import { MdCamera } from "react-icons/md";

export default function About() {
    const { language, translations } = useTranslation();
    const currentWord = useUnitWordsRotator(language);
    
    usePageBackground('TERTIARY', 0.7);

    return (
        <div className="flex flex-col screen-size relative">     
            <div className="center">
                <Logo />
                <ShortNav />
            </div>
            
            <div className="flex-1 px-4 py-12 md:px-8 lg:px-16 max-w-7xl mx-auto relative">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-full md:w-2/5 max-w-sm mx-auto md:mx-0 md:mt-24">
                        <div className="w-full relative max-w-xs sm:max-w-sm mx-auto">
                            <div className="absolute -bottom-2 -left-2 sm:-bottom-8 sm:-left-8 w-[90%] h-[90%] bg-[#17343d] rounded-lg z-0"></div>
                            
                            <div className="relative rounded-lg overflow-hidden p-4">
                                <div className="rounded-lg overflow-hidden">
                                    <Image
                                        src="/assets/people-about.png"
                                        alt="People in a group"
                                        width={500}
                                        height={500}
                                        className="w-full h-auto object-cover border border-1 border-[#d5b281]"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-3/5 mx-auto text-center md:text-left max-w-lg md:max-w-none pt-8 md:pt-0">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{translations.about?.about_us_title || "About Us"}</h1>
                            <h2 className="text-2xl md:text-2xl italic mb-6">{translations.about?.what_is_aga || "What is AGA?"}</h2>
            
                            <p className="text-base md:text-lg text-justify">
                                {translations.about?.intro_description || "AGA is more than just an organisation tool — it’s a supportive companion for individuals who find it difficult to structure, prioritise, and manage their daily routines. Built with empathy and intention, AGA is designed to bring clarity to the chaos by helping users break down their responsibilities into achievable steps — one unit at a time."}
                            </p>

                            <div className="relative rounded-lg overflow-hidden w-3/5 h-auto mx-auto ">
                                <div className="rounded-lg overflow-hidden">
                                    <Image
                                        src="/assets/unit-slogan.png"
                                        alt="Units"
                                        width={500}
                                        height={500}
                                        className="w-full h-auto object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                            
                            <p className="text-base md:text-lg text-justify">
                                {translations.about?.units_core_idea|| "The idea of “units” lies at the core of AGA. Each unit represents a single step toward a larger goal. First one unit cube, then ten, then a hundred, and eventually a thousand—together forming a greater whole."}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start py-4">
                    <div className="space-y-6">   
                        <div className="text-[#3d9cb4] text-2xl sm:text-3xl font-bold text-center">                         
                            <h2>
                                {translations.slogan?.one || "ONE"}

                                <span
                                    id="changing-word"
                                    className="text-[#67d360] transition-opacity duration-500 ease-in-out"
                                >
                                    {" "}{currentWord}{" "}
                                </span>

                                {translations.slogan?.at_a_time || "AT A TIME"}
                            </h2>
                        </div>

                        <p className="text-base md:text-lg text-justify">  
                            {translations.about?.unit_slogan_paragraph || "This illustrates that every accomplishment is both a milestone and a stepping stone on the path to something bigger. They become milestones in a larger journey, encouraging steady forward movement. This concept inspires our slogan: “One Unit at a Time” — a reminder that progress doesn’t need to be fast or perfect; it just needs to be consistent."}
                        </p>

                        <div className="relative rounded-lg overflow-hidden w-11/12 sm:w-3/5 h-auto mx-auto border border-1 border-[#d5b281]">
                            <div className="rounded-lg overflow-hidden">
                                <Image
                                    src="/assets/creator-unorganised-about.png"
                                    alt="Units"
                                    width={500}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    
                        <p className="text-base md:text-lg text-justify">
                            {translations.about?.creator_backstory || "AGA was born from a personal struggle. The creator faced a daily battle with overwhelming responsibilities, where tasks blurred into one unmanageable mess. Traditional scheduling apps didn’t help — they lacked the connection, care, and adaptability needed in moments of stress. AGA was created to fill that gap. It doesn’t just organise tasks; it actively supports users in staying focused, balanced, and well. AGA provides tools such as:"}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0 text-m text-center font-bold">
                            <div className="w-48 h-32 flex flex-col items-center justify-center space-y-2 feature-element bg-gradient-to-r from-[#6590df] to-[#adf0f9] text-white">
                                <FaTasks className="text-4xl" />
                                <span>{translations.about?.feature_task_tracker || "Task Tracker"}</span>
                            </div>
                            <div className="w-48 h-32 flex flex-col items-center justify-center space-y-2 feature-element bg-gradient-to-r from-[#e56baa] to-[#ffd176] text-white">
                                <BsCalendarDate className="text-4xl" />
                                <span>{translations.about?.feature_calendar_weather || "Calendar & Weather"}</span>
                            </div>
                            <div className="w-48 h-32 flex flex-col items-center justify-center space-y-2 feature-element bg-gradient-to-r from-[#2f313a] to-[#5b606d] text-white">
                                <MdCamera className="text-4xl" />
                                <span>{translations.about?.feature_focus_mode || "Focus Mode</span"}</span>
                            </div>
                            <div className="w-48 h-32 flex flex-col items-center justify-center space-y-2 feature-element bg-gradient-to-r from-[#79d862] to-[#e2e667] text-white">
                                <BsChatSquareHeartFill  className="text-4xl" />
                                <span>{translations.about?.feature_wellbeing_insights || "Wellbeing Insights</span"}</span>
                            </div>
                        </div>

                        <p className="text-base md:text-lg text-justify italic">
                            {translations.about?.creator_quote || '"Whether you\'re feeling overwhelmed, stuck, or simply looking to build better routines, AGA is here to walk with you — just as it walked with me — one unit at a time." - zedev (Creator)'}
                        </p>


                        <div className="relative rounded-lg overflow-hidden w-11/12 sm:w-3/5 h-auto mx-auto border border-1 border-[#d5b281]">
                            <div className="rounded-lg overflow-hidden">
                                <Image
                                    src="/assets/creator-organised-about.png"
                                    alt="Units"
                                    width={500}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center py-8">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        {translations.about?.thank_you || "Thank you for choosing AGA!"}
                    </h2>

                    <p className="text-base md:text-lg text-justify max-w-3xl">
                        {translations.about?.thank_you_message || (
                        <>
                            Your support means the world to us. AGA was built with care, inspired by real struggles, and designed to bring clarity, focus, and wellbeing to your daily life.
                            We truly hope it’s helped you feel more in control, more at ease, and more inspired to grow. <br /><br />
                            Together, one unit at a time, we’re not just getting things done — we’re becoming better, more balanced versions of ourselves.
                            <br />
                            Here’s to your journey, and thank you for letting AGA be a part of it.
                        </>
                        )}
                    </p>

                    <h3 className="text-lg font-bold text-center mt-5 py-3">{translations.about?.media_share || "Find us on other platforms"}</h3>
                    <Media size={40} />
                </div>
            </div>

            <Footer className="mt-auto relative"/>
        </div>
    );
}
