import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { SectionTypes } from '../../config'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100% - 40px)',
        // minHeight: '100px',
        borderRadius: '6px',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        borderStyle: 'dotted',
        borderColor: theme.palette.secondary.light,
        cursor: 'pointer',
        margin: '20px',
    },
}))

interface AddItemProps {
    sectionId: number
    sectionType: SectionTypes
    handleClick: (sectionId: number, sectionType: SectionTypes) => void
}

export default function AddItem({
    sectionId,
    sectionType,
    handleClick,
}: AddItemProps) {
    const theme = useTheme()
    const classes = useStyles()
    return (
        <Box
            className={classes.root}
            onClick={() => handleClick(sectionId, sectionType)}
        >
            <AddIcon fontSize="large" color="primary" />
        </Box>
    )
}
