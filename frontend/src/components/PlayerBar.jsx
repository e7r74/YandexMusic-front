export default function PlayerBar({
  currentTrack,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  onNext,
  onPrev,
}) {
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <footer className="ym-player">
      <div className="ym-player-left">
        {currentTrack ? (
          <div className="ym-player-track-info">
            <div className="ym-mini-cover">🎵</div>
            <div className="ym-mini-text">
              <div className="player-title">{currentTrack.title}</div>
              <div className="player-artist">{currentTrack.artistName}</div>
            </div>
            <button className="ym-like-btn">♡</button>
          </div>
        ) : (
          <span className="player-placeholder">Трек не выбран</span>
        )}
      </div>

      <div className="ym-player-center">
        <div className="ym-player-controls">
          <button className="ym-ctrl-small">🔀</button>
          {/* Вот здесь исправлено: вызываем onPrev */}
          <button className="ym-ctrl-small" onClick={onPrev}>
            ⏮
          </button>
          <button className="ym-control-btn" onClick={onTogglePlay} disabled={!currentTrack}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          {/* Вот здесь вызываем onNext */}
          <button className="ym-ctrl-small" onClick={onNext}>
            ⏭
          </button>
          <button className="ym-ctrl-small">🔁</button>
        </div>
        <div className="ym-progress-container">
          <span className="ym-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="ym-progress-bar"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
          />
          <span className="ym-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="ym-player-right">
        <span className="ym-vol-icon">🔊</span>
        <input
          type="range"
          className="ym-volume-bar"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
        />
      </div>
    </footer>
  )
}
