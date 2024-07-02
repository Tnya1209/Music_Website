



const songItems = document.querySelectorAll('.songItem');
const playButtons = document.querySelectorAll('.play-btn, .bi-play-circle-fill');
const masterPlay = document.getElementById('masterPlay');
const posterMasterPlay = document.getElementById('poster_master_play');
const title = document.getElementById('title');
const seekBar = document.getElementById('seek');
const currentStart = document.getElementById('currentStart');
const currentEnd = document.getElementById('currentEnd');
const audioElements = document.querySelectorAll('audio');
const vol = document.getElementById('vol');
const volIcon = document.getElementById('vol_icon');

// Helper function to format time
const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) seconds = '0' + seconds;
    return `${minutes}:${seconds}`;
};

// Play song
const playSong = (audioElement, songItem) => {
    audioElements.forEach(audio => audio.pause());
    playButtons.forEach(btn => btn.classList.remove('bi-pause-circle-fill'));
    playButtons.forEach(btn => btn.classList.add('bi-play-circle-fill'));

    audioElement.currentTime = 0;
    audioElement.play();

    posterMasterPlay.src = songItem.querySelector('img').src;
    title.innerHTML = songItem.querySelector('h5').innerHTML;

    masterPlay.classList.remove('bi-play-fill');
    masterPlay.classList.add('bi-pause-fill');

    seekBar.max = audioElement.duration;
    seekBar.value = 0;
    currentEnd.innerHTML = formatTime(audioElement.duration);

    const playBtn = songItem.querySelector('.play-btn');
    playBtn.classList.remove('bi-play-circle-fill');
    playBtn.classList.add('bi-pause-circle-fill');
};
// Toggle play/pause for a song
const togglePlayPause = (audioElement, songItem) => {
    const playBtn = songItem.querySelector('.play-btn');

    if (audioElement.paused) {
        playSong(audioElement, songItem);
    } else {
        audioElement.pause();
        playBtn.classList.remove('bi-pause-circle-fill');
        playBtn.classList.add('bi-play-circle-fill');
        masterPlay.classList.remove('bi-pause-fill');
        masterPlay.classList.add('bi-play-fill');
    }
};
// Handle play button click
playButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const songItem = button.closest('.songItem');
        const audioElement = songItem.querySelector('audio');

        togglePlayPause(audioElement, songItem);
    });
});

// Update seek bar and current time
audioElements.forEach(audioElement => {
    audioElement.addEventListener('timeupdate', () => {
        seekBar.value = audioElement.currentTime;
        currentStart.innerHTML = formatTime(audioElement.currentTime);
    });
});
// Handle master play button
masterPlay.addEventListener('click', () => {
    const playingAudio = Array.from(audioElements).find(audio => !audio.paused);
    if (playingAudio) {
        if (playingAudio.paused) {
            playingAudio.play();
            masterPlay.classList.remove('bi-play-fill');
            masterPlay.classList.add('bi-pause-fill');
        } else {
            playingAudio.pause();
            masterPlay.classList.remove('bi-pause-fill');
            masterPlay.classList.add('bi-play-fill');
        }
    } else {
        // If no song is playing, start playing the first song
        if (songItems.length > 0) {
            const firstSong = songItems[0];
            const firstAudio = firstSong.querySelector('audio');
            playSong(firstAudio, firstSong);
        }
    }
});
// Handle seek bar input
seekBar.addEventListener('input', () => {
    const playingAudio = Array.from(audioElements).find(audio => !audio.paused);
    if (playingAudio) {
        playingAudio.currentTime = seekBar.value;
    }
});

// Handle volume control
vol.addEventListener('input', () => {
    const volume = vol.value / 100;
    audioElements.forEach(audio => audio.volume = volume);
    volIcon.className = volume === 0 ? 'bi bi-volume-mute-fill' : 'bi bi-volume-down-fill';
});