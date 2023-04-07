import React from 'react'
import Announcementsbar from '../announcementsbar'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => ({
    notificationBar: {
        backgroundColor: `${theme.palette.error.light} !important`,
        width: '100%',
        height: '80px',
    },
}))

export default function NotificationBar() {
    const classes = useStyles()

    return (
        <React.Fragment>
            <Announcementsbar />
            <Box className={classes.notificationBar}></Box>
        </React.Fragment>
    )
}
