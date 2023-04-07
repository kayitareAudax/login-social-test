import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'
import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import SecondaryButton from '../../../components/secondary-button'
import { toast } from 'react-hot-toast'
import {
    reportAppealByUser,
    reportBurnedLicenseByUser,
} from '../../../api/report'
import { useSelector } from 'react-redux'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    cursor: 'pointer',
}))

interface Data {
    time: string
    message: string
    options: number
}

export enum NotificationTypes {
    None = -1,
    Offer = 0,
    PurchasingOrSale = 1,
    Recommended = 2,
    Burnt = 3,
    Changed = 4,
    Follower = 5,
}

function createData(time: string, message: string, options: number): Data {
    return {
        time,
        message,
        options,
    }
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number,
) {
    const stabilizedThis = array?.map((el, index) => [el, index] as [T, number])
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) {
            return order
        }
        return a[1] - b[1]
    })
    return stabilizedThis?.map((el) => el[0])
}

interface HeadCell {
    disablePadding: boolean
    id: keyof Data
    label: string
    numeric: boolean
}

const headCells: readonly HeadCell[] = [
    {
        id: 'time',
        numeric: false,
        disablePadding: true,
        label: 'Time',
    },
    {
        id: 'message',
        numeric: false,
        disablePadding: false,
        label: 'Message',
    },
    {
        id: 'options',
        numeric: false,
        disablePadding: false,
        label: 'Options',
    },
]

interface EnhancedTableProps {
    numSelected: number
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => void
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
    order: Order
    orderBy: string
    rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, rowCount, onRequestSort } = props
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property)
        }

    return (
        <TableHead>
            <StyledTableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </StyledTableRow>
        </TableHead>
    )
}

interface NotificationsTableProps {
    notifications: Array<any>
}

export default function NotificationsTable({
    notifications,
}: NotificationsTableProps) {
    const theme = useTheme()
    const [order, setOrder] = React.useState<Order>('asc')
    const [orderBy, setOrderBy] = React.useState<keyof Data>('time')
    const [selected, setSelected] = React.useState<readonly string[]>([])
    const [page, setPage] = React.useState(0)
    const [dense, setDense] = React.useState(false)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [reportedClaim, setReportedClaim] = React.useState([])

    const authorization = useSelector(
        (state: { authorization: any }) => state.authorization,
    )

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.checked) {
            const newSelected = notifications.map((n) => n.time)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    // const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    //     const selectedIndex = selected.indexOf(name)
    //     let newSelected: readonly string[] = []

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, name)
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1))
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1))
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1),
    //         )
    //     }

    //     setSelected(newSelected)
    // }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - notifications?.length)
            : 0

    const reportAppeal = async (_claim) => {
        const claim = Object.assign({}, _claim)
        const toastReportingLicense = toast.loading('Reporting now')
        const res = await reportAppealByUser({
            accountAddress: authorization?.currentUser?.walletAddress,
            contentId: claim.contentId,
            userId: claim.userId,
        })
        if (res.status === 200 && res.data.success) {
            const tmp = reportedClaim.map((item) => {
                if (
                    item.userId === res.data.data.userId &&
                    item.contentId === res.data.data.contentId
                ) {
                    return {
                        ...item,
                        status: res.data.data.status,
                        active: false,
                    }
                } else {
                    return item
                }
            })
            setReportedClaim(tmp)
            toast.success('Successfully reported!', {
                id: toastReportingLicense,
            })
        } else {
            toast.error('couldnt report now', { id: toastReportingLicense })
        }
    }

    const reportBurned = async (licenseId) => {
        const toastReportingLicense = toast.loading('Reporting now')
        const res = await reportBurnedLicenseByUser({ licenseId })
        if (res.status === 200 && res.data.success) {
            toast.success(res.data.msg, {
                id: toastReportingLicense,
            })
        } else {
            toast.error('couldnt report now', { id: toastReportingLicense })
        }
    }

    return (
        <Box sx={{ width: '100%', marginTop: '20px' }}>
            <Paper
                sx={{
                    width: '100%',
                    mb: 2,
                    p: 2,
                    overflowX: 'auto',
                    backgroundColor: theme.palette.secondary.light,
                }}
            >
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={notifications?.length}
                        />
                        <TableBody>
                            {stableSort(
                                notifications,
                                getComparator(order, orderBy),
                            )
                                ?.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage,
                                )
                                ?.map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`
                                    const created = new Date(
                                        row.created_at,
                                    ).toISOString()

                                    const remainedTime =
                                        Date.parse(new Date().toISOString()) -
                                        Date.parse(created)
                                    const days = Math.floor(
                                        remainedTime / (1000 * 60 * 60 * 24),
                                    )
                                    const hours = Math.floor(
                                        (remainedTime % (1000 * 60 * 60 * 24)) /
                                            (1000 * 60 * 60),
                                    )
                                    const minutes = Math.floor(
                                        (remainedTime % (1000 * 60 * 60)) /
                                            (1000 * 60),
                                    )
                                    const seconds = Math.floor(
                                        (remainedTime % (1000 * 60)) / 1000,
                                    )

                                    let countedTime
                                    if (days > 0) {
                                        countedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`
                                    } else {
                                        if (hours > 0) {
                                            countedTime = `${hours}h ${minutes}m ${seconds}s`
                                        } else {
                                            if (minutes > 0) {
                                                countedTime = `${minutes}m ${seconds}s`
                                            } else {
                                                countedTime = `${seconds}s`
                                            }
                                        }
                                    }

                                    return (
                                        <StyledTableRow
                                            hover
                                            tabIndex={-1}
                                            key={index}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {countedTime} ago
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.description}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.type ===
                                                    NotificationTypes.Burnt && (
                                                    <SecondaryButton
                                                        onClick={() =>
                                                            reportBurned(row.id)
                                                        }
                                                    >
                                                        Dispute
                                                    </SecondaryButton>
                                                )}
                                                {row.action ===
                                                    NotificationTypes.Changed && (
                                                    <SecondaryButton>
                                                        View
                                                    </SecondaryButton>
                                                )}
                                            </TableCell>
                                        </StyledTableRow>
                                    )
                                })}
                            {emptyRows > 0 && (
                                <StyledTableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={notifications?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}
