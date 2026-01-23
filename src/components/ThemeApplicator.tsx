import { getTheme } from '@/lib/firestore';
import { hexToHsl } from '@/lib/utils';

export async function ThemeApplicator() {
  const theme = await getTheme();

  const themeStyles = {
    '--primary': hexToHsl(theme.primaryColor),
    '--background': hexToHsl(theme.backgroundColor),
    '--card': hexToHsl(theme.surfaceColor),
    '--foreground': hexToHsl(theme.textPrimaryColor),
  };

  const styleString = Object.entries(themeStyles)
    .filter(([, value]) => value !== null)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');

  const css = `
    :root {
      ${styleString}
    }
    .dark {
      ${styleString}
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
