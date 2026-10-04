import { useState, useEffect, useRef } from 'react'
import * as api from './services/api'
import Sidebar from './components/Sidebar'
import TrackForm from './components/TrackForm'
import PlayerBar from './components/PlayerBar'
import './App.css'

export default function App() {
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')

  // Состояния для плеера
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)

  const audioRef = useRef(null)

  const loadData = async () => {
    try {
      const tracksData = await api.fetchTracks()
      const artistsData = await api.fetchArtists()
      setTracks(Array.isArray(tracksData) ? tracksData : [])
      setArtists(Array.isArray(artistsData) ? artistsData : [])
    } catch (e) {
      console.error('Ошибка загрузки данных:', e)
    }
  }

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const tracksData = await api.fetchTracks()
        const artistsData = await api.fetchArtists()
        if (isMounted) {
          setTracks(Array.isArray(tracksData) ? tracksData : [])
          setArtists(Array.isArray(artistsData) ? artistsData : [])
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

  // Управление аудио-объектом
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (value) => {
    setCurrentTime(value)
    if (audioRef.current) {
      audioRef.current.currentTime = value
    }
  }

  const handlePlay = (track) => {
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
  }
  // Переход к следующему треку
  const handleNext = () => {
    if (tracks.length === 0) return
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id)
    const nextIndex = (currentIndex + 1) % tracks.length
    handlePlay(tracks[nextIndex])
  }

  // Переход к предыдущему треку
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

  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artistName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="ym-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} artistsCount={artists.length} />

      <main className="ym-main">
        {/* Верхняя панель поиска как в Яндекс Музыке */}
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
                  <p>Слушайте любимые треки, добавляйте новые композиции через удобную форму снизу.</p>
                </div>
              </section>

              <TrackForm onTrackAdded={handleAddTrack} />

              <div className="ym-section-block">
                <h2>Новые треки</h2>
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
