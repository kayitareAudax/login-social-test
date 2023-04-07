import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Theme, useTheme } from '@mui/material/styles'
import { Grid, Typography } from '@mui/material'
import SecondaryButton from '../../components/secondary-button'
import { makeStyles } from '@mui/styles'
import FormHelperText from '@mui/material/FormHelperText'
const useStyles = makeStyles((theme: Theme) => ({
    addButton: {
        width: '100% !important',
        height: '50px',
        margin: '30px 0px 0px 0px !important',
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

export interface DialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    handler: (newTab: string) => void
}

export default function TabNameDialog({ open, setOpen, handler }: DialogProps) {
    const classes = useStyles()
    const theme = useTheme()
    const [tabName, setTabName] = useState<string>()
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
                    placeholder="Enter the tab name"
                    className={classes.input}
                    value={tabName}
                    onChange={(
                        e: React.ChangeEvent<
                            HTMLTextAreaElement | HTMLInputElement
                        >,
                    ) => setTabName(e.target.value)}
                    type="text"
                    required
                />
                {(!tabName || tabName === '') && (
                    <FormHelperText sx={{ color: theme.palette.error.dark }}>
                        Please enter the invalid name
                    </FormHelperText>
                )}
                <SecondaryButton
                    className={classes.addButton}
                    onClick={() => handler(tabName)}
                >
                    Add Code
                </SecondaryButton>
            </DialogContent>
        </BootstrapDialog>
    )
}
