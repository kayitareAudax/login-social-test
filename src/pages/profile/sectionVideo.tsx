import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/material'
import StyledIconButton from '../../components/styledIconButton'
import CloseIcon from '@mui/icons-material/Close'
import CardMedia from '@mui/material/CardMedia'

const useStyles = makeStyles({
    root: {
        position: 'relative',
        marginTop: '-20px',
        padding: '10px 0px',
    },
    checkBox: {
        position: 'absolute !important' as any,
        right: '-20px',
        top: '0px',
    },
})

interface SectionVideoProps {
    videoSrc: string
    showCloseButton: boolean
    handleChange: () => void
}

export const SectionVideo = ({
    videoSrc,
    showCloseButton,
    handleChange,
}: SectionVideoProps) => {
    const classes = useStyles()
    return (
        <Box className={classes.root}>
            <CardMedia component="video" autoPlay controls src={videoSrc} />
            {showCloseButton && (
                <StyledIconButton
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        right: '-12px',
                        top: '-2px',
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
