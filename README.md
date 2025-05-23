<h1 style="margin-bottom: 0.5em">Translat<span style="text-decoration: underline red;">e</span>able</h1>
An easy-to-use translation package. Work's in any node like framework (this also means anything webpack based, so react, next, etc. also means react native, electron, etc)

## Getting Started
In your public directory, create a `{language id}.json` file. That looks like this.
```json
{
  "meta.id": "{language id}",
  "meta.readable-name": "{human friendly name for this language}",

  "my.translation-key": "Translation value in the language for this file"
}
```
\
I would recommend making a language handler, to help initialise the package. This is a good example in typescript, that should work in pretty much any framework.
```ts
import {Language} from "./translatable";

export default class LanguageHandler {
  private static _instance: LanguageHandler;
  public static get instance() {return this._instance}
  
  private constructor(public readonly lang: Language) {
    LanguageHandler._instance = this;
  }
  
  public static async create(language: string) {
    switch (language) {
      case "en_us": new this(await Language.create("en_us", "/lang/en_us.json"));
      // add every language your app supports.
    }
  }
}
```

### React example
en_us.json
```json
{
  "meta.id": "en_us",
  "meta.readable-name": "English",

  "app.name": "Test Application",
  "nav.home": "Home",
  "nav.messages": "Messenger"
}
```
\
index.tsx
```tsx
const language = localStorage.getItem('lang') || "en_us";

(async () => {
  await LanguageHandler.create(language);
  
  root.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>
  );
})();
```
\
in your components/pages
```tsx
<nav>
    <h1>{LanguageHandler.instance.lang.get("app.name")}</h1>
    <a href="/">{LanguageHandler.instance.lang.get("nav.home")}</a>
    <a href="/messages">{LanguageHandler.instance.lang.get("nav.messages")}</a>
</nav>
```
\
I would also recommend putting this into its own component. Since they can get messy. Like this
```tsx
export default function TranslateableText(props: {children: string}) {
  return (
    <span>{LanguageHandler.instance.lang.get(props.children)}</span>
  )
}
```

and used like this
```tsx
    <TranslateableText>app.name</TranslateableText>
```