import { Button } from '@mui/material'

interface ErrorButtonProps {
    children: React.ReactNode
    handler: () => void
}

export default function ErrorButton({ children, handler }: ErrorButtonProps) {
    return (
        <Button
            variant="contained"
            color="error"
            sx={{
                textTransform: 'capitalize',
                width: '45%',
                height: '50px',
            }}
            onClick={() => handler()}
        >
            {children}
        </Button>
    )
}
