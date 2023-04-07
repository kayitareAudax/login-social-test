import { useContext } from 'react'
import Popper, { PopperPlacementType } from '@mui/material/Popper'
import { Alert, AlertColor, Box, IconButton, Fade, Stack } from '@mui/material'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead'
import CheckIcon from '@mui/icons-material/Check'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { NotificationContext } from '../../context/notification'
import { markAllAsReadNotification, markAsReadNotification } from '../../api'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'

interface NotificationMenuProps {
    open: boolean
    anchorEl: null | HTMLElement
}

const NotificationMenu = ({ open, anchorEl }: NotificationMenuProps) => {
    const [notifications, dispatch] = useContext(NotificationContext)
    const authorization = useSelector(
        (state: { authorization: any }) => state.authorization,
    )
    // const clear = () => {}

    const markAsRead = async (id) => {
        const res = await markAsReadNotification(id)
        if (res.status === 200 && res.data.success) {
            toast.success(res.data.msg)
            const tmp = [...notifications].map((notification) => {
                if (id === notification._id) {
                    return { ...notification, read: true }
                } else {
                    return notification
                }
            })
            dispatch({ type: 'update', payload: tmp })
        } else {
            toast.error(res.data.msg)
        }
    }

    const markAllAsRead = async () => {
        if (authorization?.currentUser?.walletAddress) {
            const res = await markAllAsReadNotification(
                authorization?.currentUser?.walletAddress,
                authorization?.currentUser?.artistName,
            )
            if (res.status === 200 && res.data.success) {
                toast.success(res.data.msg)
                dispatch({ type: 'update', payload: [] })
            } else {
                toast.error(res.data.msg)
            }
        }
    }

    return (
        <Box sx={{ borderRadius: '10px' }}>
            <Popper
                open={open}
                anchorEl={anchorEl}
                transition
                placement="bottom-end"
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Box>
                            <Stack
                                sx={{
                                    maxHeight: '320px',
                                    width: 'calc(100% - 20px)',
                                    background: '#8fc7b7',
                                    overflowY: 'auto',
                                    padding: '20px 10px',
                                    borderTopRightRadius: '10px',
                                    borderTopLeftRadius: '10px',
                                }}
                                spacing={2}
                            >
                                {!notifications.length && (
                                    <h4>
                                        You have no notifications{' '}
                                        <span
                                            role="img"
                                            aria-label="dunno what to put"
                                        >
                                            🎉
                                        </span>
                                    </h4>
                                )}
                                {notifications.map((notification, idx) => {
                                    return (
                                        <Alert
                                            key={idx}
                                            severity={'info'}
                                            action={
                                                notification.read ? (
                                                    <CheckIcon />
                                                ) : (
                                                    <IconButton
                                                        color="primary"
                                                        aria-label="upload picture"
                                                        component="span"
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification._id,
                                                            )
                                                        }
                                                    >
                                                        <MarkChatReadIcon />
                                                    </IconButton>
                                                )
                                            }
                                        >
                                            {notification.description}
                                        </Alert>
                                    )
                                })}
                            </Stack>
                            <Box
                                sx={{
                                    background: '#b9f9db',
                                    padding: '8px',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    borderBottomRightRadius: '10px',
                                    borderBottomLeftRadius: '10px',
                                }}
                            >
                                {/* <IconButton onClick={clear}>
                                    <ClearAllIcon />
                                </IconButton> */}
                                <IconButton onClick={markAllAsRead}>
                                    <DoneAllIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Popper>
        </Box>
    )
}

export default NotificationMenu
