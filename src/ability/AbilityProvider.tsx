import React, { useState, useEffect } from "react";
import { AbilityContext } from "./AbilityContext";
import { defineAbilityFor } from "./ability";

export const AbilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ability, setAbility] = useState(() => defineAbilityFor([]));

  useEffect(() => {
    const storedModules = localStorage.getItem("accessModules");
    if (storedModules) {
      try {
        const parsed = JSON.parse(storedModules);
        setAbility(defineAbilityFor(parsed));
      } catch (err) {
        console.error("Invalid accessModules in localStorage", err);
      }
    }
  }, []);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};
