import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SectionTypes } from '../../../config'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.content.container.dark,
        height: '100%',
        marginTop: theme.spacing(2),
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
    dotCotainer: {
        margin: '20px',
        borderRadius: '6px',
        borderStyle: 'dotted',
        borderColor: theme.palette.secondary.dark,
        height: '150px',
    },
    outlined: {
        border: '1px solid green',
    },
}))

interface AddDescriptionProps {
    isSelected: boolean
    handleClick: (type: SectionTypes) => void
}

export default function AddDescription({
    isSelected,
    handleClick,
}: AddDescriptionProps) {
    const classes = useStyles()

    return (
        <Box
            className={clsx(classes.root, isSelected && classes.outlined)}
            onClick={() => handleClick(SectionTypes.AddDescriptionSection)}
        >
            <Box className={classes.contentBlock}>
                <Typography align="center">Add Description/Text</Typography>
                <Box className={classes.dotCotainer}></Box>
            </Box>
        </Box>
    )
}
