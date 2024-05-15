import { NextPage } from 'next'
import { OrderPDF } from '@components/PDFTables/OrderPDF'
import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { ReturnPDF } from '@components/PDFTables/ReturnPDF'

const Report: NextPage = () => {
  const router = useRouter()
  const [tableData, setTableData] = useState([])

  const goBack = () => {
    router.back()
  }

  useEffect(() => {
    if (router.query.data && typeof router.query.data === 'string') {
      setTableData(JSON.parse(router.query.data))
    }
  }, [router.query])

  const PDF = router.query.for === 'order' ? OrderPDF : ReturnPDF

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      <div style={{ padding: 10 }}>
        <Button
          onClick={goBack}
          variant="contained"
        >
          Wróć
        </Button>
      </div>
      <PDF data={tableData} />
    </div>
  )
}

export default Report
