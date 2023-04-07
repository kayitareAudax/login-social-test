import TextField from '@mui/material/TextField'
import { Box } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import StyledIconButton from '../../components/styledIconButton'
import CloseIcon from '@mui/icons-material/Close'
import { SizeTypes } from '../../config'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        backgroundColor: theme.content.container.dark,
        padding: '20px',
        borderRadius: '6px',
        position: 'relative',
        margin: '15px',
    },
    checkBox: {
        position: 'absolute !important' as any,
        right: '-20px',
        top: '-20px',
    },
}))

interface DescriptionTextFieldProps {
    txt: string
    editMode: boolean
    showCloseButton: boolean
    size?: SizeTypes
    handleChange?: (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => void
    removeItem?: () => void
}

export default function DescriptionTextField({
    txt,
    editMode,
    showCloseButton,
    size,
    handleChange,
    removeItem,
}: DescriptionTextFieldProps) {
    const classes = useStyles()
    return (
        <Box className={classes.root}>
            <TextField
                value={txt}
                fullWidth
                multiline
                placeholder="Write a description"
                inputProps={{
                    maxLength:
                        size === SizeTypes.Large
                            ? 800
                            : size === SizeTypes.Medium
                            ? 400
                            : 100,
                    readOnly: editMode,
                }}
                onChange={handleChange}
            />
            {showCloseButton && (
                <StyledIconButton
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        right: '-12px',
                        top: '-12px',
                        padding: 0,
                    }}
                    onClick={() => removeItem()}
                >
                    <CloseIcon />
                </StyledIconButton>
            )}
        </Box>
    )
}
