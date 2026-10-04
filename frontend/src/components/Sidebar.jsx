export default function Sidebar({ activeTab, setActiveTab, artistsCount }) {
  return (
    <aside className="ym-sidebar">
      <div className="ym-logo-block">
        <span className="ym-logo-icon">🪩</span>
        <div className="ym-logo-texts">
          <span className="ym-logo-sub">Yandex</span>
          <h2 className="ym-logo">Music</h2>
        </div>
      </div>
      <nav className="ym-nav">
        <button className={`ym-nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <span className="ym-icon">🏠</span> Главная
        </button>
        <button
          className={`ym-nav-link ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}>
          <span className="ym-icon">🎵</span> Моя коллекция ({artistsCount})
        </button>
        <button className={`ym-nav-link ${activeTab === 'wave' ? 'active' : ''}`} onClick={() => setActiveTab('wave')}>
          <span className="ym-icon">🌊</span> Моя волна
        </button>
      </nav>
    </aside>
  )
}
