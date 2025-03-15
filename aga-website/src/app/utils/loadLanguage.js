export async function loadLanguage(lang = "en") {
  try {
    const response = await fetch(`/locales/${lang}.json`);
    return await response.json();

  } catch (error) {
    console.error(`Error loading ${lang} language file:`, error);
    return {};
    
  }
}
