export const colorTokens = {
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  primary: {
    50: "#B2EBF2",
    100: "#80DEEA",
    200: "#4DD0E1",
    300: "#26C6DA",
    400: "#00BCD4",
    500: "#4192b3",
    600: "#0097A7",
    700: "#00838F",
    800: "#006064",
    900: "#004D40",
  },
};

export const themeSettings = (mode) => {
  return {
    palette: {
      primary: {
        dark: colorTokens.primary[700],
        main: colorTokens.primary[500],
        light: colorTokens.primary[50],
      },
      neutral: {
        dark: colorTokens.gray[700],
        main: colorTokens.gray[500],
        mediumMain: colorTokens.gray[400],
        medium: colorTokens.gray[200],
        light: colorTokens.gray[50],
      },
      background: {
        default: colorTokens.gray[100],
        alt: colorTokens.gray[50],
      },
    },
    typography: {
      fontSize: 12,
      h1: {
        fontSize: 40,
      },
      h2: {
        fontSize: 32,
      },
      h3: {
        fontSize: 24,
      },
      h4: {
        fontSize: 20,
      },
      h5: {
        fontSize: 16,
      },
      h6: {
        fontSize: 14,
      },
    },
  };
};
