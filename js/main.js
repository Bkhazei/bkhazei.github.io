// Mobile navigation toggle
(function () {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("is-open");
    });
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
      });
    });
  }

  const tabs = document.querySelectorAll("[data-tab]");
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const target = tab.getAttribute("data-tab");
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        document.querySelectorAll("[data-events]").forEach(function (group) {
          group.hidden = group.getAttribute("data-events") !== target;
        });
      });
    });
  }

  const gallery = document.querySelector("[data-video-gallery]");
  if (gallery) {
    const VIDEO_START = 120; // 2 minutes

    const videos = [
      {
        id: "uiTScpRLHsc",
        title: "Vancouver Synth Meetup — DarkSide",
      },
      {
        id: "fs_NleAElhE",
        title: "Vancouver Synth Meetup — LightSpeed",
      },
      {
        id: "JC-tP_jYhdg",
        title: "LESS Events Series",
      },
    ];

    const embedEl = gallery.querySelector("[data-video-embed]");
    const videoTabs = gallery.querySelectorAll("[data-video-index]");
    const playBtn = gallery.querySelector("[data-video-play]");
    const progressEl = gallery.querySelector("[data-video-progress]");
    const timeEl = gallery.querySelector("[data-video-time]");
    const muteBtn = gallery.querySelector("[data-video-mute]");

    let player = null;
    let isMuted = true;
    let isPlaying = false;
    let isSeeking = false;
    let progressTimer = null;

    function formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return "0:00";
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return minutes + ":" + String(secs).padStart(2, "0");
    }

    function updateProgress() {
      if (!player || !player.getCurrentTime || isSeeking) return;

      const current = player.getCurrentTime();
      const duration = player.getDuration();
      if (!duration) return;

      if (progressEl) {
        progressEl.value = String(Math.round((current / duration) * 1000));
      }
      if (timeEl) {
        timeEl.textContent =
          formatTime(current) + " / " + formatTime(duration);
      }
    }

    function startProgressTimer() {
      stopProgressTimer();
      progressTimer = setInterval(updateProgress, 250);
    }

    function stopProgressTimer() {
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
    }

    function updatePlayButton() {
      if (!playBtn) return;
      playBtn.textContent = isPlaying ? "Pause" : "Play";
      playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
    }

    function updateMuteButton() {
      if (!muteBtn) return;
      muteBtn.textContent = isMuted ? "Unmute" : "Mute";
      muteBtn.setAttribute("aria-pressed", isMuted ? "true" : "false");
    }

    function applyMuteState() {
      if (!player) return;
      if (isMuted) player.mute();
      else player.unMute();
    }

    function styleIframe() {
      if (!player || !player.getIframe) return;
      const iframe = player.getIframe();
      iframe.removeAttribute("width");
      iframe.removeAttribute("height");
    }

    function setActiveTab(index) {
      videoTabs.forEach(function (tab) {
        const tabIndex = Number(tab.getAttribute("data-video-index"));
        const isActive = tabIndex === index;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    }

    function showVideo(index) {
      const video = videos[index];
      if (!video || !player || !player.loadVideoById) return;

      setActiveTab(index);
      player.loadVideoById({
        videoId: video.id,
        startSeconds: VIDEO_START,
      });
      applyMuteState();
    }

    function initPlayer() {
      player = new YT.Player(embedEl, {
        width: "100%",
        height: "100%",
        videoId: videos[0].id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          start: VIDEO_START,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: function () {
            styleIframe();
            player.mute();
            player.playVideo();
            updateMuteButton();
            updateProgress();
          },
          onStateChange: function (event) {
            styleIframe();
            isPlaying = event.data === YT.PlayerState.PLAYING;
            updatePlayButton();

            if (isPlaying) startProgressTimer();
            else stopProgressTimer();

            if (event.data === YT.PlayerState.ENDED) {
              isPlaying = false;
              updatePlayButton();
            }
          },
        },
      });
    }

    videoTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        showVideo(Number(tab.getAttribute("data-video-index")));
      });
    });

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        if (!player) return;

        if (isPlaying) player.pauseVideo();
        else player.playVideo();
      });
    }

    if (progressEl) {
      progressEl.addEventListener("mousedown", function () {
        isSeeking = true;
      });

      progressEl.addEventListener("touchstart", function () {
        isSeeking = true;
      });

      progressEl.addEventListener("input", function () {
        if (!player || !player.getDuration) return;
        const duration = player.getDuration();
        if (!duration) return;

        const nextTime = (Number(progressEl.value) / 1000) * duration;
        if (timeEl) {
          timeEl.textContent =
            formatTime(nextTime) + " / " + formatTime(duration);
        }
      });

      progressEl.addEventListener("change", function () {
        if (!player || !player.getDuration) return;
        const duration = player.getDuration();
        if (!duration) return;

        const nextTime = (Number(progressEl.value) / 1000) * duration;
        player.seekTo(nextTime, true);
        isSeeking = false;
        updateProgress();
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener("click", function () {
        isMuted = !isMuted;
        applyMuteState();
        updateMuteButton();
      });
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    window.addEventListener("resize", function () {
      styleIframe();
    });
  }

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
