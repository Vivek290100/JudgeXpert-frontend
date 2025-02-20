// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\contexts\navigation-context.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// interface User {
//   name: string;
//   email: string;
//   avatar: string;
// }

interface NavigationContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (value: boolean) => void;
  // user: User | null;
  // setUser: (user: User | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const [user, setUser] = useState<User | null>({
  //   name: 'John Doe',
  //   email: 'john@example.com',
  //   avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32"
  // });

  return (
    <NavigationContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        isProfileOpen,
        setIsProfileOpen,
        // user,
        // setUser
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