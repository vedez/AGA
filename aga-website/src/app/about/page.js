"use client";

import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import Logo from "@/app/components/Logo";
import RegisterLogin from "@/app/components/RegisterLogin";
import Slogan from "@/app/components/Slogan";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";


export default function About() {
    const { language, setLanguage, translations } = useTranslation();

    return (
        <main>
            <div>
                <Logo />
                <RegisterLogin />
                <LanguageSwitcher/>
            </div>
            <div>
                <Navbar />
            </div>
            <div>
                <div>
                    <Image
                        src="/favicon.ico"
                        alt="Next.js logo"
                        width={180}
                        height={38}
                        priority
                    />
                </div>
                <article>
                    <h1>About AGA</h1>
                    <div><Slogan /></div>

                    <p>
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    </p>

                    <h2>Looda Doot</h2>
                    <p>
                        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
                        ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, 
                        sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, 
                        quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure 
                        reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                    </p>
                </article>
            </div>

            <Footer />
        </main>
    );
}
