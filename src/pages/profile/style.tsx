import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { Box, Grid, Typography, Tabs, Tab } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'

export const Container = styled(Box)(({ theme }) => ({
    width: '100%',
    background: theme.palette.background.default,
    margin: 'auto',
}))

export const ContainerFluid = styled(Box)(({ theme }) => ({
    padding: '0px 100px',
    background: theme.palette.background.default,
    margin: 'auto',
}))

export const UploadImageContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    background: theme.palette.secondary.main,
    textAlign: 'center',
    height: '300px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))

export const UploadImage = styled('img')(({ theme }) => ({
    height: '100%',
    width: '100%',
    textAlign: 'center',
    objectFit: 'cover',
}))

export const PublicAvatarImageContainer = styled(Grid)(({ theme }) => ({
    height: theme.spacing(12),
    width: theme.spacing(12),
    background: theme.palette.secondary.light,
    marginTop: theme.spacing(-9),
    borderRadius: theme.spacing(10),
    marginLeft: '5%',
    position: 'sticky',
    zIndex: 10,
    cursor: 'pointer',
}))

export const PrivateAvatarImageContainer = styled(Grid)(({ theme }) => ({
    height: theme.spacing(12),
    width: theme.spacing(12),
    background: theme.palette.secondary.light,
    margin: 'auto',
    marginTop: theme.spacing(-3.5),
    borderRadius: theme.spacing(10),
}))

export const AvatarImage = styled('img')(({ theme }) => ({
    height: theme.spacing(5),
    maxWidth: '100%',
    paddingTop: theme.spacing(3),
    display: 'flex',
    margin: 'auto',
}))

export const PersonaLabel = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '200px',
    fontSize: theme.spacing(1.6),
    fontWeight: 500,
    color: theme.palette.secondary.dark,
    [theme.breakpoints.down('md')]: {
        fontSize: theme.spacing(0.93),
    },
}))

export const ButtonContainer = styled(Grid)(({ theme }) => ({
    width: '0px 100px',
    margin: 'auto',
    display: 'flex',
    marginTop: theme.spacing(1),
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        marginTop: theme.spacing(3),
        width: '95%',
    },
}))

export const TabsContainer = styled(Grid)(({ theme }) => ({
    width: '90%',
    margin: 'auto',
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        marginTop: theme.spacing(3),
        width: '95%',
    },
}))

export const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'initial',
    color: theme.palette.secondary.dark,
}))

export const StyledTabs = styled(Tabs)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.secondary.light}`,
}))

export const useProfileStyles = makeStyles((theme: Theme) => ({
    personal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    imgBox: {
        width: '80%',
        background: theme.palette.secondary.main,
        margin: 'auto',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '35px',
        marginBottom: '35px',
    },
    musicBoxes: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        margin: 35,
    },
    musicBox: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '250px',
        background: 'grey',
    },
    descBox: {
        background: '#c3c3c3',
        padding: '15px',
        textAlign: 'left',
        width: '80%',
        margin: 'auto',
        marginTop: '35px',
        marginBottom: '35px',
    },
    searchInput: {
        color: theme.palette.secondary.dark,
        position: 'absolute !important' as any,
        right: 0,
        top: 0,
        height: '45px',
    },
    input: {
        display: 'none',
    },
}))
