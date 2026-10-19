import { useState } from 'react'
import * as api from '../services/api'

export default function ArtistPanel({ genres, artists, user, onTrackAdded }) {
  const [title, setTitle] = useState('')
  const [trackPhotoUrl, setTrackPhotoUrl] = useState('') // <-- Новое поле вместо длительности
  const [urlMusic, setUrlMusic] = useState('')
  const [selectedGenreIds, setSelectedGenreIds] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Проверяем, есть ли текущий залогиненный юзер в таблице артистов
  const currentArtist = artists.find((a) => a.user?.email === user?.email || a.userId === user?.id)

  // Если пользователя нет в таблице артистов, показываем блок с требованием подписки
  if (!currentArtist) {
    return (
      <div className="ym-section-block" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#ff4d4d', marginBottom: '16px' }}>🔒 Доступ ограничен</h2>
        <p style={{ color: '#ccc', fontSize: '15px', maxWidth: '400px', margin: '0 auto 20px' }}>
          Чтобы загружать треки и получить статус артиста, вам необходима платная подписка или подтверждение от
          администратора (запись в базе артистов).
        </p>
        <button
          onClick={() => alert('Перенаправление на страницу оплаты подписки...')}
          style={{
            padding: '12px 24px',
            background: '#ffcc00',
            color: '#000',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '6px',
            fontSize: '14px',
          }}>
          Купить подписку / Получить доступ
        </button>
      </div>
    )
  }

  const handleGenreToggle = (genreId) => {
    if (selectedGenreIds.includes(genreId)) {
      setSelectedGenreIds(selectedGenreIds.filter((id) => id !== genreId))
    } else {
      setSelectedGenreIds([...selectedGenreIds, genreId])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const trackData = {
        title,
        trackPhotoUrl, // Передаем ссылку на обложку трека
        urlMusic,
        genreIds: selectedGenreIds,
      }

      await api.createTrack(trackData)
      setSuccess('Трек успешно добавлен!')
      setTitle('')
      setTrackPhotoUrl('')
      setUrlMusic('')
      setSelectedGenreIds([])
      if (onTrackAdded) onTrackAdded()
    } catch (err) {
      console.error(err)
      setError('Ошибка при добавлении трека')
    }
  }

  return (
    <div className="ym-section-block" style={{ padding: '20px' }}>
      <h2>🎤 Панель Артиста ({currentArtist.artistName || currentArtist.name})</h2>
      <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
        Здесь вы можете загружать и публиковать свои треки.
      </p>

      {error && <p style={{ color: '#ff4d4d', marginBottom: '12px' }}>{error}</p>}
      {success && <p style={{ color: '#4bb543', marginBottom: '12px' }}>{success}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
        <input
          type="text"
          placeholder="Название трека"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            padding: '10px',
            background: '#1c1c1c',
            border: '1px solid #333',
            color: '#fff',
            borderRadius: '6px',
          }}
        />
        {/* Поле для ссылки на фото (обложку) трека */}
        <input
          type="text"
          placeholder="Ссылка на обложку трека (URL фото)"
          value={trackPhotoUrl}
          onChange={(e) => setTrackPhotoUrl(e.target.value)}
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
          placeholder="Ссылка на музыку (URL MP3)"
          value={urlMusic}
          onChange={(e) => setUrlMusic(e.target.value)}
          required
          style={{
            padding: '10px',
            background: '#1c1c1c',
            border: '1px solid #333',
            color: '#fff',
            borderRadius: '6px',
          }}
        />

        <div style={{ marginTop: '8px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#ccc' }}>
            Выберите жанры:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {genres.map((genre) => (
              <button
                type="button"
                key={genre.id}
                onClick={() => handleGenreToggle(genre.id)}
                style={{
                  background: selectedGenreIds.includes(genre.id) ? '#ffcc00' : '#1c1c1c',
                  color: selectedGenreIds.includes(genre.id) ? '#000' : '#fff',
                  border: '1px solid #333',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}>
                {genre.genreName}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '12px',
            padding: '12px',
            background: '#ffcc00',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '6px',
          }}>
          Добавить трек
        </button>
      </form>
    </div>
  )
}
