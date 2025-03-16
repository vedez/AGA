"use client";

import useTranslation from "@/hooks/useTranslation";

export default function AboutText() {
    const { translations } = useTranslation();
    
    return (
        <div className="w-full">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About AGA</h1>
            <h2 className="text-2xl md:text-3xl italic mb-6">Lorem ipsum Lorem</h2>
            
            <div className="space-y-6">
                <p className="text-base md:text-lg text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt finibus diam. Nunc at mauris ut velit sollicitudin dignissim ac eget turpis. Duis quis laoreet tellus, eu condimentum mauris. Quisque sed imperdiet lorem.
                </p>
                
                <p className="text-base md:text-lg text-justify">
                    Fusce euismod risus eu tortor dapibus vehicula. Integer rhoncus lorem nec lobortis sagittis. Aenean elementum et lorem in suscipit. Suspendisse at diam eget quam laoreet viverra. Aenean elementum et lorem in suscipit.
                </p>
                
                <p className="text-base md:text-lg text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt finibus diam. Nunc at mauris ut velit sollicitudin dignissim ac eget turpis. Duis quis laoreet tellus, eu condimentum mauris. Quisque sed imperdiet lorem.
                </p>
                
                <p className="text-base md:text-lg text-justify">
                    Fusce euismod risus eu tortor dapibus vehicula. Integer rhoncus lorem nec lobortis sagittis. Aenean elementum et lorem in suscipit. Suspendisse at diam eget quam laoreet viverra. Aenean elementum et lorem in suscipit.
                </p>
            </div>
        </div>
    );
} 