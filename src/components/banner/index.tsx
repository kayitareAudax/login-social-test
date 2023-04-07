import React from 'react'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import clsx from 'clsx'
import FileUploadDefaultImage from '../../assets/FileUploadDefaultImage.png'
import { styled } from '@mui/material/styles'

const UploadImageContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    background: theme.palette.secondary.main,
    textAlign: 'center',
    padding: theme.spacing(10, 0),
}))

const UploadImage = styled('img')(({ theme }) => ({
    height: theme.spacing(5.5),
    maxWidth: '100%',
    textAlign: 'center',
    borderRadius: theme.spacing(1),
}))

export type BannerProps = {
    accept: string
    hoverLabel?: string
    dropLabel?: string
    width?: string
    height?: string
    backgroundColor?: string
    image?: {
        url: string
        imageStyle?: {
            width?: string
            height?: string
        }
    }
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const useStyles = makeStyles({
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        display: 'flex',
        '&:hover p,&:hover svg,& img': {
            opacity: 1,
        },
        '& p, svg': {
            opacity: 0.4,
        },
        '&:hover img': {
            opacity: 0.3,
        },
    },
    noMouseEvent: {
        pointerEvents: 'none',
    },
    iconText: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    hidden: {
        display: 'none',
    },
    onDragOver: {
        '& img': {
            opacity: 0.3,
        },
        '& p, svg': {
            opacity: 1,
        },
    },
})

export const Banner: React.FC<BannerProps> = ({
    accept,
    hoverLabel = 'Click or drag to upload file',
    width = '100%',
    height = '100px',
    backgroundColor = '#fff',
    image: {
        url = FileUploadDefaultImage,
        imageStyle = {
            height: 'inherit',
        },
    } = {},
    onChange,
}) => {
    const classes = useStyles()
    const [imageUrl, setImageUrl] = React.useState<string>(url)
    const [labelText, setLabelText] = React.useState<string>(hoverLabel)
    const [isDragOver, setIsDragOver] = React.useState<boolean>(false)
    const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false)

    const dragEvents = {
        onMouseEnter: () => {
            setIsMouseOver(true)
        },
        onMouseLeave: () => {
            setIsMouseOver(false)
        },
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files[0]) {
            setImageUrl(URL.createObjectURL(event.target.files[0]))
            console.log(URL.createObjectURL(event.target.files[0]))
        }

        setLabelText(event.target.files[0].name)
        onChange(event)
    }

    return (
        <>
            <input
                onChange={handleChange}
                accept={accept}
                className={classes.hidden}
                id="file-upload"
                type="file"
                multiple={false}
            />

            <label
                htmlFor="file-upload"
                {...dragEvents}
                className={clsx(classes.root, isDragOver && classes.onDragOver)}
            >
                <Box
                    width={width}
                    height={height}
                    bgcolor={backgroundColor}
                    className={classes.noMouseEvent}
                >
                    <Box position="absolute" height={height} width={width}>
                        <img
                            alt="file upload"
                            src={imageUrl}
                            style={imageStyle}
                        />
                    </Box>

                    {(isDragOver || isMouseOver) && (
                        // <>
                        //     <Box
                        //         height={height}
                        //         width={width}
                        //         className={classes.iconText}
                        //     >

                        //     </Box>
                        // </>
                        <UploadImageContainer>
                            <UploadImage src={imageUrl} />
                        </UploadImageContainer>
                    )}
                </Box>
            </label>
        </>
    )
}
