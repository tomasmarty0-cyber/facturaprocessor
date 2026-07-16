import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/procesar.module.css'
import * as XLSX from 'xlsx'

export default function Procesar() {
  const [cliente, setCliente] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [factura, setFactura] = useState({
    proveedor: '',
    cuit: '',
    numeroFactura: '',
    fechaFactura: '',
    tipoComprobante: 'Factura A',
    items: [{ codigo: '', descripcion: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }],
    bonificacionPorcentaje: 0,
    bonificacionMonto: 0,
    subtotalNeto: 0,
    ivaPorcentaje: 21,
    ivaMonto: 0,
    otrosImpuestos: '',
    total: 0
  })
  const [editando, setEditando] = useState(false)
  const router = useRouter()

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
    setEditando(true)
  }

  const handleCambio = (campo, valor) => {
    setFactura(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const handleItemCambio = (index, campo, valor) => {
    const nuevosItems = [...factura.items]
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor }
    
    if (campo === 'cantidad' || campo === 'precioUnitario') {
      nuevosItems[index].subtotal = parseFloat(nuevosItems[index].cantidad) * parseFloat(nuevosItems[index].precioUnitario)
    }
    
    setFactura(prev => ({
      ...prev,
      items: nuevosItems
    }))
  }

  const agregarItem = () => {
    setFactura(prev => ({
      ...prev,
      items: [...prev.items, { codigo: '', descripcion: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }]
    }))
  }

  const guardarFactura = async () => {
    if (!file) {
      setError('Cargá un PDF primero')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbx8UOTQViDzmigyJRfTPzwrtVVs1sc_ihGcA0KwEmYZRCoICES_9DNPXivEPweYMHF7Qw/exec', {
        method: 'POST',
        body: JSON.stringify({
          cliente: cliente,
          password: cliente === 'CLICK-FAST' ? 'clickfast2026' : 'madeoff2026',
          factura: factura,
          guardarDirecto: true
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Factura guardada correctamente')
        setEditando(false)
        setFile(null)
        setFactura({
          proveedor: '',
          cuit: '',
          numeroFactura: '',
          fechaFactura: '',
          tipoComprobante: 'Factura A',
          items: [{ codigo: '', descripcion: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }],
          bonificacionPorcentaje: 0,
          bonificacionMonto: 0,
          subtotalNeto: 0,
          ivaPorcentaje: 21,
          ivaMonto: 0,
          otrosImpuestos: '',
          total: 0
        })
      } else {
        setError(data.error || 'Error al guardar')
      }
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const descargarExcel = () => {
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

    XLSX.writeFile(wb, `Factura_${factura.numeroFactura || 'sin_numero'}.xlsx`)
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
        {!editando ? (
          <div className={styles.uploadSection}>
            <div className={styles.uploadBox}>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                id="fileInput"
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
          </div>
        ) : (
          <div className={styles.resultSection}>
            <div className={styles.facturaData}>
              <div className={styles.section}>
                <h3>Datos de Factura</h3>
                <div className={styles.grid}>
                  <div>
                    <label>Proveedor</label>
                    <input type="text" value={factura.proveedor} onChange={(e) => handleCambio('proveedor', e.target.value)} />
                  </div>
                  <div>
                    <label>CUIT</label>
                    <input type="text" value={factura.cuit} onChange={(e) => handleCambio('cuit', e.target.value)} />
                  </div>
                  <div>
                    <label>Número Factura</label>
                    <input type="text" value={factura.numeroFactura} onChange={(e) => handleCambio('numeroFactura', e.target.value)} />
                  </div>
                  <div>
                    <label>Fecha</label>
                    <input type="date" value={factura.fechaFactura} onChange={(e) => handleCambio('fechaFactura', e.target.value)} />
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
                        <td><input type="text" value={item.codigo} onChange={(e) => handleItemCambio(i, 'codigo', e.target.value)} style={{width: '60px'}} /></td>
                        <td><input type="text" value={item.descripcion} onChange={(e) => handleItemCambio(i, 'descripcion', e.target.value)} style={{width: '150px'}} /></td>
                        <td><input type="number" value={item.cantidad} onChange={(e) => handleItemCambio(i, 'cantidad', e.target.value)} style={{width: '60px'}} /></td>
                        <td><input type="number" value={item.precioUnitario} onChange={(e) => handleItemCambio(i, 'precioUnitario', e.target.value)} style={{width: '80px'}} /></td>
                        <td>${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={agregarItem} style={{marginTop: '10px', padding: '8px 16px'}}>+ Agregar item</button>
              </div>

              <div className={styles.section}>
                <h3>Totales</h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                  <div>
                    <label>Bonificación %</label>
                    <input type="number" value={factura.bonificacionPorcentaje} onChange={(e) => handleCambio('bonificacionPorcentaje', e.target.value)} />
                  </div>
                  <div>
                    <label>Bonificación $</label>
                    <input type="number" value={factura.bonificacionMonto} onChange={(e) => handleCambio('bonificacionMonto', e.target.value)} />
                  </div>
                  <div>
                    <label>Subtotal Neto</label>
                    <input type="number" value={factura.subtotalNeto} onChange={(e) => handleCambio('subtotalNeto', e.target.value)} />
                  </div>
                  <div>
                    <label>IVA %</label>
                    <input type="number" value={factura.ivaPorcentaje} onChange={(e) => handleCambio('ivaPorcentaje', e.target.value)} />
                  </div>
                  <div>
                    <label>IVA $</label>
                    <input type="number" value={factura.ivaMonto} onChange={(e) => handleCambio('ivaMonto', e.target.value)} />
                  </div>
                  <div>
                    <label>Total</label>
                    <input type="number" value={factura.total} onChange={(e) => handleCambio('total', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
              <button onClick={guardarFactura} disabled={loading} className={styles.downloadBtn}>
                {loading ? 'Guardando...' : '💾 Guardar en Sheets'}
              </button>
              <button onClick={descargarExcel} className={styles.downloadBtn}>
                📊 Descargar Excel
              </button>
              <button onClick={() => setEditando(false)} className={styles.againBtn}>
                ➕ Otra factura
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}