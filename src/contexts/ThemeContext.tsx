
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light';

type ThemeContextType = {
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme] = useState<Theme>('light');

  // Update the document class when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
