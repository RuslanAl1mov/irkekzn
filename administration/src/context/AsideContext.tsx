import React, { createContext, useContext, useState, ReactNode } from "react";

interface AsideContextType {
  openAside: boolean;
  toggleAside: () => void;
}

const AsideContext = createContext<AsideContextType | null>(null);

export const AsideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openAside, setOpenAside] = useState(false);

  const toggleAside = () => {
    setOpenAside((prev) => !prev);
  };

  return (
    <AsideContext.Provider value={{ openAside, toggleAside }}>
      {children}
    </AsideContext.Provider>
  );
};

export const useAside = (): AsideContextType => {
  const context = useContext(AsideContext);
  if (!context) {
    throw new Error("useAside должен использоваться внутри <AsideProvider>");
  }
  return context;
};
