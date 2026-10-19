import { useState } from 'react'

export default function TrackForm({ onTrackAdded }) {
  const [newTitle, setNewTitle] = useState('')
  const [newTrackPhotoUrl, setNewTrackPhotoUrl] = useState('') // <-- Новое поле
  const [newUrl, setNewUrl] = useState('')
  const [newArtistId, setNewArtistId] = useState('')
  const [newArtistName, setNewArtistName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onTrackAdded({
      id: 0,
      title: newTitle,
      trackPhotoUrl: newTrackPhotoUrl, // <-- Передаем URL фото обложки
      urlMusic: newUrl,
      artistId: Number(newArtistId),
      artistName: newArtistName,
    })
    setNewTitle('')
    setNewTrackPhotoUrl('')
    setNewUrl('')
    setNewArtistId('')
    setNewArtistName('')
  }

  return (
    <div className="ym-form-card">
      <h3>Добавить трек</h3>
      <form onSubmit={handleSubmit} className="ym-form">
        <input
          type="text"
          placeholder="Название трека"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ссылка на обложку трека (URL фото)"
          value={newTrackPhotoUrl}
          onChange={(e) => setNewTrackPhotoUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ссылка на музыку (URL MP3)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="ID артиста"
          value={newArtistId}
          onChange={(e) => setNewArtistId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Имя артиста"
          value={newArtistName}
          onChange={(e) => setNewArtistName(e.target.value)}
          required
        />
        <button type="submit" className="ym-btn-primary">
          Добавить
        </button>
      </form>
    </div>
  )
}
