import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardImage from '../../../assets/IPCardImage.jpg'
import { styled } from '@mui/material/styles'
import { SectionTypes } from '../../../config'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.content.container.dark,
        height: '250px',
        marginTop: theme.spacing(2),
        borderRadius: '6px',
        paddingTop: '20px',
        cursor: 'pointer',
    },
    contentBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    outlined: {
        border: '1px solid green',
    },
}))

const StyledImage = styled('img')(({ theme }) => ({
    width: '320px',
    height: '200px',
    borderTopLeftRadius: theme.spacing(0.4),
    borderTopRightRadius: theme.spacing(0.4),
}))

interface AddVideoProps {
    isSelected: boolean
    handleClick: (type: SectionTypes) => void
}

export default function AddVideo({ isSelected, handleClick }: AddVideoProps) {
    const classes = useStyles()

    return (
        <Box
            className={clsx(classes.root, isSelected && classes.outlined)}
            onClick={() => handleClick(SectionTypes.AddVideoSection)}
        >
            <Box>
                <Typography align="center">Add Video</Typography>
                <Box className={classes.contentBlock}>
                    <StyledImage
                        src={CardImage}
                        alt="IPCardImage"
                    ></StyledImage>
                </Box>
            </Box>
        </Box>
    )
}
