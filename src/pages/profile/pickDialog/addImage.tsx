import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { IPCard, IPCardBoxType } from '../../../components/cards'
import CardImage from '../../../assets/IPCardImage.jpg'
import clsx from 'clsx'
import { SectionTypes } from '../../../config'

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
    outlined: {
        border: '1px solid green',
    },
}))

interface AddImageProps {
    isSelected: boolean
    handleClick: (type: SectionTypes) => void
}

export default function AddImage({ isSelected, handleClick }: AddImageProps) {
    const classes = useStyles()

    return (
        <Box
            className={clsx(classes.root, isSelected && classes.outlined)}
            onClick={() => handleClick(SectionTypes.AddImageSection)}
        >
            <Box className={classes.contentBlock}>
                <Typography align="center">Add Image</Typography>
                <IPCard type={IPCardBoxType.None} imageSrc={CardImage} />
            </Box>
        </Box>
    )
}
