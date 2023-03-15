import { TablePagination } from '@mui/material'

export const TablePaginator = ({ pagination }) => {
  if (!pagination.count || !pagination.rowsPerPage) return null
  return (
    <TablePagination
      labelRowsPerPage="Wyświetl:"
      rowsPerPageOptions={[10, 25, 50, 100]}
      count={pagination.count}
      page={pagination.page}
      rowsPerPage={pagination.rowsPerPage}
      onRowsPerPageChange={pagination.handleRowsPerPageChange}
      onPageChange={pagination.handlePageChange}
    />
  )
}
