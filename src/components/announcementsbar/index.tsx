import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.secondary.main,
        width: '100%',
        height: '30px',
    },
}))

const Announcementsbar = () => {
    const classes = useStyles()
    return <Box className={classes.root}></Box>
}

export default Announcementsbar
