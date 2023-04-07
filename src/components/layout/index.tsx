import React from 'react'
import Navbar from '../navbar'
import MediasDialog from '../navbar/mediasDialog'

export default function PageLayout({ children }) {
    const [openSell, setOpenSell] = React.useState<boolean>(false)

    return (
        <React.Fragment>
            <Navbar setOpenSell={setOpenSell} />
            <MediasDialog
                open={openSell}
                setOpen={setOpenSell}
                href={'/sell'}
            />
            {children}
        </React.Fragment>
    )
}
