import { Box, Tabs, Tab, Grid, Typography, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

type DiscountCardProps = {
    percent: string
    discountName: string
    handler?: () => void
}

const StyledCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: theme.content.container.dark,
    padding: '10px 30px',
    marginLeft: '20px',
}))

const DiscountCard = ({
    percent,
    discountName,
    handler,
}: DiscountCardProps) => {
    const theme = useTheme()
    return (
        <StyledCard>
            <IconButton
                color="error"
                aria-label="close"
                component="label"
                sx={{
                    position: 'absolute',
                    right: '-12px',
                    top: '-12px',
                    padding: 0,
                }}
                onClick={() => handler()}
            >
                <CloseIcon />
            </IconButton>
            <Typography>{`${percent}%`}</Typography>
            <Typography>{discountName}</Typography>
        </StyledCard>
    )
}

export default DiscountCard
