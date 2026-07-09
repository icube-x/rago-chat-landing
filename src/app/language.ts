export type Language = 'ko' | 'en';
export type PolicyLanguageCode = 'ko-KR' | 'en-US';

export const languageStorageKey = 'kl-store-language';

export function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const queryLanguage = readQueryLanguage(window.location.search);
  if (queryLanguage) {
    window.localStorage.setItem(languageStorageKey, queryLanguage);
    return queryLanguage;
  }

  const savedLanguage = window.localStorage.getItem(languageStorageKey);
  if (savedLanguage === 'ko' || savedLanguage === 'en') {
    return savedLanguage;
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages = navigator.languages.length ? navigator.languages : [navigator.language];
  const hasKoreanLocale = languages.some((locale) => locale.toLowerCase().indexOf('ko') === 0);

  return timezone === 'Asia/Seoul' || hasKoreanLocale ? 'ko' : 'en';
}

export function getPolicyLanguageCode(language: Language): PolicyLanguageCode {
  return language === 'ko' ? 'ko-KR' : 'en-US';
}

export function getPolicyPath(slug: 'privacy' | 'terms', language: Language): string {
  return `/${slug}?lang=${language}`;
}

function readQueryLanguage(search: string): Language | null {
  const params = new URLSearchParams(search);
  const lang = params.get('lang') ?? params.get('language');
  const languageCode = params.get('language_code');

  if (lang === 'ko' || lang === 'en') {
    return lang;
  }

  if (languageCode === 'ko-KR') {
    return 'ko';
  }

  if (languageCode === 'en-US') {
    return 'en';
  }

  return null;
}
