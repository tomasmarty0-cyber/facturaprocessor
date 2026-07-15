import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'

export default function Login() {
  const [cliente, setCliente] = useState('CLICK-FAST')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validación simple
    const credenciales = {
      'CLICK-FAST': 'clickfast2026',
      'MADEOFF': 'madeoff2026'
    }

    if (credenciales[cliente] === password) {
      localStorage.setItem('cliente', cliente)
      router.push('/dashboard')
    } else {
      setError('Credenciales inválidas')
    }

    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <h1>FacturaProcessor</h1>
          <p>Procesamiento inteligente de facturas</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="cliente">Cliente</label>
            <select
              id="cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className={styles.input}
            >
              <option value="CLICK-FAST">Click Fast</option>
              <option value="MADEOFF">Madeoff</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresá tu contraseña"
              className={styles.input}
              disabled={loading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>© 2026 EcomDataHub - FacturaProcessor</p>
        </div>
      </div>
    </div>
  )
}
