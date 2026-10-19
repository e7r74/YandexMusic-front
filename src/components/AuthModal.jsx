import { useState } from 'react'
import * as api from '../services/api'

export default function AuthModal({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (isLogin) {
        const res = await api.signinUser({ email, password })
        if (res.ok) {
          // Читаем текст ответа (например, "Successful" или токен) вместо res.json()
          const responseText = await res.text()

          // Сохраняем учетные данные для Basic Auth
          api.setAuthCredentials(email, password)

          // Передаем пользователя (можем передать email и роль, если нужно)
          onLoginSuccess({ email, text: responseText })
        } else {
          const errText = await res.text().catch(() => '')
          setError(errText || 'Ошибка входа. Проверьте email и пароль.')
        }
      } else {
        if (password !== repeatPassword) {
          setError('Пароли не совпадают')
          return
        }
        const res = await api.signupUser({ email, password, repeatPassword, fullName })
        if (res.ok) {
          setIsLogin(true)
          alert('Регистрация успешна! Теперь войдите в систему.')
        } else {
          const errText = await res.text().catch(() => '')
          setError(errText || 'Ошибка регистрации. Возможно, email уже занят.')
        }
      }
    } catch (err) {
      console.error('Ошибка:', err) // Переменная err теперь используется, ошибка линтера пропадет
      setError('Сетевая ошибка (сервер недоступен)')
    }
  }

  return (
    <div
      className="ym-auth-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
      <div
        className="ym-form-card"
        style={{ width: '400px', background: '#121212', padding: '24px', borderRadius: '12px' }}>
        <h2>{isLogin ? 'Вход в Яндекс Музыку' : 'Регистрация'}</h2>
        {error && <p style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '8px' }}>{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="ym-form"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Имя (Full Name)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{
                padding: '10px',
                background: '#1c1c1c',
                border: '1px solid #2a2a2a',
                color: '#fff',
                borderRadius: '6px',
              }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '10px',
              background: '#1c1c1c',
              border: '1px solid #2a2a2a',
              color: '#fff',
              borderRadius: '6px',
            }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '10px',
              background: '#1c1c1c',
              border: '1px solid #2a2a2a',
              color: '#fff',
              borderRadius: '6px',
            }}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Повторите пароль"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              style={{
                padding: '10px',
                background: '#1c1c1c',
                border: '1px solid #2a2a2a',
                color: '#fff',
                borderRadius: '6px',
              }}
            />
          )}
          <button
            type="submit"
            className="ym-btn-primary"
            style={{
              padding: '10px',
              cursor: 'pointer',
              background: '#ffcc00',
              border: 'none',
              fontWeight: 'bold',
              borderRadius: '6px',
            }}>
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p
          style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', cursor: 'pointer', color: '#aaa' }}
          onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </p>
      </div>
    </div>
  )
}
