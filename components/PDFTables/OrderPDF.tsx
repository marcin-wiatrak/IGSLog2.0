import { Document, Font, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer'
import { useEffect, useState } from 'react'
import { LogoSVG } from '@components/PDFTables/LogoSVG'
import { OrderType } from '@src/types'
import { translatedType } from '@src/utils/textFormatter'

export const ORDER_TABLE_COLUMNS = [
  { key: 'no', title: 'ID', width: '5%' },
  { key: 'type', title: 'Dział', width: '10%' },
  { key: 'signature', title: 'Sygnatura', width: '10%' },
  { key: 'localization', title: 'M. odbioru', width: '10%' },
  { key: 'zg', title: 'Zgodność mat. z post.', width: '15%' }, //R
  { key: 'envelop', title: 'Nr koperty/pakiet', width: '20%' },
  { key: 'date', title: 'Data', width: '10%' },
  { key: 'odebral', title: 'Odebrał', width: '10%' },
  { key: 'przekazal', title: 'Przekazał', width: '10%' },
]

export const TABLE_MAX_ROWS = 14

export const OrderPDF = ({ data }) => {
  const [showPdf, setShowPdf] = useState(false)
  const [records, setRecords] = useState([])

  useEffect(() => {
    setRecords(data)
    const elementsOnLastPage = data.length % TABLE_MAX_ROWS
    if (data.length === TABLE_MAX_ROWS) {
      const emptyRows = Array.from({ length: TABLE_MAX_ROWS }, () => ({
        no: ' ',
        type: [],
        signature: ' ',
        localization: ' ',
        zg: ' ',
        envelop: ' ',
        date: ' ',
        odebral: ' ',
        przekazal: ' ',
      }))
      setRecords((prev) => [...prev, ...emptyRows])
    }

    if (elementsOnLastPage > 0) {
      const emptyRows = Array.from({ length: TABLE_MAX_ROWS - elementsOnLastPage }, () => ({
        no: ' ',
        type: [],
        signature: ' ',
        localization: ' ',
        zg: ' ',
        envelop: ' ',
        date: ' ',
        odebral: ' ',
        przekazal: ' ',
      }))
      setRecords((prev) => [...prev, ...emptyRows])
    }
  }, [data])

  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
        fontWeight: 400,
      },
    ],
  })

  const Header = () => (
    <View
      style={styles.header}
      fixed={true}
    >
      <View style={styles.logo}>
        <LogoSVG />
      </View>
      <View style={styles.headerTextContainer}>
        <Text>PROTOKÓŁ ZADWCZO-ODBIORCZY</Text>
        <Text style={styles.headerSubtitle}>ODBIÓR MATERIAŁU</Text>
      </View>
    </View>
  )

  const Footer = () => (
    <View
      style={styles.footer}
      fixed={true}
    >
      <View style={styles.textContainer}>
        <Text>UL. MICKIEWICZA 3/5, 85-071 BYDGOSZCZ</Text>
        <Text>UL. KOPERNIKA 10, 85-074 BYDGOSZCZ</Text>
      </View>
      <View style={styles.textContainer}>
        <Text>WWW.IGS.ORG.PL</Text>
      </View>
    </View>
  )

  const TableHeader = () => (
    <View style={styles.row}>
      {ORDER_TABLE_COLUMNS.map((column) => (
        <Text
          key={column.key}
          style={[styles.tableHeadCell, { width: column.width }]}
        >
          {column.title}
        </Text>
      ))}
    </View>
  )

  const TableRow = ({ item }) => (
    <View
      style={[styles.row]}
      wrap={false}
    >
      {/* ####### col 1 ########*/}
      <View
        key={ORDER_TABLE_COLUMNS[0].key}
        style={[
          styles.tableCell,
          {
            width: ORDER_TABLE_COLUMNS[0].width,
          },
        ]}
      >
        <View style={styles.textFit}>
          <Text>
            {item[ORDER_TABLE_COLUMNS[0].key]}
          </Text>
        </View>
      </View>
      {/* ####### col 2 ########*/}
      <View
        key={ORDER_TABLE_COLUMNS[1].key}
        style={[
          styles.tableCell,
          {
            width: ORDER_TABLE_COLUMNS[1].width,
          },
        ]}
      >
        <View style={styles.textFit}>
          <Text>
            {(item.type || []).map((type: OrderType) => translatedType[type]).join(', ')}
          </Text>
        </View>
      </View>
      {/* ####### col 3 ########*/}
      <View
        key={ORDER_TABLE_COLUMNS[2].key}
        style={[
          styles.tableCell,
          {
            width: ORDER_TABLE_COLUMNS[2].width,
          },
        ]}
      >
        <View style={styles.textFit}>
          <Text>
            {item[ORDER_TABLE_COLUMNS[2].key]}
          </Text>
        </View>
      </View>
      {/* ####### col 4 ########*/}
      <View
        key={ORDER_TABLE_COLUMNS[3].key}
        style={[
          styles.tableCell,
          {
            width: ORDER_TABLE_COLUMNS[3].width,
          },
        ]}
      >
        <View style={styles.textFit}>
          <Text>
            {item[ORDER_TABLE_COLUMNS[3].key]}
          </Text>
        </View>
      </View>
      {/* ####### col 5 ########*/}
      <View
        style={[
          styles.tableCell,
          {
            width: ORDER_TABLE_COLUMNS[4].width,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            fontSize: 4,
            gap: 2,
          },
        ]}
        key={ORDER_TABLE_COLUMNS[4].key}
      >
        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox}> </View>
          <Text>Sprawdzono z postanowieniem</Text>
        </View>
        <View style={[styles.checkboxContainer, { borderLeft: '1px solid grey' }]}>
          <View style={styles.checkbox}> </View>
          <Text>Brak możliwości sprawdzenia</Text>
        </View>
      </View>
      {/* ####### col 6 ########*/}
      <Text
        key={ORDER_TABLE_COLUMNS[5].key}
        style={[
          styles.tableCell,
          {
            width: ORDER_TABLE_COLUMNS[5].width,
          },
        ]}
      >
        <View style={styles.textFit}>
          <Text>
            {item[ORDER_TABLE_COLUMNS[5].key]}
          </Text>
        </View>
      </Text>
      {/* ####### col 7 ########*/}
      <Text
        key={ORDER_TABLE_COLUMNS[6].key}
        style={[
          styles.tableCell,
          {
            width: ORDER_TABLE_COLUMNS[6].width,
          },
        ]}
      >
        <View style={styles.textFit}>
          <Text>
            {item[ORDER_TABLE_COLUMNS[6].key]}
          </Text>
        </View>
      </Text>
      {/* ####### col 8 ########*/}
      <Text
        key={ORDER_TABLE_COLUMNS[7].key}
        style={[
          styles.tableCell,
          {
            width: ORDER_TABLE_COLUMNS[7].width,
          },
        ]}
      >
        <View style={styles.textFit}>
          <Text>
            {item[ORDER_TABLE_COLUMNS[7].key]}
          </Text>
        </View>
      </Text>
      {/* ####### col 9 ########*/}
      <Text
        key={ORDER_TABLE_COLUMNS[8].key}
        style={[
          styles.tableCell,
          {
            width: ORDER_TABLE_COLUMNS[8].width,
          },
        ]}
      >
        <View style={styles.textFit}>
          <Text>
            {item[ORDER_TABLE_COLUMNS[8].key]}
          </Text>
        </View>
      </Text>
    </View>
  )

  const MyDocument = () => (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={styles.page}
        wrap={true}
        minPresenceAhead={5}
      >
        <Header />
        <View style={styles.tableContainer}>
          <TableHeader />
          {records.map((item) => (
            <TableRow
              key={item.description}
              item={item}
            />
          ))}
        </View>
        <Footer />
      </Page>
    </Document>
  )

  useEffect(() => {
    if (records.length > 0) setShowPdf(true)
  }, [records])

  return (
    <>
      {showPdf && (
        <PDFViewer style={{ height: '100vh', width: '100vw' }}>
          <MyDocument />
        </PDFViewer>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 50,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerSubtitle: {
    color: '#4472C4',
    textAlign: 'center',
  },
  logo: {
    width: 150,
  },
  textContainer: {
    fontSize: 10,
  },
  tableContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
    marginTop: -1,
  },
  description: {
    width: '60%',
  },
  xyz: {
    width: '40%',
  },
  tableCell: {
    fontSize: 8,
    border: '1px solid black',
    paddingVertical: 8,
    paddingHorizontal: 3,
    marginLeft: -1,
    height: 30,
  },
  tableHeadCell: {
    fontSize: 8,
    border: '1px solid black',
    paddingVertical: 8,
    paddingHorizontal: 3,
    textAlign: 'center',
    marginLeft: -1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: 29,
  },
  footer: {
    color: '#4472C4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    alignSelf: 'flex-end',
    marginBottom: -30,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    fontSize: 4,
    gap: 2,
    flex: 1,
    textAlign: 'center',
  },
  checkbox: {
    width: 6,
    height: 6,
    border: '0.5px solid black',
    // backgroundColor: '#ccc'
  },
  textFit: {
    flex: 1,
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    fontSize: 4,
  },
})
