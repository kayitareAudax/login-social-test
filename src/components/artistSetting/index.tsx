import { Box, Typography, useTheme } from '@mui/material'
export default function ArtistSetting() {
    const theme = useTheme()
    return (
        <Box>
            <Typography align="center">
                Set Revenue Splits And Permissions
            </Typography>
            <Box sx={{ border: `1px solid ${theme.content.container.dark}` }}>
                <Typography align="center">Song Name</Typography>
                <Typography align="center">Artists:</Typography>
                <Typography align="center">Artists:</Typography>
            </Box>
        </Box>
    )
}
