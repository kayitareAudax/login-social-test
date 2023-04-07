import { createTheme, Theme } from '@mui/material/styles'

import { COLORS } from './colors'

declare module '@mui/material/styles' {
    interface Theme {
        content: {
            container: {
                main: string
                light: string
                dark: string
            }
        }
        dialog: {
            background: string
        }
        secondaryButton: {
            background: {
                disabled: string
                default: string
                light: string
                dark: string
            }
            color: {
                disabled: string
                default: string
                light: string
                dark: string
            }
        }
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        content: {
            container: {
                main: string
                light: string
                dark: string
            }
        }
        dialog: {
            background: string
        }
        secondaryButton: {
            background: {
                disabled: string
                default: string
                light: string
                dark: string
            }
            color: {
                disabled: string
                default: string
                light: string
                dark: string
            }
        }
    }
}

export type PillBackgroundProps = {
    grayscale?: boolean
    warm?: boolean
    theme?: Theme
}

export const getPillBackground = ({
    grayscale,
    warm,
    theme,
}: PillBackgroundProps) => {
    if (grayscale) return theme?.content.container.main
    if (warm) return theme?.palette.warning.light
    return theme?.palette.primary.light
}

export const getDefaultTheme = () => {
    return createTheme()
}

export const isDarkMode = (theme: Theme) => theme.palette.mode === 'dark'

export const getThemeMode = (theme: Theme) => theme.palette.mode

export const getTheme = () => {
    const theme = createTheme({
        spacing: 10,
        typography: {
            fontFamily: 'Inter',
            allVariants: {
                color: COLORS.GREY['100'],
            },
        },
        palette: {
            mode: 'light',
            background: {
                default: COLORS.GREY['900'],
                paper: COLORS.GREY['900'],
            },
            primary: {
                dark: COLORS.BRAND['700'],
                main: COLORS.BRAND['500'],
                light: COLORS.BRAND['400'],
                contrastText: COLORS.GREY['900'],
            },
            secondary: {
                dark: COLORS.GREY['100'],
                main: COLORS.GREY['400'],
                light: COLORS.GREY['500'],
                contrastText: COLORS.GREY['900'],
            },
            warning: {
                dark: COLORS.YELLOW['800'],
                main: COLORS.YELLOW['500'],
                light: COLORS.YELLOW['400'],
            },
            error: {
                dark: COLORS.RED['600'],
                main: COLORS.RED['400'],
                light: COLORS.RED['200'],
            },
        },
        content: {
            container: {
                main: COLORS.GREY['800'],
                light: COLORS.GREY['600'],
                dark: COLORS.GREY['500'],
            },
        },
        dialog: {
            background: COLORS.GREY['400'],
        },
        secondaryButton: {
            background: {
                disabled: COLORS.GREY['500'],
                default: COLORS.GREY['700'],
                light: COLORS.GREY['300'],
                dark: COLORS.GREY['200'],
            },
            color: {
                disabled: COLORS.GREY['100'],
                default: COLORS.GREY['100'],
                light: COLORS.GREY['900'],
                dark: COLORS.GREY['900'],
            },
        },
    })
    return theme
}

export { COLORS }
