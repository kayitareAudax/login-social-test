import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Theme, useTheme } from '@mui/material/styles'
import { Box, Grid, Typography } from '@mui/material'
import SecondaryButton from '../../../components/secondary-button'
import { makeStyles } from '@mui/styles'
import PrimaryButton from '../../../components/primary-button'
import ErrorButton from '../../../components/error-button'

const useStyles = makeStyles((theme: Theme) => ({
    addButton: {
        width: '100% !important',
        height: '50px',
        margin: '10px 0px 0px 0px !important',
    },
    input: {
        color: theme.palette.secondary.dark,
        width: '100%',
    },
    txt: { width: '100%', padding: '10px 0px' },
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

export interface AddVideoDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    handler: (videoLink: string) => void
}

export default function AddVideoDialog({
    open,
    setOpen,
    handler,
}: AddVideoDialogProps) {
    const classes = useStyles()
    const [videoLink, setVideoLink] = useState<string>()

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
            <DialogContent dividers>
                <OutlinedInput
                    className={classes.input}
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    type="text"
                    required
                    placeholder="Enter Video Link"
                />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '20px 40px',
                    }}
                >
                    <ErrorButton handler={() => setOpen(false)}>
                        Back
                    </ErrorButton>

                    <PrimaryButton
                        sx={{ width: '45%' }}
                        onClick={() => {
                            handler(videoLink)
                            setOpen(false)
                        }}
                    >
                        Next
                    </PrimaryButton>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}
