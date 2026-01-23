import { getTheme } from '@/lib/firestore';
import { hexToHsl } from '@/lib/utils';

export async function ThemeApplicator() {
  const theme = await getTheme();

  const themeStyles = {
    '--primary': hexToHsl(theme.primaryColor),
    '--background': hexToHsl(theme.backgroundColor),
    '--card': hexToHsl(theme.surfaceColor),
    // '--foreground' could be derived or use theme.textPrimaryColor
    // For simplicity, we'll let the default globals.css handle foreground based on background.
  };

  const styleString = Object.entries(themeStyles)
    .filter(([, value]) => value !== null)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');

  const css = `
    :root {
      ${styleString}
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
