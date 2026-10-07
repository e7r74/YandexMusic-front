import { useState, useEffect, useRef } from 'react'
import * as api from './services/api'
import Sidebar from './components/Sidebar'
import TrackForm from './components/TrackForm'
import PlayerBar from './components/PlayerBar'
import './App.css'

export default function App() {
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [popularTracks, setPopularTracks] = useState([])
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenreId, setSelectedGenreId] = useState('all')

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

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
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
    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

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

  const handleAddTrack = async (trackData) => {
    try {
      await api.createTrack(trackData)
      loadData()
    } catch (err) {
      console.error('Не удалось добавить трек', err)
    }
  }

  const filteredTracks = tracks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artistName.toLowerCase().includes(searchQuery.toLowerCase())

    // Проверяем, выбран ли "Все жанры", либо содержится ли выбранный ID в массиве genreIds трека
    const matchesGenre =
      selectedGenreId === 'all' || (t.genreIds && t.genreIds.some((id) => String(id) === String(selectedGenreId)))

    return matchesSearch && matchesGenre
  })

  return (
    <div className="ym-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} artistsCount={artists.length} />

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
          <div className="ym-user-profile">
            <div className="ym-avatar">👤</div>
          </div>
        </header>

        <div className="ym-content-inner">
          {activeTab === 'home' && (
            <>
              <section className="ym-hero-banner">
                <div className="ym-hero-text">
                  <span>Лента обновлений</span>
                  <h1>Добро пожаловать в Яндекс Музыку</h1>
                  <p>Слушайте треки, выбирайте жанры и добавляйте композиции через форму.</p>
                </div>
              </section>

              <TrackForm genres={genres} artists={artists} onTrackAdded={handleAddTrack} />

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
                        <div className="ym-card-cover">
                          <span>🎵</span>
                          <button className="ym-card-play-btn">
                            {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                          </button>
                        </div>
                        <div className="ym-card-title">{track.title}</div>
                        <div className="ym-card-artist">{track.artistName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Фильтр по жанрам с бэкенда */}
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
                      <div className="ym-card-cover">
                        <span>🎵</span>
                        <button className="ym-card-play-btn">
                          {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                        </button>
                      </div>
                      <div className="ym-card-title">{track.title}</div>
                      <div className="ym-card-artist">{track.artistName}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'collection' && (
            <div className="ym-section-block">
              <h2>Моя Коллекция Артистов</h2>
              <div className="ym-artists-grid">
                {artists.map((artist) => (
                  <div key={artist.id} className="ym-artist-card">
                    <div className="ym-artist-photo">🎤</div>
                    <div className="ym-artist-name">{artist.artistName}</div>
                  </div>
                ))}
              </div>
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
    </div>
  )
}
