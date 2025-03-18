import { Button } from 'antd';
// import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const SwitchTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 初始化主题
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.theme = "dark"
  };

  return (
    <Button
      type="primary"
    //   icon={
    //     isDark ? (
    //       <SunIcon className="w-5 h-5" />
    //     ) : (
    //       <MoonIcon className="w-5 h-5" />
    //     )
    //   }
      onClick={toggleTheme}
      className="flex items-center justify-center"
    >切换主题</Button>
  );
};

export default SwitchTheme;