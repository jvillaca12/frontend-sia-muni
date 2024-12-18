import { createTheme, ThemeOptions } from "@mui/material";

const themeOptionsLigth: ThemeOptions = {
    palette: {
        mode: 'light',
        background: {
            default: '#ffffff',
        },
    },
};

const themeLight = createTheme(themeOptionsLigth);
export default themeLight;