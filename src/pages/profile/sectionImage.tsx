import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/material'
import StyledIconButton from '../../components/styledIconButton'
import CloseIcon from '@mui/icons-material/Close'

const useStyles = makeStyles({
    root: {
        position: 'relative',
    },
    checkBox: {
        position: 'absolute !important' as any,
        right: '-20px',
        top: '0px',
    },
})

const StyledImage = styled('img')(({ theme }) => ({
    width: '100%',
    paddingTop: theme.spacing(2),
    display: 'flex',
    margin: 'auto',
    height: '400px',
    objectFit: 'cover',
}))

interface SectionImageProps {
    imageSrc: string
    showCloseButton: boolean
    handleChange?: () => void
}

export const SectionImage = ({
    imageSrc,
    showCloseButton,
    handleChange,
}: SectionImageProps) => {
    const classes = useStyles()
    return (
        <Box className={classes.root}>
            <StyledImage src={imageSrc} />
            {showCloseButton && (
                <StyledIconButton
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        right: '-12px',
                        top: '8px',
                        padding: 0,
                    }}
                    onClick={() => handleChange()}
                >
                    <CloseIcon />
                </StyledIconButton>
            )}
        </Box>
    )
}
