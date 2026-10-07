const API_URL = 'http://localhost:9999'

// === Артисты ===
export const fetchArtists = async () => {
  const res = await fetch(`${API_URL}/artist`)
  return res.json()
}

export const fetchArtistById = async (id) => {
  const res = await fetch(`${API_URL}/artist/${id}`)
  return res.json()
}

export const createArtist = async (artistData) => {
  const res = await fetch(`${API_URL}/artist/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(artistData),
  })
  return res
}

export const updateArtist = async (id, artistData) => {
  const res = await fetch(`${API_URL}/artist/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(artistData),
  })
  return res
}

export const deleteArtist = async (id) => {
  const res = await fetch(`${API_URL}/artist/delete/${id}`, {
    method: 'DELETE',
  })
  return res
}

// === Треки ===
export const fetchTracks = async () => {
  const res = await fetch(`${API_URL}/track`)
  return res.json()
}

export const fetchPopularTracks = async () => {
  const res = await fetch(`${API_URL}/track/popular`)
  return res.json()
}

export const fetchTracksByArtist = async (artistId) => {
  const res = await fetch(`${API_URL}/track/artist/${artistId}`)
  return res.json()
}

export const playTrack = async (id) => {
  const res = await fetch(`${API_URL}/track/${id}/play`, {
    method: 'POST',
  })
  return res
}

export const createTrack = async (trackData) => {
  const res = await fetch(`${API_URL}/track/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trackData),
  })
  return res
}

export const deleteTrack = async (id) => {
  const res = await fetch(`${API_URL}/track/delete/${id}`, {
    method: 'DELETE',
  })
  return res
}

// === Жанры ===
export const fetchGenres = async () => {
  const res = await fetch(`${API_URL}/genre`)
  return res.json()
}

export const createGenre = async (genreData) => {
  const res = await fetch(`${API_URL}/genre/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(genreData),
  })
  return res
}

export const updateGenre = async (id, genreData) => {
  const res = await fetch(`${API_URL}/genre/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(genreData),
  })
  return res
}

export const deleteGenre = async (id) => {
  const res = await fetch(`${API_URL}/genre/delete/${id}`, {
    method: 'DELETE',
  })
  return res
}
