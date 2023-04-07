import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const SecondaryButton = styled(Button)(({ theme }) => ({
    background: theme.secondaryButton.background.light,
    width: theme.spacing(12),
    color: theme.palette.primary.contrastText,
    margin: theme.spacing(1, 1),
    textTransform: 'initial',
    whiteSpace: 'nowrap',
    '&:hover': {
        background: theme.secondaryButton.background.dark,
    },
    '&:disabled': {
        color: theme.palette.secondary.main,
    },
}))

export default SecondaryButton
