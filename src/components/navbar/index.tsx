import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import ResponsiveAppBar from '../appbar'

const useStyles = makeStyles((theme: Theme) => ({
    navbarContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    navlinks: {
        width: '100%',
        display: 'flex',
        backgroundColor: theme.palette.secondary.light,
        justifyContent: 'space-between',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    leftClass: {
        display: 'flex',
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.secondary.dark,
        fontSize: '20px',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textTransform: 'capitalize',
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.secondary.main,
        },
    },
    input: {
        color: theme.palette.secondary.dark,
        marginTop: '10px',
        '& fieldset': {
            height: '50px',
        },
    },
    appBar: {
        backgroundColor: `${theme.palette.secondary.light} !important`,
        width: '100%',
    },
    notificationBar: {
        backgroundColor: `${theme.palette.error.light} !important`,
        width: '100%',
        height: '80px',
    },
}))

interface NavbarProps {
    setOpenSell: (boolean) => void
}

const Navbar = ({ setOpenSell }: NavbarProps) => {
    const classes = useStyles()

    return (
        <Box className={classes.navbarContainer}>
            <ResponsiveAppBar setOpenSell={setOpenSell} />
        </Box>
    )
}

export default Navbar
