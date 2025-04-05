export async function loadLanguage(lang = "en") {
    try {
        // Load main language file
        const mainResponse = await fetch(`/locales/${lang}.json`);
        const mainTranslations = await mainResponse.json();

        // Load affirmations file
        let affirmations = {};
        try {
            const affirmationsResponse = await fetch(`/json/affirmation/${lang}-affirmations.json`);
            if (affirmationsResponse.ok) {
                affirmations = await affirmationsResponse.json();
            }
        } catch (affError) {
            console.error(`Error loading ${lang} affirmations file:`, affError);
        }

        // Combine translations
        return {
            ...mainTranslations,
            affirmations: affirmations
        };
    } catch (error) {
        console.error(`Error loading ${lang} language file:`, error);
        return {};
    }
}
