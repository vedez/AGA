export async function loadLanguage(lang = "en") {
    try {
        // load main language file
        const mainResponse = await fetch(`/locales/${lang}.json`);
        const mainTranslations = await mainResponse.json();

        // load affirmations file
        let affirmations = {};
        try {
            const affirmationsResponse = await fetch(`/json/affirmation/${lang}-affirmations.json`);
            if (affirmationsResponse.ok) {
                affirmations = await affirmationsResponse.json();
            }
        } catch (affError) {
            console.error(`Error loading ${lang} affirmations file:`, affError);
        }

        // combine translations
        return {
            ...mainTranslations,
            affirmations: affirmations
        };
    } catch (error) {
        console.error(`Error loading ${lang} language file:`, error);
        return {};
    }
}
