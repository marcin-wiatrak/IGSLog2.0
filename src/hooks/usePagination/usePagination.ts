import { useCallback, useMemo, useState } from 'react'

export const usePagination = (data, defaultRowsPerPage) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)

  const count = useMemo(() => {
    return data.length
  }, [data])

  const handlePageChange = useCallback((_, newPage) => setPage(newPage), [])

  const handleRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(+e.target.value)
    setPage(0)
  }, [])

  const handlePagination = useCallback(
    (orders) => {
      return orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    },
    [page, rowsPerPage]
  )

  return {
    page,
    count,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    handlePagination,
  }
}
