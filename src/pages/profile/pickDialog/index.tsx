import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { Grid, Box } from '@mui/material'
import AddLicenseShowcase from './addLicenseShowcase'
import AddImage from './addImage'
import AddMusicPreview from './addMusicPreview'
import AddDescription from './addDescription'
import AddVideo from './addVideo'
import { SectionTypes } from '../../../config'
import PrimaryButton from '../../../components/primary-button'
import ErrorButton from '../../../components/error-button'

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

export interface DialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    handler: (type: SectionTypes) => void
}

export default function PickDialog({ open, setOpen, handler }: DialogProps) {
    const [selectedSectionType, setSelectedSectionType] =
        useState<SectionTypes>(SectionTypes.None)
    const handleClose = () => {
        setOpen(false)
    }

    const sectionHandler = (sectionType: SectionTypes) => {
        setSelectedSectionType(sectionType)
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth="lg"
            fullWidth={true}
        >
            <DialogContent dividers sx={{ padding: 80 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <AddLicenseShowcase
                            isSelected={
                                selectedSectionType ===
                                SectionTypes.AddLicenseShowcaseSection
                                    ? true
                                    : false
                            }
                            handleClick={sectionHandler}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <AddImage
                            isSelected={
                                selectedSectionType ===
                                SectionTypes.AddImageSection
                                    ? true
                                    : false
                            }
                            handleClick={sectionHandler}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <AddMusicPreview
                            isSelected={
                                selectedSectionType ===
                                SectionTypes.AddMusicPreviewSection
                                    ? true
                                    : false
                            }
                            handleClick={sectionHandler}
                        />
                    </Grid>
                </Grid>
                <AddDescription
                    isSelected={
                        selectedSectionType ===
                        SectionTypes.AddDescriptionSection
                            ? true
                            : false
                    }
                    handleClick={sectionHandler}
                />
                <AddVideo
                    isSelected={
                        selectedSectionType === SectionTypes.AddVideoSection
                            ? true
                            : false
                    }
                    handleClick={sectionHandler}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '20px 100px',
                    }}
                >
                    <ErrorButton handler={() => setOpen(false)}>
                        Back
                    </ErrorButton>

                    <PrimaryButton
                        sx={{ width: '45%' }}
                        onClick={() => handler(selectedSectionType)}
                    >
                        Next
                    </PrimaryButton>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}
