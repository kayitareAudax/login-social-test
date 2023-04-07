import { useState } from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { IPCard } from '../../../components/cards'
import CardImage from '../../../assets/IPCardImage.jpg'
import PreviewMusic from '../previewMusic'
import { SectionTypes } from '../../../config'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.content.container.dark,
        height: '100%',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    contentBlock: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '20px',
        height: '100%',
    },
    musicCover: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    outlined: {
        border: '1px solid green',
    },
}))

interface AddMusicPreviewProps {
    isSelected: boolean
    handleClick: (type: SectionTypes) => void
}

export default function AddMusicPreview({
    isSelected,
    handleClick,
}: AddMusicPreviewProps) {
    const classes = useStyles()
    const [checked, setChecked] = useState<boolean>(true)
    const checkHandler = () => {
        setChecked(!checked)
    }
    return (
        <Box
            className={clsx(classes.root, isSelected && classes.outlined)}
            onClick={() => handleClick(SectionTypes.AddMusicPreviewSection)}
        >
            <Box className={classes.contentBlock}>
                <Typography align="center">Add Music Preview</Typography>
                <Box className={classes.musicCover}>
                    <Box>
                        <PreviewMusic
                            showCloseButton={true}
                            imageSrc={CardImage}
                            licenseName={'Music Name'}
                            handleChange={checkHandler}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
