import {createContext} from "react";
import LoadEnum from "../enums/LoadEnum";
import ThemeEnum from "../enums/ThemeEnum";

export const PreferencesContext = createContext({
  userTheme: ThemeEnum.AUTO,
  setUserTheme: () => {},
  userLoadArticles: LoadEnum.XS,
  setUserLoadArticles: () => {}
});
