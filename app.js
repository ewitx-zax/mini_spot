// ==================== DATOS DE PLAYLISTS Y CANCIONES ====================
const playlistsData = [
  {
    id: "playlist_1",
    name: "🎧 Éxitos Globales",
    description: "Los hits más sonados del momento",
    coverIcon: "🌍",
    color: "#1DB954",
    tracks: [
      { id: "t1", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20", cover: "✨" },
      { id: "t2", title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer", duration: "3:20", cover: "🌸" },
      { id: "t3", title: "As It Was", artist: "Harry Styles", album: "Harry's House", duration: "2:47", cover: "🌟" },
      { id: "t4", title: "Dance The Night", artist: "Dua Lipa", album: "Barbie", duration: "2:56", cover: "💃" }
    ]
  },
  {
    id: "playlist_2",
    name: "🎸 Rock Alternativo",
    description: "Lo mejor del indie y rock moderno",
    coverIcon: "🤘",
    color: "#E25822",
    tracks: [
      { id: "t5", title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", duration: "4:32", cover: "🎸" },
      { id: "t6", title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", duration: "3:58", cover: "🌊" },
      { id: "t7", title: "Sex on Fire", artist: "Kings of Leon", album: "Only by the Night", duration: "3:23", cover: "🔥" },
      { id: "t8", title: "Mr. Brightside", artist: "The Killers", album: "Hot Fuss", duration: "3:42", cover: "🎭" }
    ]
  },
  {
    id: "playlist_3",
    name: "💃 Latin Vibes",
    description: "Reggaetón y ritmos latinos",
    coverIcon: "🇨🇴",
    color: "#FFB347",
    tracks: [
      { id: "t9", title: "Quevedo: BZRP Music Sessions #52", artist: "Bizarrap, Quevedo", album: "Sessions", duration: "3:18", cover: "🎤" },
      { id: "t10", title: "TQG", artist: "Karol G, Shakira", album: "Mañana Será Bonito", duration: "3:17", cover: "💋" },
      { id: "t11", title: "La Bachata", artist: "Manuel Turizo", album: "2000", duration: "2:42", cover: "🎵" },
      { id: "t12", title: "Monotonía", artist: "Shakira, Ozuna", album: "Single", duration: "2:38", cover: "🌙" }
    ]
  }
];

// Estado global
let currentPlaylist = null;
let currentTrackIndex = 0;
let isPlaying = false;
let shuffleMode = false;
let repeatMode = false;
let currentAudio = new Audio();
let currentQueue = [];

// Elementos DOM
const homeView = document.getElementById('homeView');
const playlistView = document.getElementById('playlistView');
const sidebarPlaylists = document.getElementById('sidebarPlaylists');
const featuredGrid = document.getElementById('featuredGrid');
const playlistsSection = document.getElementById('playlistsSection');
const heroCover = document.getElementById('heroCover');
const heroTitle = document.getElementById('heroTitle');
const heroDesc = document.getElementById('heroDesc');
const heroMeta = document.getElementById('heroMeta');
const trackTableBody = document.getElementById('trackTableBody');
const playPlaylistBtn = document.getElementById('playPlaylistBtn');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');
const nowCover = document.getElementById('nowCover');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressFill = document.getElementById('progressFill');
const progressTrack = document.getElementById('progressTrack');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');
const volumeFill = document.getElementById('volumeFill');
const volumeTrack = document.getElementById('volumeTrack');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const btnBack = document.getElementById('btnBack');
const btnForward = document.getElementById('btnForward');
const likeCurrentBtn = document.getElementById('likeCurrentBtn');

// ========== FUNCIONES AUXILIARES ==========
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function parseDuration(durStr) {
  const parts = durStr.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

// Cargar canción
function loadTrack(track, playlist) {
  if (!track) return;
  nowTitle.textContent = track.title;
  nowArtist.textContent = track.artist;
  nowCover.innerHTML = `<i class="fa-solid ${track.cover === '✨' ? 'fa-star' : track.cover === '🌸' ? 'fa-fan' : track.cover === '🌟' ? 'fa-star' : track.cover === '💃' ? 'fa-music' : track.cover === '🎸' ? 'fa-guitar' : track.cover === '🌊' ? 'fa-water' : track.cover === '🔥' ? 'fa-fire' : track.cover === '🎭' ? 'fa-mask' : track.cover === '🎤' ? 'fa-microphone' : track.cover === '💋' ? 'fa-heart' : track.cover === '🎵' ? 'fa-music' : 'fa-music'}"></i>`;
  
  // Simular audio con duración (para demo usamos un sonido silencioso o null, pero mostramos duración)
  // Como no tenemos archivos reales, creamos un audio dummy que no suena pero simula progreso
  if (currentAudio.src) {
    currentAudio.pause();
    currentAudio.src = '';
  }
  // Para demo: crear un audio con un archivo de prueba silencioso (mejor que nada)
  // Usamos un archivo MP3 corto de prueba de internet (opcional)
  // En un entorno real pondrías las URLs reales. Aquí simulamos con un track de ejemplo
  currentAudio.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${Math.floor(Math.random() * 4) + 1}.mp3`;
  // Nota: estos archivos pueden no existir todos, pero al menos algunos funcionan.
  // Para mejor UX, capturamos errores y seguimos con la interfaz.
  currentAudio.load();
  currentAudio.volume = parseFloat(volumeFill.style.width) / 100;
  
  currentAudio.addEventListener('loadedmetadata', () => {
    totalTimeSpan.textContent = formatTime(currentAudio.duration);
  });
  
  currentAudio.addEventListener('timeupdate', () => {
    if (currentAudio.duration) {
      const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
      progressFill.style.width = `${percent}%`;
      currentTimeSpan.textContent = formatTime(currentAudio.currentTime);
    }
  });
  
  currentAudio.addEventListener('ended', () => {
    if (repeatMode) {
      playTrackAtIndex(currentTrackIndex);
    } else {
      nextTrack();
    }
  });
}

function playTrack() {
  if (!currentQueue.length) return;
  currentAudio.play().catch(e => console.log("Error al reproducir:", e));
  isPlaying = true;
  playIcon.className = "fa-solid fa-pause";
}

function pauseTrack() {
  currentAudio.pause();
  isPlaying = false;
  playIcon.className = "fa-solid fa-play";
}

function playTrackAtIndex(index) {
  if (!currentQueue[index]) return;
  currentTrackIndex = index;
  const track = currentQueue[index];
  loadTrack(track, currentPlaylist);
  playTrack();
  highlightPlayingTrack();
}

function nextTrack() {
  if (!currentQueue.length) return;
  let nextIdx = currentTrackIndex + 1;
  if (nextIdx >= currentQueue.length) {
    if (repeatMode) nextIdx = 0;
    else return;
  }
  playTrackAtIndex(nextIdx);
}

function prevTrack() {
  if (!currentQueue.length) return;
  let prevIdx = currentTrackIndex - 1;
  if (prevIdx < 0) prevIdx = 0;
  playTrackAtIndex(prevIdx);
}

function buildQueue(playlist, shuffle = shuffleMode) {
  let tracks = [...playlist.tracks];
  if (shuffle) {
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
  }
  return tracks;
}

function setPlaylist(playlist, startIndex = 0, autoPlay = true) {
  currentPlaylist = playlist;
  currentQueue = buildQueue(playlist, shuffleMode);
  currentTrackIndex = Math.min(startIndex, currentQueue.length - 1);
  if (autoPlay && currentQueue.length) {
    playTrackAtIndex(currentTrackIndex);
  } else if (currentQueue.length) {
    loadTrack(currentQueue[currentTrackIndex], playlist);
  }
  renderPlaylistDetail(playlist);
  highlightPlayingTrack();
}

function renderPlaylistDetail(playlist) {
  heroCover.innerHTML = `<i class="fa-solid fa-music"></i>`;
  heroTitle.textContent = playlist.name;
  heroDesc.textContent = playlist.description;
  heroMeta.innerHTML = `<span>${playlist.tracks.length} canciones</span> • 2025`;
  
  trackTableBody.innerHTML = '';
  playlist.tracks.forEach((track, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td><div class="track-name-cell"><span class="track-name">${track.title}</span><span class="track-artist-sub">${track.artist}</span></div></td>
      <td>${track.album}</td>
      <td>${track.duration}</td>
    `;
    row.addEventListener('click', () => {
      setPlaylist(playlist, idx, true);
      showPlaylistView();
    });
    trackTableBody.appendChild(row);
  });
}

function highlightPlayingTrack() {
  const rows = trackTableBody.querySelectorAll('tr');
  rows.forEach((row, i) => {
    if (currentQueue.length && currentQueue[currentTrackIndex] && currentPlaylist) {
      const trackPlaying = currentQueue[currentTrackIndex];
      const trackInList = currentPlaylist.tracks[i];
      if (trackInList && trackPlaying.id === trackInList.id) {
        row.classList.add('playing');
      } else {
        row.classList.remove('playing');
      }
    } else {
      row.classList.remove('playing');
    }
  });
}

// Renderizar Home
function renderHome() {
  // Featured Grid
  featuredGrid.innerHTML = playlistsData.map(pl => `
    <div class="featured-card" data-playlist-id="${pl.id}">
      <div class="feat-thumb">${pl.coverIcon}</div>
      <div class="feat-name">${pl.name}</div>
      <button class="feat-play" data-playlist-id="${pl.id}"><i class="fa-solid fa-play"></i></button>
    </div>
  `).join('');
  
  document.querySelectorAll('.featured-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.feat-play')) return;
      const id = card.dataset.playlistId;
      const pl = playlistsData.find(p => p.id === id);
      if (pl) {
        setPlaylist(pl, 0, true);
        showPlaylistView();
      }
    });
    const playBtn = card.querySelector('.feat-play');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = playBtn.dataset.playlistId;
        const pl = playlistsData.find(p => p.id === id);
        if (pl) {
          setPlaylist(pl, 0, true);
          showPlaylistView();
        }
      });
    }
  });
  
  // Sección de playlists con cards
  playlistsSection.innerHTML = '';
  playlistsData.forEach(playlist => {
    const section = document.createElement('div');
    section.className = 'playlist-row';
    section.innerHTML = `
      <div class="playlist-row-title">
        <span>${playlist.name}</span>
        <a href="#" data-playlist="${playlist.id}">Ver todo</a>
      </div>
      <div class="cards-grid" id="grid-${playlist.id}"></div>
    `;
    playlistsSection.appendChild(section);
    
    const grid = document.getElementById(`grid-${playlist.id}`);
    playlist.tracks.slice(0, 4).forEach(track => {
      const card = document.createElement('div');
      card.className = 'track-card';
      card.innerHTML = `
        <div class="card-cover"><i class="fa-solid fa-music"></i></div>
        <div class="card-title">${track.title}</div>
        <div class="card-sub">${track.artist}</div>
        <button class="card-play"><i class="fa-solid fa-play"></i></button>
      `;
      card.addEventListener('click', () => {
        setPlaylist(playlist, playlist.tracks.indexOf(track), true);
        showPlaylistView();
      });
      const playCard = card.querySelector('.card-play');
      playCard.addEventListener('click', (e) => {
        e.stopPropagation();
        setPlaylist(playlist, playlist.tracks.indexOf(track), true);
        showPlaylistView();
      });
      grid.appendChild(card);
    });
  });
}

