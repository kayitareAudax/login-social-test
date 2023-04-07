import React from 'react'
import { styled } from '@mui/material/styles'
import { Box, Tabs, Tab, Grid, Typography } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'
import StyledIconButton from '../styledIconButton'
import CloseIcon from '@mui/icons-material/Close'
import Tooltip from '@mui/material/Tooltip'

const useStyles = makeStyles((theme: Theme) => ({
    checkBox: {
        position: 'absolute !important' as any,
        right: '-10px',
        top: '0px',
        padding: '0px !important',
        zIndex: 2,
    },
    number: {
        position: 'absolute !important' as any,
        right: '-10px',
        top: '4px',
        backgroundColor: theme.content.container.dark,
        padding: '5px 10px',
        borderRadius: '4px',
        zIndex: 2,
    },
}))

const IPCardContainer = styled(Box)(({ theme }) => ({
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer',
    alignItems: 'center',
    padding: '10px',
}))

const StyledImage = styled('img')(({ theme }) => ({
    objectFit: 'cover',
    width: '100%',
    borderTopLeftRadius: theme.spacing(0.4),
    borderTopRightRadius: theme.spacing(0.4),
    transition: 'transform .5s ease',
    verticalAlign: 'bottom',
    '&:hover': {
        transform: 'scale(1.5)',
    },
}))

const CheckMarkImage = styled('img')(({ theme }) => ({
    position: 'absolute',
    bottom: '20px',
    width: '24px',
    right: '10px',
}))

const TitleContainer = styled(Box)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.secondaryButton.background.light,
    textAlign: 'center',
    borderBottomLeftRadius: '6px',
    borderBottomRightRadius: '6px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
}))

const StyledTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    fontSize: theme.spacing(2),
    textAlign: 'center',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        fontSize: theme.spacing(1.5),
    },
    borderBottomLeftRadius: '6px',
    borderBottomRightRadius: '6px',
    width: 'calc(100% - 30px)',
    padding: '15px 0px',
}))

export enum IPCardBoxType {
    None = -1,
    Title,
    CheckBox,
    CloseButton,
    NumberOfCopies,
}

interface IPCardProps {
    outGoing?: boolean
    imageSrc: string
    title?: string
    numberOfCopies?: number
    type: IPCardBoxType
    checked?: boolean
    clickable?: boolean
    handleChange?: () => void
}

const IPCard: React.FC<IPCardProps> = ({
    outGoing,
    imageSrc,
    title,
    numberOfCopies,
    type,
    checked,
    clickable,
    handleChange,
}: IPCardProps) => {
    const classes = useStyles()
    const theme = useTheme()

    const checkBoxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange()
    }

    const clickHandler = () => {
        if (clickable) {
            handleChange()
        }
    }

    return (
        <IPCardContainer onClick={clickHandler}>
            {type === IPCardBoxType.CheckBox && (
                <Checkbox
                    checked={checked}
                    onChange={checkBoxHandler}
                    inputProps={{ 'aria-label': 'controlled' }}
                    className={classes.checkBox}
                />
            )}
            {type === IPCardBoxType.NumberOfCopies && (
                <Typography className={classes.number}>
                    {numberOfCopies}{' '}
                </Typography>
            )}
            {type === IPCardBoxType.CloseButton && (
                <StyledIconButton
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        right: '-12px',
                        top: '-12px',
                        padding: 0,
                    }}
                    onClick={handleChange}
                >
                    <CloseIcon />
                </StyledIconButton>
            )}
            <Box
                sx={{
                    margin: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    cursor: 'pointer',
                    alignItems: 'center',
                    borderRadius: '10px',
                    width: '100%',
                }}
            >
                {checked && <CheckMarkImage src="/imgs/check.png" />}
                <Tooltip title={title}>
                    <Box
                        sx={{
                            overflow: 'hidden',
                            height: '100%',
                            borderRadius:
                                type === IPCardBoxType.None ? '10px' : 'none',
                            borderBottomLeftRadius:
                                type === IPCardBoxType.None ? '10px' : 'none',
                            borderBottomRightRadius:
                                type === IPCardBoxType.None ? '10px' : 'none',
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px',
                        }}
                    >
                        <StyledImage src={imageSrc} alt="IPCardImage" />
                    </Box>
                </Tooltip>
                {type === IPCardBoxType.None ||
                    (title && (
                        <TitleContainer
                            sx={{
                                backgroundColor: outGoing
                                    ? theme.palette.error.main
                                    : theme.secondaryButton.background.light,
                            }}
                        >
                            <StyledTitle>{title} </StyledTitle>
                        </TitleContainer>
                    ))}
            </Box>
        </IPCardContainer>
    )
}

export default IPCard
