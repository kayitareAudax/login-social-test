import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Theme, useTheme } from '@mui/material/styles'
import { Button, Box, Grid, Typography } from '@mui/material'
import SecondaryButton from '../../../components/secondary-button'
import { makeStyles } from '@mui/styles'
import { IPCard, IPCardBoxType } from '../../../components/cards'
import Pagination from '@mui/material/Pagination'
import { SectionTypes } from '../../../config'
import { useSelector } from 'react-redux'
import { randomRange } from '../../../utils/utils'

const useStyles = makeStyles((theme: Theme) => ({
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        color: theme.palette.secondary.dark,
        marginTop: '10px',
        minWidth: '350px',
        '& fieldset': {
            height: '50px',
        },
    },
    saveButton: {
        position: 'absolute !important' as any,
        right: 10,
        bottom: 0,
        margin: '0px !important',
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

export interface AddLicensesDialogProps {
    open: boolean
    type: SectionTypes
    setOpen: (open: boolean) => void
    handler: (licenses: Array<any>, type: SectionTypes) => void
}

export default function AddLicensesDialog({
    open,
    setOpen,
    type,
    handler,
}: AddLicensesDialogProps) {
    const classes = useStyles()
    const [keyword, setKeyword] = useState<string>()
    const [selectedLicenses, setSelectedLicenses] = useState<Array<any>>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [licenses, setLicences] = useState<Array<any>>([])

    const handleClose = () => {
        setOpen(false)
    }

    const searchHandler = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {}

    const checkBoxHandler = (license) => {
        let tmp
        tmp = [...selectedLicenses]
        if (selectedLicenses.includes(license)) {
            tmp = tmp.filter((item) => item !== license)
            setSelectedLicenses(tmp)
        } else {
            tmp.push(license)
            setSelectedLicenses(tmp)
        }
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
                <React.Fragment>
                    <Box className={classes.headerContainer}>
                        <Typography>{`${selectedLicenses.length} Licenses Selected`}</Typography>
                        <OutlinedInput
                            placeholder="Search"
                            className={classes.input}
                            value={keyword}
                            onChange={(
                                e: React.ChangeEvent<
                                    HTMLTextAreaElement | HTMLInputElement
                                >,
                            ) => searchHandler(e)}
                            type="text"
                            required
                        />
                    </Box>

                    <Grid container spacing={2}>
                        {!loading &&
                            licenses.length > 0 &&
                            licenses.map((license: any, idx: number) => {
                                return (
                                    <Grid item xs={3} key={idx}>
                                        <IPCard
                                            title={license.licenseName}
                                            imageSrc={license.imagePath}
                                            type={IPCardBoxType.CheckBox}
                                            checked={selectedLicenses.includes(
                                                license,
                                            )}
                                            handleChange={() =>
                                                checkBoxHandler(license)
                                            }
                                        />
                                    </Grid>
                                )
                            })}
                        {loading &&
                            randomRange(12).map((item, idx) => {
                                return (
                                    <Grid item xs={3} key={idx}>
                                        <img
                                            src="imgs/page_loader.gif"
                                            alt="loader"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '6px',
                                            }}
                                        />
                                    </Grid>
                                )
                            })}
                    </Grid>

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '20px',
                            width: 'calc(100% - 40px)',
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="center"
                            position="relative"
                        >
                            <Pagination count={10} color="primary" />
                            <SecondaryButton
                                className={classes.saveButton}
                                onClick={() => {
                                    handler(selectedLicenses, type)
                                    setSelectedLicenses([])
                                    setOpen(false)
                                }}
                            >
                                Save
                            </SecondaryButton>
                        </Box>
                    </Box>
                </React.Fragment>
            </DialogContent>
        </BootstrapDialog>
    )
}
