import { useCallback, useEffect, useMemo, useState } from 'react'

export const usePagination = (data, defaultRowsPerPage) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)

  const count = useMemo(() => {
    return data.length
  }, [data])

  const handlePageChange = useCallback((_, newPage) => setPage(newPage), [])

  const handleRowsPerPageChange = useCallback((e) => {
    const rows = e.target.value
    setRowsPerPage(rows)
    localStorage.setItem('paginationCounter', rows)
    setPage(0)
  }, [])

  useEffect(() => {
    const paginationCounter = localStorage.getItem('paginationCounter')
    if (paginationCounter !== null) setRowsPerPage(paginationCounter)
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
