import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    width: '100%',
    height: '50px',
    textTransform: 'capitalize',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
    },
    '&.Mui-disabled': {
        backgroundColor: theme.palette.primary.dark,
    },
}))

export default PrimaryButton
