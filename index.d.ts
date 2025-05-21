export class LanguageNotMatchingException extends Error {
  name: 'LanguageNotMatchingException';
  constructor(supposedId: string, realId: string);
}

export class NotALanguageException extends Error {
  name: 'NotALanguageException';
  constructor(supposedId: string, url: string, receivedName: string);
}

export class Language {
  private constructor(id: string, url: string, lang: Record<string, string>);
  
  /**
   * Creates a new Language instance by fetching and validating a language file.
   * @param id The expected meta.id of the language file.
   * @param url The URL to fetch the language file from.
   * @param options Optional object with `silenceDebug` to suppress debug logs.
   */
  static create(
    id: string,
    url: string,
    options?: { silenceDebug?: boolean }
  ): Promise<Language>;
  
  /**
   * Gets the string for a given ID from the language file.
   * @param id The string ID to retrieve.
   */
  get(id: string): string | undefined;
}
