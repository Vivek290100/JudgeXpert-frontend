import { createContext, useContext, useState, ReactNode } from 'react';


interface NavigationContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        isProfileOpen,
        setIsProfileOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}