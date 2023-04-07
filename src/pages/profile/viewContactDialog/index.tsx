import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Theme, useTheme } from '@mui/material/styles'
import { Button, Box, Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({
    saveButton: {
        width: '100%',
        maxWidth: '300px',
        height: '50px',
        margin: '10px 0px 0px 0px',
    },
    input: {
        color: theme.palette.secondary.dark,
        width: '100%',
    },
}))

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        backgroundColor: theme.content.container.dark,
    },
}))

export interface DialogTitleProps {
    id: string
    children?: React.ReactNode
    onClose: () => void
}

export interface ViewContactDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    contactInfo: any
}

export default function ViewContactDialog({
    open,
    setOpen,
    contactInfo,
}: ViewContactDialogProps) {
    const classes = useStyles()

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth="sm"
            fullWidth={true}
        >
            <DialogContent dividers sx={{ padding: 80 }}>
                {contactInfo?.showPhoneNumber && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 0px',
                        }}
                    >
                        <Typography component={'span'} sx={{ width: '120px' }}>
                            Phone Number:
                        </Typography>
                        <Typography>{contactInfo?.phoneNumber}</Typography>
                    </Box>
                )}
                {contactInfo?.showContactEmail && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 0px',
                        }}
                    >
                        <Typography component={'span'} sx={{ width: '120px' }}>
                            Contact Email:
                        </Typography>
                        <Typography>{contactInfo?.contactEmail}</Typography>
                    </Box>
                )}
            </DialogContent>
        </BootstrapDialog>
    )
}
