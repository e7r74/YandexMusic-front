import { useState } from 'react'
import * as api from '../services/api'

export default function AdminPanel({ artists, genres, onDataChanged }) {
  // Состояния для добавления артиста
  const [artistName, setArtistName] = useState('')
  const [artistPhotoUrl, setArtistPhotoUrl] = useState('')
  const [userId, setUserId] = useState('')

  // Состояния для добавления жанра
  const [genreName, setGenreName] = useState('')

  // Состояния для редактирования
  const [editingArtistId, setEditingArtistId] = useState(null)
  const [editArtistName, setEditArtistName] = useState('')
  const [editArtistPhotoUrl, setEditArtistPhotoUrl] = useState('')
  const [editUserId, setEditUserId] = useState('')

  const [editingGenreId, setEditingGenreId] = useState(null)
  const [editGenreName, setEditGenreName] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // === Добавление артиста ===
  const handleCreateArtist = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res = await api.createArtist({
        artistName,
        artistPhotoUrl,
        userId: Number(userId),
      })
      if (res.ok) {
        setMessage('Артист успешно добавлен!')
        setArtistName('')
        setArtistPhotoUrl('')
        setUserId('')
        if (onDataChanged) onDataChanged()
      } else {
        setError('Ошибка при добавлении артиста')
      }
    } catch (err) {
      console.error(err)
      setError('Ошибка сети при добавлении артиста')
    }
  }

  // === Добавление жанра ===
  const handleCreateGenre = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res = await api.createGenre({ genreName })
      if (res.ok) {
        setMessage('Жанр успешно добавлен!')
        setGenreName('')
        if (onDataChanged) onDataChanged()
      } else {
        setError('Ошибка при добавлении жанра')
      }
    } catch (err) {
      console.error(err)
      setError('Ошибка сети при добавлении жанра')
    }
  }

  // === Удаление артиста ===
  const handleDeleteArtist = async (id) => {
    if (!window.confirm('Удалить этого артиста?')) return
    try {
      const res = await api.deleteArtist(id)
      if (res.ok) {
        if (onDataChanged) onDataChanged()
      } else {
        alert('Не удалось удалить артиста (возможно, к нему привязаны треки).')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // === Удаление жанра ===
  const handleDeleteGenre = async (id) => {
    if (!window.confirm('Удалить этот жанр?')) return
    try {
      const res = await api.deleteGenre(id)
      if (res.ok) {
        if (onDataChanged) onDataChanged()
      } else {
        alert('Не удалось удалить жанр.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // === Начало редактирования артиста ===
  const startEditArtist = (artist) => {
    setEditingArtistId(artist.id)
    setEditArtistName(artist.artistName || artist.name || '')
    setEditArtistPhotoUrl(artist.artistPhotoUrl || artist.photoUrl || '')
    setEditUserId(artist.userId || '')
  }

  // === Сохранение отредактированного артиста ===
  const handleUpdateArtist = async (id) => {
    try {
      const res = await api.updateArtist(id, {
        id,
        artistName: editArtistName,
        artistPhotoUrl: editArtistPhotoUrl,
        userId: Number(editUserId),
      })
      if (res.ok) {
        setEditingArtistId(null)
        if (onDataChanged) onDataChanged()
      } else {
        alert('Ошибка при обновлении артиста')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // === Начало редактирования жанра ===
  const startEditGenre = (genre) => {
    setEditingGenreId(genre.id)
    setEditGenreName(genre.genreName)
  }

  // === Сохранение отредактированного жанра ===
  const handleUpdateGenre = async (id) => {
    try {
      const res = await api.updateGenre(id, {
        id,
        genreName: editGenreName,
      })
      if (res.ok) {
        setEditingGenreId(null)
        if (onDataChanged) onDataChanged()
      } else {
        alert('Ошибка при обновлении жанра')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="ym-section-block" style={{ padding: '20px' }}>
      <h2>⚙️ Панель Администратора</h2>

      {error && <p style={{ color: '#ff4d4d', marginBottom: '12px' }}>{error}</p>}
      {message && <p style={{ color: '#4bb543', marginBottom: '12px' }}>{message}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
        {/* Секция Артистов */}
        <div style={{ background: '#181818', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '15px' }}>Добавить артиста</h3>
          <form onSubmit={handleCreateArtist} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Имя артиста"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
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
              type="text"
              placeholder="Ссылка на фото (URL)"
              value={artistPhotoUrl}
              onChange={(e) => setArtistPhotoUrl(e.target.value)}
              style={{
                padding: '10px',
                background: '#1c1c1c',
                border: '1px solid #333',
                color: '#fff',
                borderRadius: '6px',
              }}
            />
            <input
              type="number"
              placeholder="User ID (например, 1)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
                padding: '10px',
                background: '#ffcc00',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '6px',
                cursor: 'pointer',
              }}>
              Добавить артиста
            </button>
          </form>

          <h3 style={{ marginTop: '25px', marginBottom: '15px' }}>Список артистов:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {artists.map((artist) => (
              <div
                key={artist.id}
                style={{
                  background: '#222',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {editingArtistId === artist.id ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      width: '100%',
                      marginRight: '10px',
                    }}>
                    <input
                      type="text"
                      value={editArtistName}
                      onChange={(e) => setEditArtistName(e.target.value)}
                      style={{
                        padding: '6px',
                        background: '#111',
                        border: '1px solid #444',
                        color: '#fff',
                        borderRadius: '4px',
                      }}
                    />
                    <input
                      type="text"
                      value={editArtistPhotoUrl}
                      onChange={(e) => setEditArtistPhotoUrl(e.target.value)}
                      placeholder="URL фото"
                      style={{
                        padding: '6px',
                        background: '#111',
                        border: '1px solid #444',
                        color: '#fff',
                        borderRadius: '4px',
                      }}
                    />
                    <input
                      type="number"
                      value={editUserId}
                      onChange={(e) => setEditUserId(e.target.value)}
                      placeholder="User ID"
                      style={{
                        padding: '6px',
                        background: '#111',
                        border: '1px solid #444',
                        color: '#fff',
                        borderRadius: '4px',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleUpdateArtist(artist.id)}
                        style={{
                          padding: '4px 10px',
                          background: '#4bb543',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}>
                        Сохранить
                      </button>
                      <button
                        onClick={() => setEditingArtistId(null)}
                        style={{
                          padding: '4px 10px',
                          background: '#555',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span>
                      {artist.artistName || artist.name} (ID: {artist.id})
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => startEditArtist(artist)}
                        style={{
                          padding: '5px 10px',
                          background: '#357ded',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}>
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDeleteArtist(artist.id)}
                        style={{
                          padding: '5px 10px',
                          background: '#ff4d4d',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}>
                        Удалить
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Секция Жанров */}
        <div style={{ background: '#181818', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '15px' }}>Добавить жанр</h3>
          <form onSubmit={handleCreateGenre} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Название жанра"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
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
                padding: '10px',
                background: '#ffcc00',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '6px',
                cursor: 'pointer',
              }}>
              Добавить жанр
            </button>
          </form>

          <h3 style={{ marginTop: '25px', marginBottom: '15px' }}>Список жанров:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {genres.map((genre) => (
              <div
                key={genre.id}
                style={{
                  background: '#222',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {editingGenreId === genre.id ? (
                  <div style={{ display: 'flex', gap: '6px', width: '100%', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={editGenreName}
                      onChange={(e) => setEditGenreName(e.target.value)}
                      style={{
                        padding: '6px',
                        background: '#111',
                        border: '1px solid #444',
                        color: '#fff',
                        borderRadius: '4px',
                        flex: 1,
                      }}
                    />
                    <button
                      onClick={() => handleUpdateGenre(genre.id)}
                      style={{
                        padding: '6px 10px',
                        background: '#4bb543',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}>
                      OK
                    </button>
                    <button
                      onClick={() => setEditingGenreId(null)}
                      style={{
                        padding: '6px 10px',
                        background: '#555',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{genre.genreName}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => startEditGenre(genre)}
                        style={{
                          padding: '5px 10px',
                          background: '#357ded',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}>
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDeleteGenre(genre.id)}
                        style={{
                          padding: '5px 10px',
                          background: '#ff4d4d',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}>
                        Удалить
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
