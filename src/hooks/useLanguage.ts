import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type Lang = "vi" | "en";
const KEY = "app:lang";
const DEFAULT_LANG: Lang = "vi";

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === "vi" || v === "en") setLangState(v);
    });
  }, []);

  const setLang = async (l: Lang) => {
    setLangState(l);
    await AsyncStorage.setItem(KEY, l);
  };

  return { lang, setLang };
}
