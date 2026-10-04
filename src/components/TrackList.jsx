export default function TrackList({ tracks, currentTrack, isPlaying, onPlay }) {
  return (
    <div className="ym-track-list">
      <h3>Треки</h3>
      {tracks.length === 0 ? (
        <p className="ym-empty">Треков пока нет. Добавьте первый!</p>
      ) : (
        tracks.map((track) => (
          <div key={track.id} className={`ym-track-item ${currentTrack?.id === track.id ? 'active' : ''}`}>
            <div className="ym-track-info" onClick={() => onPlay(track)}>
              <span className="ym-track-title">{track.title}</span>
              <span className="ym-track-artist">{track.artistName}</span>
            </div>
            <button className="ym-play-btn" onClick={() => onPlay(track)}>
              {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        ))
      )}
    </div>
  )
}
