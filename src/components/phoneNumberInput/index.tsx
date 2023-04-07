import { useState } from 'react'
import { Box } from '@mui/material'
import PhoneInput from 'react-phone-input-2'
import './style.css'
import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => ({
    BoxInline: {
        flexDirection: 'row',
        display: 'flex',
    },
    BoxText: {
        display: 'flex',
        // alignItems: 'center !important',
        marginTop: '8px',
        '& span': {
            color: 'red',
            paddingLeft: 5,
        },
    },
}))

interface PhoneInputProps {
    phoneNumber: string
    setPhoneNumber: (string) => void
    errorTxt: string
    handler: (string) => void
}

const PhoneNumberInput = ({
    errorTxt,
    handler,
    phoneNumber,
    setPhoneNumber,
}: PhoneInputProps) => {
    const classes = useStyles()
    const [error, setError] = useState<boolean>(false)

    const changeHandler = (phone: string) => {
        setPhoneNumber(phone)
        if (phone.length < 10) {
            setError(true)
        } else {
            setError(false)
        }
        handler(phone)
    }

    return (
        <Box className={classes.BoxInline} pr={1} pl={1}>
            <Box>
                <PhoneInput
                    specialLabel={''}
                    country={'us'}
                    inputStyle={{
                        borderColor: error && 'red',
                    }}
                    value={phoneNumber}
                    onChange={(e) => changeHandler(e)}
                />
                {error && (
                    <p
                        style={{ color: 'red' }}
                        className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-filled MuiFormHelperText-marginDense"
                    >
                        {errorTxt}
                    </p>
                )}
            </Box>
        </Box>
    )
}

// const PhoneNumberInput = (props: any) => {
//     return (
//         <Input
//             req={true}
//             helperText={'Invalid phone number, must be 10 digits'}
//             error={true}
//             isSelect={false}
//             {...props.input}
//             {...props.meta}
//             {...props.custom}
//         />
//     )
// }

export default PhoneNumberInput
