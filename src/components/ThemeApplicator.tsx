import { getTheme } from '@/lib/firestore';
import { hexToHsl } from '@/lib/utils';

export async function ThemeApplicator() {
  const theme = await getTheme();

  const themeStyles: { [key: string]: string | null } = {
    '--primary': hexToHsl(theme.primaryColor),
    '--background': hexToHsl(theme.backgroundColor),
    '--card': hexToHsl(theme.surfaceColor),
    '--foreground': hexToHsl(theme.textPrimaryColor),
  };

  if (theme.useGradientBorder) {
    themeStyles['--gradient-start'] = hexToHsl(theme.gradientStartColor);
    themeStyles['--gradient-end'] = hexToHsl(theme.gradientEndColor);
  }

  const styleString = Object.entries(themeStyles)
    .filter(([, value]) => value !== null)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');

  let borderStyles = '';
  if (theme.useGradientBorder) {
    borderStyles = `
      .card-bordered {
        border: 1.5px solid;
        border-image-slice: 1;
        border-image-source: linear-gradient(90deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)));
      }
      .button-bordered {
        border: 1.5px solid;
        border-image-slice: 1;
        border-image-source: linear-gradient(90deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)));
      }
    `;
  } else {
    borderStyles = `
      .card-bordered {
        border: 1px solid hsl(var(--border));
      }
      .button-bordered {
        border: 1px solid transparent;
      }
      .button-bordered[data-variant="outline"] {
        border-color: hsl(var(--input));
      }
    `;
  }

  const css = `
    :root {
      ${styleString}
    }
    .dark {
      ${styleString}
    }
    ${borderStyles}
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
