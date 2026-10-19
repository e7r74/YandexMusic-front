export default function Sidebar({ activeTab, setActiveTab, artistsCount, user }) {
  // Перевіряємо ролі безпечно: підтримуємо як масив рядків, так і масив об'єктів
  const isAdmin = user?.permissions?.some((p) =>
    typeof p === 'string' ? p === 'ROLE_ADMIN' : p?.permission === 'ROLE_ADMIN',
  )

  const isArtist = user?.permissions?.some((p) =>
    typeof p === 'string' ? p === 'ROLE_ARTIST' : p?.permission === 'ROLE_ARTIST',
  )

  return (
    <aside className="ym-sidebar">
      {/* Твій логотип та інші вкладки */}

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
        {/* Показуємо адмін-панель тільки для ROLE_ADMIN */}
        {isAdmin && (
          <button
            className={`ym-nav-link ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            style={{ color: '#ffcc00' }}>
            <span className="ym-icon">⚙️</span> Админ-панель
          </button>
        )}
        {/* За бажанням можна додати вкладку додавання треків тільки для ROLE_ARTIST */}
        {isArtist && (
          <button
            className={`ym-nav-link ${activeTab === 'add-track' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-track')}>
            <span className="ym-icon">🎙️</span> Добавить трек
          </button>
        )}
      </nav>
    </aside>
  )
}
