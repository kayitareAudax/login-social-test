import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Theme, useTheme } from '@mui/material/styles'
import { Grid, Box } from '@mui/material'
import SecondaryButton from '../../../components/secondary-button'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({
    addButton: {
        width: '100% !important',
        height: '50px',
        margin: '10px 0px 0px 0px',
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

export interface WebSiteLinkDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    handler: (websiteLink: string) => void
}

export default function WebSiteLinkDialog({
    open,
    setOpen,
    handler,
}: WebSiteLinkDialogProps) {
    const classes = useStyles()
    const [websiteLink, setWebsiteLink] = useState<string>('')

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
                <OutlinedInput
                    className={classes.input}
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    type="text"
                    required
                    placeholder="Please write your web site"
                />
                <Box display="flex" justifyContent="center" alignItems="center">
                    <SecondaryButton
                        className={classes.addButton}
                        onClick={() => handler(websiteLink)}
                    >
                        Link
                    </SecondaryButton>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}
