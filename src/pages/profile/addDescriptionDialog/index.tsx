import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Theme, useTheme } from '@mui/material/styles'
import { Button, Box, Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { SizeTypes } from '../../../config'
import clsx from 'clsx'
import ErrorButton from '../../../components/error-button'
import PrimaryButton from '../../../components/primary-button'

const useStyles = makeStyles((theme: Theme) => ({
    dottedContainer: {
        borderStyle: 'dotted',
        borderColor: theme.palette.secondary.main,
        cursor: 'pointer',
        backgroundColor: theme.content.container.dark,
        height: '100%',
        borderRadius: '6px',
        marginTop: '10px',
    },
    descriptionContent: {
        display: 'flex',
        flexDirection: 'column',
        height: '200px',
        paddingBottom: '20px',
    },
    text: {
        padding: '20px',
    },
    outlined: {
        borderColor: 'green',
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
        backgroundColor: theme.palette.background.default,
    },
}))

export interface DialogTitleProps {
    id: string
    children?: React.ReactNode
    onClose: () => void
}

export interface AddDescriptionDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    handler: (type: SizeTypes) => void
}

export default function AddDescriptionDialog({
    open,
    setOpen,
    handler,
}: AddDescriptionDialogProps) {
    const classes = useStyles()
    const handleClose = () => {
        setOpen(false)
    }
    const [selectedDescriptionSize, setSelectedDescriptionSize] =
        useState<SizeTypes>(SizeTypes.None)

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth="md"
            fullWidth={true}
        >
            <DialogContent dividers sx={{ padding: 80 }}>
                <Box
                    className={classes.descriptionContent}
                    onClick={() => setSelectedDescriptionSize(SizeTypes.Large)}
                >
                    <Typography>Large</Typography>
                    <Box
                        className={clsx(
                            classes.dottedContainer,
                            selectedDescriptionSize === SizeTypes.Large &&
                                classes.outlined,
                        )}
                    >
                        <Typography className={classes.text}>
                            Max Characters 800
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Box
                            className={classes.descriptionContent}
                            onClick={() =>
                                setSelectedDescriptionSize(SizeTypes.Medium)
                            }
                        >
                            <Typography>Medium</Typography>
                            <Box
                                className={clsx(
                                    classes.dottedContainer,
                                    selectedDescriptionSize ===
                                        SizeTypes.Medium && classes.outlined,
                                )}
                            >
                                <Typography className={classes.text}>
                                    Max Characters 400
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box
                            className={classes.descriptionContent}
                            onClick={() =>
                                setSelectedDescriptionSize(SizeTypes.Small)
                            }
                        >
                            <Typography>Small</Typography>
                            <Box
                                className={clsx(
                                    classes.dottedContainer,
                                    selectedDescriptionSize ===
                                        SizeTypes.Small && classes.outlined,
                                )}
                            >
                                <Typography className={classes.text}>
                                    Max Characters 100
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={3}></Grid>
                </Grid>
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
                            handler(selectedDescriptionSize)
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