function renderSidebar() {
  sidebarPlaylists.innerHTML = '';
  playlistsData.forEach(pl => {
    const li = document.createElement('li');
    li.dataset.id = pl.id;
    li.innerHTML = `
      <div class="pl-thumb">${pl.coverIcon}</div>
      <div class="pl-info">
        <div class="pl-name">${pl.name}</div>
        <div class="pl-type">Lista</div>
      </div>
    `;
    li.addEventListener('click', () => {
      setPlaylist(pl, 0, true);
      showPlaylistView();
      document.querySelectorAll('.playlist-list li').forEach(l => l.classList.remove('active'));
      li.classList.add('active');
    });
    sidebarPlaylists.appendChild(li);
  });
}

function showPlaylistView() {
  homeView.classList.remove('active');
  playlistView.classList.add('active');
}

function showHomeView() {
  playlistView.classList.remove('active');
  homeView.classList.add('active');
}

// Navegación
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    if (section === 'home') showHomeView();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

btnBack.addEventListener('click', () => showHomeView());

// Controles
playPauseBtn.addEventListener('click', () => {
  if (!currentAudio.src) return;
  if (isPlaying) pauseTrack();
  else playTrack();
});

nextBtn.addEventListener('click', () => nextTrack());
prevBtn.addEventListener('click', () => prevTrack());

