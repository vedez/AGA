"use client";

import { useState } from "react";
import useTranslation from "@/hooks/useTranslation";

export default function ContactForm() {
    const { translations } = useTranslation();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email || !message) {
            setError(translations.forms?.allFieldsRequired || "Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess(false);

            // simulate sending logic
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSuccess(true);
            setEmail("");
            setMessage("");

        } catch (err) {
            setError(translations.forms?.submitError || "Something went wrong. Please try again.");

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full bg-white p-6 rounded-xl shadow-md max-w-lg">
            <h1 className="text-xl font-bold text-center mb-4">
                {translations.components?.contactUs || "Contact Us"}
            </h1>

            <form className="form-container space-y-4" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label block font-medium">
                        {translations.form?.email || "Email"}
                    </label>

                    <input
                        type="email"
                        id="email"
                        placeholder="hana@volaco.com"
                        className="form-input w-full border p-2 rounded text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message" className="form-label block font-medium">
                        {translations.forms?.yourMessage || "Message"}
                    </label>
                    <textarea
                        id="message"
                        rows={5}
                        placeholder={translations.forms?.writeSomething || "Enter your message here..."}
                        className="form-textarea w-full border p-2 rounded text-sm"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="form-button bg-[#62cc5b] text-white px-4 py-2 rounded hover:bg-[#33a835] transition"
                        disabled={loading}
                    >
                        {loading
                            ? (translations.forms?.sending || "Sending...")
                            : (translations.forms?.submit || "Submit")}
                    </button>
                </div>

                {success && (
                    <div className="text-green-600 mb-2 italic text-center">
                        {translations.forms?.messageSent || "Thank you for reaching out! We will get back to you as soon as possible."}
                    </div>
                )}


                {error && (
                    <div className="text-red-500 mb-2 italic text-center">{error}</div>
                )}
            </form>
        </div>
    );
}
