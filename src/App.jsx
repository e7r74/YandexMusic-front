import { useState, useEffect, useRef } from 'react'
import * as api from './services/api'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import AuthModal from './components/AuthModal'
import AdminPanel from './components/AdminPanel'
import ArtistPanel from './components/ArtistPanel'
import ProfileModal from './components/ProfileModal'
import './App.css'

export default function App() {
  // В начале App.jsx при инициализации состояния user проверяем localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('yandex_music_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [popularTracks, setPopularTracks] = useState([])
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenreId, setSelectedGenreId] = useState('all')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  // Рядом с другими useState добавьте:
  const [selectedArtistTracks, setSelectedArtistTracks] = useState(null)
  const [artistTracksList, setArtistTracksList] = useState([])

  // Состояния плеера
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)

  const audioRef = useRef(null)

  const loadData = async () => {
    try {
      const [tracksData, artistsData, genresData, popularData] = await Promise.all([
        api.fetchTracks(),
        api.fetchArtists(),
        api.fetchGenres().catch(() => []),
        api.fetchPopularTracks().catch(() => []),
      ])

      setTracks(Array.isArray(tracksData) ? tracksData : [])
      setArtists(Array.isArray(artistsData) ? artistsData : [])
      setGenres(Array.isArray(genresData) ? genresData : [])
      setPopularTracks(Array.isArray(popularData) ? popularData : [])
    } catch (e) {
      console.error('Ошибка загрузки данных:', e)
    }
  }
  const savedCreds = localStorage.getItem('yandex_music_creds')
  if (savedCreds) {
    try {
      const { email, password } = JSON.parse(savedCreds)
      api.setAuthCredentials(email, password)
    } catch (e) {
      console.error(e)
    }
  }
  // Функция для загрузки профиля текущего пользователя из базы данных
  const loadUserProfile = async () => {
    try {
      const profile = await api.fetchUserProfile()
      if (profile) {
        setUser(profile)
        localStorage.setItem('yandex_music_user', JSON.stringify(profile))
      }
    } catch (e) {
      console.error('Не удалось загрузить профиль пользователя:', e)
    }
  }
  const currentArtist = artists.find(
    (a) =>
      a.user?.email === user?.email || a.userId === user?.id || a.artistName === user?.email || a.name === user?.email,
  )
  // Загружаем данные только после успешного входа пользователя
  useEffect(() => {
    let isMounted = true

    const fetchDataAfterLogin = async () => {
      if (!user) return
      try {
        const [tracksData, artistsData, genresData, popularData] = await Promise.all([
          api.fetchTracks(),
          api.fetchArtists(),
          api.fetchGenres().catch(() => []),
          api.fetchPopularTracks().catch(() => []),
        ])

        if (isMounted) {
          setTracks(Array.isArray(tracksData) ? tracksData : [])
          setArtists(Array.isArray(artistsData) ? artistsData : [])
          setGenres(Array.isArray(genresData) ? genresData : [])
          setPopularTracks(Array.isArray(popularData) ? popularData : [])
        }
      } catch (e) {
        console.error('Ошибка загрузки данных:', e)
      }
    }

    fetchDataAfterLogin()

    return () => {
      isMounted = false
    }
  }, [user])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  const handleSeek = (value) => {
    setCurrentTime(value)
    if (audioRef.current) audioRef.current.currentTime = value
  }

  const handlePlay = async (track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause()
      return
    }
    setCurrentTrack(track)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = track.urlMusic
      audioRef.current.play().catch((err) => console.log('Ошибка воспроизведения:', err))
    }

    // Фиксируем прослушивание на бэкенде
    try {
      await api.playTrack(track.id)
      const popularData = await api.fetchPopularTracks()
      setPopularTracks(Array.isArray(popularData) ? popularData : [])
    } catch (err) {
      console.error('Не удалось обновить статус play', err)
    }
  }

  const handleNext = () => {
    if (tracks.length === 0) return
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id)
    const nextIndex = (currentIndex + 1) % tracks.length
    handlePlay(tracks[nextIndex])
  }
  const handleArtistClick = async (artist) => {
    try {
      const tracks = await api.fetchTracksByArtist(artist.id)
      setArtistTracksList(tracks)
      setSelectedArtistTracks(artist)
    } catch (e) {
      console.error('Не удалось загрузить треки артиста:', e)
    }
  }
  const handlePrev = () => {
    if (tracks.length === 0) return
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id)
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length
    handlePlay(tracks[prevIndex])
  }

  const togglePlayPause = () => {
    if (!currentTrack && tracks.length > 0) {
      handlePlay(tracks[0])
      return
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Функция выхода из аккаунта
  const handleLogout = () => {
    api.clearAuthCredentials()
    localStorage.removeItem('yandex_music_user')
    setUser(null)
  }
  const filteredTracks = tracks.filter((t) => {
    const titleMatch = t.title ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) : false
    const artistName = t.artistName || t.artist?.name || ''
    const artistMatch = artistName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSearch = titleMatch || artistMatch

    const matchesGenre =
      selectedGenreId === 'all' || (t.genreIds && t.genreIds.some((id) => String(id) === String(selectedGenreId)))

    return matchesSearch && matchesGenre
  })

  // Если пользователь не вошел, показываем модальное окно авторизации
  if (!user) {
    return (
      <AuthModal
        onLoginSuccess={async () => {
          await loadUserProfile()
          await loadData()
        }}
      />
    )
  }

  return (
    <div className="ym-container">
      {/* Передаем user в Sidebar для проверки ролей */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} artistsCount={artists.length} user={user} />

      <main className="ym-main">
        <header className="ym-top-header">
          <div className="ym-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Треки, альбомы, исполнители"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="ym-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
                {currentArtist?.artistName || currentArtist?.name || user.fullName || user.username || user.email}
              </span>

              {/* Галочка верификации артиста */}
              {currentArtist && (
                <span
                  title="Подтвержденный артист"
                  style={{
                    background: '#357ded',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}>
                  ✓
                </span>
              )}
            </div>

            {/* Аватарка артиста из базы данных (проверяем все возможные ключи фото) */}
            <div
              className="ym-avatar"
              onClick={() => setIsProfileOpen(true)}
              title="Профиль"
              style={{
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #333',
              }}>
              {currentArtist?.photoUrl || currentArtist?.artistPhotoUrl || currentArtist?.imageUrl ? (
                <img
                  src={currentArtist.photoUrl || currentArtist.artistPhotoUrl || currentArtist.imageUrl}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '14px' }}>👤</span>
              )}
            </div>
          </div>
        </header>

        <div className="ym-content-inner">
          {/* Панель администратора */}
          {activeTab === 'admin' && <AdminPanel artists={artists} genres={genres} onDataChanged={loadData} />}

          {/* Панель артиста (проверяем наличие записи в t_artist внутри ArtistPanel) */}
          {(activeTab === 'add-track' || activeTab === 'artist-panel') && (
            <ArtistPanel genres={genres} artists={artists} user={user} onTrackAdded={loadData} />
          )}

          {activeTab === 'home' && (
            <>
              <section className="ym-hero-banner">
                <div className="ym-hero-text">
                  <span>Лента обновлений</span>
                  <h1>Добро пожаловать в Яндекс Музыку</h1>
                  <p>Слушайте треки, выбирайте жанры и наслаждайтесь музыкой.</p>
                </div>
              </section>

              {/* Популярные треки */}
              {popularTracks.length > 0 && (
                <div className="ym-section-block" style={{ marginBottom: '24px' }}>
                  <h2>🔥 Популярное</h2>
                  <div className="ym-tracks-grid">
                    {popularTracks.map((track) => (
                      <div
                        key={`pop-${track.id}`}
                        className={`ym-track-card ${currentTrack?.id === track.id ? 'active' : ''}`}
                        onClick={() => handlePlay(track)}>
                        <div
                          className="ym-card-cover"
                          style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '1/1',
                            overflow: 'hidden',
                            borderRadius: '8px',
                            background: '#222',
                          }}>
                          {track.trackPhotoUrl || track.artist?.photoUrl ? (
                            <img
                              src={track.trackPhotoUrl || track.artist?.photoUrl}
                              alt={track.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span
                              style={{
                                fontSize: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                              }}>
                              🎵
                            </span>
                          )}
                          <button className="ym-card-play-btn">
                            {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                          </button>
                        </div>
                        <div className="ym-card-title">{track.title}</div>
                        <div className="ym-card-artist">
                          {track.artistName || track.artist?.name}
                          {track.genreNames && track.genreNames.length > 0 ? ` • ${track.genreNames.join(', ')}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Фильтр по жанрам */}
              {genres.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '16px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                  }}>
                  <button
                    onClick={() => setSelectedGenreId('all')}
                    style={{
                      background: selectedGenreId === 'all' ? '#ffcc00' : '#1c1c1c',
                      color: selectedGenreId === 'all' ? '#000' : '#fff',
                      border: '1px solid #2a2a2a',
                      padding: '6px 14px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                    }}>
                    Все жанры
                  </button>
                  {genres.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGenreId(g.id.toString())}
                      style={{
                        background: selectedGenreId === g.id.toString() ? '#ffcc00' : '#1c1c1c',
                        color: selectedGenreId === g.id.toString() ? '#000' : '#fff',
                        border: '1px solid #2a2a2a',
                        padding: '6px 14px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}>
                      {g.genreName}
                    </button>
                  ))}
                </div>
              )}

              <div className="ym-section-block">
                <h2>Все треки</h2>
                <div className="ym-tracks-grid">
                  {filteredTracks.map((track) => (
                    <div
                      key={track.id}
                      className={`ym-track-card ${currentTrack?.id === track.id ? 'active' : ''}`}
                      onClick={() => handlePlay(track)}>
                      {/* --- НАЧАЛО ИСПРАВЛЕНИЯ (вставить этот блок) --- */}
                      <div
                        className="ym-card-cover"
                        style={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '1/1',
                          overflow: 'hidden',
                          borderRadius: '8px',
                          background: '#222',
                        }}>
                        {track.trackPhotoUrl || track.artist?.photoUrl ? (
                          <img
                            src={track.trackPhotoUrl || track.artist?.photoUrl}
                            alt={track.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                            }}>
                            🎵
                          </span>
                        )}
                        <button className="ym-card-play-btn">
                          {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                        </button>
                      </div>
                      {/* --- КОНЕЦ ИСПРАВЛЕНИЯ --- */}

                      <div className="ym-card-title">{track.title}</div>
                      <div className="ym-card-artist">
                        {track.artistName || track.artist?.name || track.artist?.artistName || 'Неизвестный артист'}
                        {track.genreNames && track.genreNames.length > 0 ? ` • ${track.genreNames.join(', ')}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeTab === 'collection' && (
            <div className="ym-section-block">
              {!selectedArtistTracks ? (
                <>
                  <h2>Моя коллекция</h2>
                  <div className="ym-tracks-grid">
                    {artists.map((artist) => (
                      <div
                        key={artist.id}
                        className="ym-track-card"
                        onClick={() => handleArtistClick(artist)}
                        style={{ cursor: 'pointer' }}>
                        <div
                          className="ym-card-cover"
                          style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '1/1',
                            overflow: 'hidden',
                            borderRadius: '8px',
                            background: '#222',
                          }}>
                          {artist.photoUrl || artist.artistPhotoUrl ? (
                            <img
                              src={artist.photoUrl || artist.artistPhotoUrl}
                              alt={artist.name || artist.artistName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span
                              style={{
                                fontSize: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                              }}>
                              🎙️
                            </span>
                          )}
                        </div>
                        <div className="ym-card-title">{artist.name || artist.artistName}</div>
                        <div className="ym-card-artist">Артист</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <button
                      onClick={() => setSelectedArtistTracks(null)}
                      style={{
                        padding: '6px 12px',
                        background: '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}>
                      ← Назад
                    </button>
                    <h2>Треки артиста: {selectedArtistTracks.name || selectedArtistTracks.artistName}</h2>
                  </div>

                  <div className="ym-tracks-grid">
                    {artistTracksList.length > 0 ? (
                      artistTracksList.map((track) => (
                        <div
                          key={track.id}
                          className={`ym-track-card ${currentTrack?.id === track.id ? 'active' : ''}`}
                          onClick={() => handlePlay(track)}>
                          <div
                            className="ym-card-cover"
                            style={{
                              position: 'relative',
                              width: '100%',
                              aspectRatio: '1/1',
                              overflow: 'hidden',
                              borderRadius: '8px',
                              background: '#222',
                            }}>
                            {track.trackPhotoUrl || selectedArtistTracks.photoUrl ? (
                              <img
                                src={track.trackPhotoUrl || selectedArtistTracks.photoUrl}
                                alt={track.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span
                                style={{
                                  fontSize: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                }}>
                                🎵
                              </span>
                            )}
                            <button className="ym-card-play-btn">
                              {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                            </button>
                          </div>
                          <div className="ym-card-title">{track.title}</div>
                          <div className="ym-card-artist">
                            {selectedArtistTracks.name || selectedArtistTracks.artistName}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: '#aaa' }}>У этого артиста пока нет треков.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 'wave' && (
            <div className="ym-wave-container">
              <div className="ym-wave-glow"></div>
              <h2>Моя волна 🌊</h2>
              <p>Персональный поток музыки под ваше настроение</p>
              {tracks.length > 0 && (
                <button className="ym-btn-primary ym-wave-btn" onClick={() => handlePlay(tracks[0])}>
                  Включить волну
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={togglePlayPause}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={setVolume}
        onNext={handleNext}
        onPrev={handlePrev}
      />
      {isProfileOpen && <ProfileModal user={user} onClose={() => setIsProfileOpen(false)} onLogout={handleLogout} />}
    </div>
  )
}
