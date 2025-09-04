// AbilityContext.tsx
import { createContext } from "react";
import { AppAbility } from "./ability";

export const AbilityContext = createContext<AppAbility | null>(null);
