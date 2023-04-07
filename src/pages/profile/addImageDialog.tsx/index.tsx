import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Theme, useTheme } from '@mui/material/styles'
import SecondaryButton from '../../../components/secondary-button'
import { makeStyles } from '@mui/styles'
import { Box, Grid } from '@mui/material'
import { SizeTypes } from '../../../config'
import CardImage from '../../../assets/IPCardImage.jpg'
import {
    FileUpload,
    FileUploadProps,
} from '../../../components/file-upload/fileUpload'
import ErrorButton from '../../../components/error-button'
import PrimaryButton from '../../../components/primary-button'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) => ({
    imageContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: theme.content.container.dark,
        maxHeight: '200px',
        marginBottom: '20px',
        cursor: 'pointer',
    },
    outlined: {
        border: '1px solid green',
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

export interface AddImageDialogProps {
    open: boolean
    setOpen: (boolean) => void
    handler: (string, SizeTypes) => void
}

const StyledImage = styled('img')(({ theme }) => ({
    borderTopLeftRadius: theme.spacing(0.4),
    borderTopRightRadius: theme.spacing(0.4),
    maxHeight: '200px',
}))

export default function AddImageDialog({
    open,
    setOpen,
    handler,
}: AddImageDialogProps) {
    const classes = useStyles()
    const theme = useTheme()
    const handleClose = () => {
        setOpen(false)
    }

    const [files, setFiles] = useState(null)
    const [selectedImageSize, setSelectedImageSize] = useState<SizeTypes>(
        SizeTypes.None,
    )
    const [next, setNext] = useState<boolean>(false)

    const fileUploadProp: FileUploadProps = {
        accept: 'image/*',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            if (
                event.target.files !== null &&
                event.target?.files?.length > 0
            ) {
                console.log(`Saving ${event.target.value}`)
            }
        },
        onDrop: (event: React.DragEvent<HTMLElement>) => {
            console.log(`Drop ${event.dataTransfer.files[0].name}`)
        },
    }

    const uploadFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(event.target.files)
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={!next ? 'lg' : 'sm'}
            fullWidth={true}
        >
            <DialogContent dividers sx={{ padding: 80 }}>
                {!next ? (
                    <React.Fragment>
                        <Box
                            className={clsx(
                                classes.imageContent,
                                selectedImageSize === SizeTypes.Large &&
                                    classes.outlined,
                            )}
                            onClick={() =>
                                setSelectedImageSize(SizeTypes.Large)
                            }
                        >
                            <StyledImage src={CardImage} alt="IPCardImage" />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box
                                    className={clsx(
                                        classes.imageContent,
                                        selectedImageSize ===
                                            SizeTypes.Medium &&
                                            classes.outlined,
                                    )}
                                    onClick={() =>
                                        setSelectedImageSize(SizeTypes.Medium)
                                    }
                                >
                                    <StyledImage
                                        src={CardImage}
                                        alt="IPCardImage"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={3}>
                                <Box
                                    className={clsx(
                                        classes.imageContent,
                                        selectedImageSize === SizeTypes.Small &&
                                            classes.outlined,
                                    )}
                                    onClick={() =>
                                        setSelectedImageSize(SizeTypes.Small)
                                    }
                                >
                                    <StyledImage
                                        src={CardImage}
                                        alt="IPCardImage"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                ) : (
                    <Box sx={{ padding: '40px 40px 20px 40px' }}>
                        <Box
                            sx={{
                                borderStyle: 'dotted',
                                borderColor: theme.palette.secondary.light,
                                cursor: 'pointer',
                            }}
                        >
                            <FileUpload
                                {...fileUploadProp}
                                onChange={uploadFileHandler}
                            />
                        </Box>
                    </Box>
                )}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '20px 40px',
                    }}
                >
                    <ErrorButton
                        handler={() => {
                            if (next) {
                                setSelectedImageSize(SizeTypes.None)
                                setNext(false)
                            } else {
                                setOpen(false)
                            }
                        }}
                    >
                        Back
                    </ErrorButton>

                    <PrimaryButton
                        sx={{ width: '45%' }}
                        onClick={() => {
                            if (next) {
                                handler(files, selectedImageSize)
                                setOpen(false)
                                setNext(false)
                                setFiles(null)
                            } else {
                                setNext(true)
                            }
                        }}
                    >
                        {!next ? 'Next' : 'Continue'}
                    </PrimaryButton>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}
