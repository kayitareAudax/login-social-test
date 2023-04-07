import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { IPCard, IPCardBoxType } from '../../../components/cards'
import CardImage from '../../../assets/IPCardImage.jpg'
import { SectionTypes } from '../../../config'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.content.container.dark,
        height: '100%',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    contentBlock: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '20px',
        height: '100%',
    },
    outlined: {
        border: '1px solid green',
    },
}))

interface AddLicenseShowcaseProps {
    isSelected: boolean
    handleClick: (type: SectionTypes) => void
}

export default function AddLicenseShowcase({
    isSelected,
    handleClick,
}: AddLicenseShowcaseProps) {
    const classes = useStyles()

    return (
        <Box
            className={clsx(classes.root, isSelected && classes.outlined)}
            onClick={() => handleClick(SectionTypes.AddLicenseShowcaseSection)}
        >
            <Box className={classes.contentBlock}>
                <Typography align="center">License Showcase</Typography>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <IPCard
                        type={IPCardBoxType.None}
                        imageSrc={CardImage}
                        title="IP Name"
                    />
                </Box>
            </Box>
        </Box>
    )
}
