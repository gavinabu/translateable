// makes it detectable
const VERSION = "1.1.0";

const isBrowser = typeof window !== "undefined" &&
  typeof document !== "undefined" &&
  typeof document.createElement === "function";

if (isBrowser) {
  window.translateableInstalled = true;
  window.translateableVersion = VERSION;
}

export class LanguageNotMatchingException extends Error {
  name = 'LanguageNotMatchingException';
  constructor(supposedId, realId) {
    super(`Expected ${supposedId}, received ${realId}`);
  }
}

export class NotALanguageException extends Error {
  name = 'NotALanguageException';
  constructor(supposedId, url, receivedName) {
    super(`Expected ${supposedId} at ${url}. Did not receive a proper language file. Received ${receivedName}`);
  }
}

export class Language {
  id;
  url;
  lang;
  
  constructor(id,url,lang) {
    this.id = id;
    this.url = url;
    this.lang = lang;
  }

  static async create(id, url, options = {silenceDebug: false}) {
    let lang;
    try {
      lang = await (await fetch(url)).json();
    } catch (error) {
      throw new NotALanguageException(id, url, "not json, or the request failed. Check network tab.");
    }
    
    
    if(typeof lang !== "object") throw new NotALanguageException(id, url, "not an object");
    
    if(Array.isArray(lang)) throw new NotALanguageException(id, url, "an array");
    
    const invalids = Object.entries(lang).filter(([key, value]) => typeof key !== "string" || typeof value !== "string");
    
    if(invalids.length > 0) throw new NotALanguageException(id, url, `invalid syntax. ${Array.from(invalids.keys()).join(", ")} are invalid.`);
    
    const keys = Object.keys(lang);
    console.log(lang, keys)
    if(!(keys.includes("meta.id") && keys.includes("meta.readable-name"))) throw new NotALanguageException(id, url, "invalid syntax, meta.id or meta.readable id is missing.");
    
    if(lang["meta.id"] !== id) throw new LanguageNotMatchingException(id, lang["meta.id"]);
    
    // top tier error handling, am I right. I just know people will make bad language files and wonder why it doesnt work. And I hate errors that mean nothing.
    
    if(!options.silenceDebug) console.debug(`[Translatable] Loaded ${lang["meta.readable-name"]} language (${lang["meta.id"]})`)
    return new this(id, url, lang);
  }
  
  get(id) {
    return this.lang[id];
  }
}