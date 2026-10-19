import { useState } from 'react'
import * as api from '../services/api'

export default function ProfileModal({ user, onClose, onLogout }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatNewPassword, setRepeatNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (newPassword !== repeatNewPassword) {
      setError('Новые пароли не совпадают!')
      return
    }

    try {
      // Отправляем запрос на обновление пароля по вашему эндпоинту
      await api.updatePassword({
        oldPassword,
        newPassword,
        repeatNewPassword,
      })
      setMessage('Пароль успешно изменен!')
      setOldPassword('')
      setNewPassword('')
      setRepeatNewPassword('')
    } catch (err) {
      console.error(err)
      setError('Ошибка при смене пароля. Проверьте старый пароль.')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
      <div
        style={{
          background: '#181818',
          padding: '30px',
          borderRadius: '12px',
          width: '400px',
          color: '#fff',
          position: 'relative',
        }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: '#aaa',
            fontSize: '18px',
            cursor: 'pointer',
          }}>
          ✕
        </button>

        <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>👤 Профиль пользователя</h2>

        <div style={{ marginBottom: '20px', background: '#222', padding: '12px', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '4px' }}>Имя / Логин:</p>
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{user.fullName || user.username || user.email}</p>

          <p style={{ fontSize: '14px', color: '#aaa', marginTop: '10px', marginBottom: '4px' }}>Email:</p>
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{user.email}</p>
        </div>

        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Изменить пароль</h3>

        {error && <p style={{ color: '#ff4d4d', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
        {message && <p style={{ color: '#4bb543', fontSize: '13px', marginBottom: '10px' }}>{message}</p>}

        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="password"
            placeholder="Старый пароль"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={{
              padding: '10px',
              background: '#1c1c1c',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '6px',
            }}
          />
          <input
            type="password"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              padding: '10px',
              background: '#1c1c1c',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '6px',
            }}
          />
          <input
            type="password"
            placeholder="Повторите новый пароль"
            value={repeatNewPassword}
            onChange={(e) => setRepeatNewPassword(e.target.value)}
            required
            style={{
              padding: '10px',
              background: '#1c1c1c',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '6px',
            }}
          />

          <button
            type="submit"
            style={{
              marginTop: '6px',
              padding: '10px',
              background: '#ffcc00',
              border: 'none',
              fontWeight: 'bold',
              borderRadius: '6px',
              cursor: 'pointer',
            }}>
            Обновить пароль
          </button>
        </form>

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '10px',
            background: '#ff4d4d',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
            borderRadius: '6px',
            cursor: 'pointer',
          }}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  )
}
