import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/procesar.module.css'
import * as XLSX from 'xlsx'

export default function Procesar() {
  const [cliente, setCliente] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [factura, setFactura] = useState(null)
  const [editing, setEditing] = useState(false)
  const router = useRouter()

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx8UOTQViDzmigyJRfTPzwrtVVs1sc_ihGcA0KwEmYZRCoICES_9DNPXivEPweYMHF7Qw/exec'

  useEffect(() => {
    const stored = localStorage.getItem('cliente')
    if (!stored) {
      router.push('/')
    } else {
      setCliente(stored)
    }
  }, [router])

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError('')
    setFactura(null)
  }

  const procesarPDF = async () => {
    if (!file) {
      setError('Seleccioná un PDF')
      return
    }

    setLoading(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const base64 = e.target.result.split(',')[1]
          
          if (!base64) {
            setError('Error al leer el PDF')
            setLoading(false)
            return
          }

          const password = cliente === 'CLICK-FAST' ? 'clickfast2026' : 'madeoff2026'
          
          const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
              cliente: cliente,
              password: password,
              pdfBase64: base64
            })
          })

          const data = await response.json()

          if (data.success) {
            setFactura(data.data)
            setEditing(true)
          } else {
            setError(data.error || 'Error al procesar')
          }
          setLoading(false)
        } catch (err) {
          setError('Error: ' + err.message)
          setLoading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Error: ' + err.message)
      setLoading(false)
    }
  }

  const descargarExcel = () => {
    if (!factura) return

    const datos = [
      ['DATOS DE FACTURA'],
      ['Proveedor', factura.proveedor],
      ['CUIT', factura.cuit],
      ['Número Factura', factura.numeroFactura],
      ['Fecha', factura.fechaFactura],
      ['Tipo Comprobante', factura.tipoComprobante],
      [''],
      ['ITEMS'],
      ['Código', 'Descripción', 'Cantidad', 'P. Unitario', 'Subtotal']
    ]

    factura.items?.forEach(item => {
      datos.push([
        item.codigo,
        item.descripcion,
        item.cantidad,
        item.precioUnitario,
        item.subtotal
      ])
    })

    datos.push([''])
    datos.push(['Bonificación %', factura.bonificacionPorcentaje])
    datos.push(['Bonificación $', factura.bonificacionMonto])
    datos.push(['Subtotal Neto', factura.subtotalNeto])
    datos.push(['IVA %', factura.ivaPorcentaje])
    datos.push(['IVA $', factura.ivaMonto])
    datos.push(['Otros Impuestos', factura.otrosImpuestos])
    datos.push(['TOTAL', factura.total])

    const ws = XLSX.utils.aoa_to_sheet(datos)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Factura')

    XLSX.writeFile(wb, `Factura_${factura.numeroFactura}.xlsx`)
  }

  const volver = () => {
    setFactura(null)
    setFile(null)
    setEditing(false)
  }

  if (!cliente) return <div>Cargando...</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>
          ← Volver
        </button>
        <h1>Procesar Factura</h1>
      </header>

      <main className={styles.main}>
        {!factura ? (
          <div className={styles.uploadSection}>
            <div className={styles.uploadBox}>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                id="fileInput"
                disabled={loading}
                className={styles.fileInput}
              />
              <label htmlFor="fileInput" className={styles.uploadLabel}>
                <div className={styles.uploadContent}>
                  <div className={styles.uploadIcon}>📄</div>
                  <h3>Cargá tu factura PDF</h3>
                  <p>{file ? file.name : 'Clickeá o arrastrá un PDF'}</p>
                </div>
              </label>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              onClick={procesarPDF}
              disabled={!file || loading}
              className={styles.processBtn}
            >
              {loading ? 'Procesando...' : 'Procesar Factura'}
            </button>
          </div>
        ) : (
          <div className={styles.resultSection}>
            <div className={styles.facturaData}>
              <div className={styles.section}>
                <h3>Datos de Factura</h3>
                <div className={styles.grid}>
                  <div>
                    <label>Proveedor</label>
                    <input type="text" value={factura.proveedor} readOnly />
                  </div>
                  <div>
                    <label>CUIT</label>
                    <input type="text" value={factura.cuit} readOnly />
                  </div>
                  <div>
                    <label>Número Factura</label>
                    <input type="text" value={factura.numeroFactura} readOnly />
                  </div>
                  <div>
                    <label>Fecha</label>
                    <input type="text" value={factura.fechaFactura} readOnly />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3>Items</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>P. Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factura.items?.map((item, i) => (
                      <tr key={i}>
                        <td>{item.codigo}</td>
                        <td>{item.descripcion}</td>
                        <td>{item.cantidad}</td>
                        <td>${item.precioUnitario.toFixed(2)}</td>
                        <td>${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.section}>
                <h3>Totales</h3>
                <div className={styles.totales}>
                  <div>Bonificación: {factura.bonificacionPorcentaje}% (${factura.bonificacionMonto?.toFixed(2)})</div>
                  <div>Subtotal Neto: ${factura.subtotalNeto?.toFixed(2)}</div>
                  <div>IVA: {factura.ivaPorcentaje}% (${factura.ivaMonto?.toFixed(2)})</div>
                  <div>Otros Impuestos: {factura.otrosImpuestos}</div>
                  <div className={styles.total}>TOTAL: ${factura.total?.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button onClick={descargarExcel} className={styles.downloadBtn}>
                📊 Descargar Excel
              </button>
              <button onClick={volver} className={styles.againBtn}>
                ➕ Procesar otra
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
