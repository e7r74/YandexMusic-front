const API_URL = 'http://localhost:9999'

// Артисты
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

// Треки
export const fetchTracks = async () => {
  const res = await fetch(`${API_URL}/track`)
  return res.json()
}

export const fetchTracksByArtist = async (artistId) => {
  const res = await fetch(`${API_URL}/track/artist/${artistId}`)
  return res.json()
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
