import ThemeRoutes from './routes'
import { getTheme } from './utils/theme'
import { ThemeProvider } from '@mui/material/styles'
import { Toaster } from 'react-hot-toast'
import { CLIENT_URL } from './config'
import { signout } from './api'
import { NotificationProvider } from './context/notification'
import 'react-multi-carousel/lib/styles.css'
import './App.css'

function App() {
    const themes = getTheme()
    const logOut = () => {
        signout()
        window.location.href = CLIENT_URL
    }

    return (
        <ThemeProvider theme={themes}>
            <NotificationProvider>
                <Toaster />
                <ThemeRoutes logOut={logOut} />
            </NotificationProvider>
        </ThemeProvider>
    )
}

export default App
