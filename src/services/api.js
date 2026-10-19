const API_URL = 'http://localhost:9999'

// Хранилище для учетных данных сеанса
let authCredentials = { email: '', password: '' }

export const setAuthCredentials = (email, password) => {
  authCredentials = { email, password }
  localStorage.setItem('yandex_music_creds', JSON.stringify({ email, password }))
}

export const clearAuthCredentials = () => {
  authCredentials = { email: '', password: '' }
  localStorage.removeItem('yandex_music_creds')
  localStorage.removeItem('yandex_music_user')
}
export const initAuthFromStorage = () => {
  const savedUser = localStorage.getItem('yandex_music_user')
  const savedCreds = localStorage.getItem('yandex_music_creds')
  if (savedUser && savedCreds) {
    try {
      authCredentials = JSON.parse(savedCreds)
    } catch (e) {
      console.error(e)
    }
  }
}
// Функция для генерации заголовков с Basic Auth
const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' }
  if (authCredentials.email && authCredentials.password) {
    const base64Credentials = btoa(`${authCredentials.email}:${authCredentials.password}`)
    headers['Authorization'] = `Basic ${base64Credentials}`
  }
  return headers
}

// Безопасный парсер JSON
async function parseJSON(res) {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : []
  } catch {
    console.warn('Ответ сервера не является валидным JSON:', text)
    return []
  }
}

// === Треки ===
export const fetchTracks = async () => {
  const res = await fetch(`${API_URL}/track`, { headers: getAuthHeaders() })
  return parseJSON(res)
}

export const fetchPopularTracks = async () => {
  const res = await fetch(`${API_URL}/track/popular`, { headers: getAuthHeaders() })
  return parseJSON(res)
}

export const fetchTracksByArtist = async (artistId) => {
  const res = await fetch(`${API_URL}/track/artist/${artistId}`, { headers: getAuthHeaders() })
  return parseJSON(res)
}

export const playTrack = async (id) => {
  const res = await fetch(`${API_URL}/track/${id}/play`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  return parseJSON(res)
}

export const createTrack = async (trackData) => {
  const res = await fetch(`${API_URL}/track/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(trackData),
  })
  return res
}

export const deleteTrack = async (id) => {
  const res = await fetch(`${API_URL}/track/delete/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return res
}

// === Артисты ===
export const fetchArtists = async () => {
  const res = await fetch(`${API_URL}/artist`, { headers: getAuthHeaders() })
  return parseJSON(res)
}

export const createArtist = async (artistData) => {
  const res = await fetch(`${API_URL}/artist/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(artistData),
  })
  return res
}
export const updateArtist = async (id, artistData) => {
  const res = await fetch(`${API_URL}/artist/update/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(artistData),
  })
  return res
}
export const deleteArtist = async (id) => {
  const res = await fetch(`${API_URL}/artist/delete/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return res
}

// === Жанры ===
export const fetchGenres = async () => {
  const res = await fetch(`${API_URL}/genre`, { headers: getAuthHeaders() })
  return parseJSON(res)
}

export const createGenre = async (genreData) => {
  const res = await fetch(`${API_URL}/genre/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(genreData),
  })
  return res
}
export const deleteGenre = async (id) => {
  const res = await fetch(`${API_URL}/genre/delete/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return res
}
export const updateGenre = async (id, genreData) => {
  const res = await fetch(`${API_URL}/genre/update/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(genreData),
  })
  return res
}
// === Auth ===
export const signupUser = async (signupData) => {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signupData),
  })
  return res
}

export const signinUser = async (credentials) => {
  const res = await fetch(`${API_URL}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  return res
}

export const fetchUserProfile = async () => {
  const res = await fetch(`${API_URL}/api/auth/profile`, { headers: getAuthHeaders() })
  return parseJSON(res)
}

// ДОБАВЬТЕ ЭТУ ФУНКЦИЮ СЮДА:
export const updatePassword = async (passwordData) => {
  const res = await fetch(`${API_URL}/api/auth/update-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || 'Не удалось обновить пароль')
  }

  return res
}