shuffleBtn.addEventListener('click', () => {
  shuffleMode = !shuffleMode;
  shuffleBtn.classList.toggle('active', shuffleMode);
  if (currentPlaylist) {
    const currentTrackObj = currentQueue[currentTrackIndex];
    currentQueue = buildQueue(currentPlaylist, shuffleMode);
    if (currentTrackObj) {
      const newIndex = currentQueue.findIndex(t => t.id === currentTrackObj.id);
      if (newIndex !== -1) currentTrackIndex = newIndex;
      else currentTrackIndex = 0;
    }
    playTrackAtIndex(currentTrackIndex);
  }
});

repeatBtn.addEventListener('click', () => {
  repeatMode = !repeatMode;
  repeatBtn.classList.toggle('active', repeatMode);
});

progressTrack.addEventListener('click', (e) => {
  if (!currentAudio.duration) return;
  const rect = progressTrack.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  currentAudio.currentTime = percent * currentAudio.duration;
});

volumeTrack.addEventListener('click', (e) => {
  const rect = volumeTrack.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.min(1, Math.max(0, percent));
  volumeFill.style.width = `${percent * 100}%`;
  currentAudio.volume = percent;
  updateVolumeIcon(percent);
});

function updateVolumeIcon(vol) {
  if (vol === 0) volumeIcon.className = 'fa-solid fa-volume-off';
  else if (vol < 0.5) volumeIcon.className = 'fa-solid fa-volume-down';
  else volumeIcon.className = 'fa-solid fa-volume-high';
}

volumeBtn.addEventListener('click', () => {
  const newVol = currentAudio.volume > 0 ? 0 : 0.7;
  currentAudio.volume = newVol;
  volumeFill.style.width = `${newVol * 100}%`;
  updateVolumeIcon(newVol);
});

playPlaylistBtn.addEventListener('click', () => {
  if (currentPlaylist) setPlaylist(currentPlaylist, 0, true);
});

likeCurrentBtn.addEventListener('click', () => {
  alert('⭐ Canción guardada en Tus Me Gusta (demo)');
});

// Inicializar
renderHome();
renderSidebar();
currentAudio.volume = 0.7;
volumeFill.style.width = '70%';