import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '../styles/dashboard.module.css'

export default function Dashboard() {
  const [cliente, setCliente] = useState('')
  const [facturas, setFacturas] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('cliente')
    if (!stored) {
      router.push('/')
    } else {
      setCliente(stored)
      cargarHistorico(stored)
    }
  }, [router])

  const cargarHistorico = async (cli) => {
    try {
      // Aquí se cargarían las facturas desde el Sheet
      // Por ahora es un placeholder
      setFacturas([])
    } catch (error) {
      console.error('Error cargando histórico:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('cliente')
    router.push('/')
  }

  if (!cliente) return <div>Cargando...</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>FacturaProcessor</h1>
          <div className={styles.userInfo}>
            <span>{cliente}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.cardGrid}>
          <Link href="/procesar">
            <div className={styles.card}>
              <div className={styles.cardIcon}>📄</div>
              <h3>Procesar Nueva Factura</h3>
              <p>Cargá un PDF y procesalo automáticamente</p>
            </div>
          </Link>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📊</div>
            <h3>Histórico de Facturas</h3>
            <p>Total procesadas: {facturas.length}</p>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Últimas facturas procesadas</h2>
          {facturas.length === 0 ? (
            <p className={styles.emptyState}>No hay facturas procesadas aún</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Número</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((f, i) => (
                  <tr key={i}>
                    <td>{f.fecha}</td>
                    <td>{f.proveedor}</td>
                    <td>{f.numeroFactura}</td>
                    <td>${f.total}</td>
                    <td>{f.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  )
}
