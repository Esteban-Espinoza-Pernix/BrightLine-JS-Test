function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function () {
    const status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

let currentIndex = 0;
let videos;

getJSON("https://cdn-media.brightline.tv/training/demo.json", (error, data) => {
  if (error !== null) {
    console.error(`Ocurrió un error: ${error}`);
    return;
  }
  videos = data.streams;
  updateVideo();
});

function updateVideo() {
  const video = document.querySelector("#video");
  video.src = videos[currentIndex].mediaFile;
  video.type = getVideoType(video.src);
}

function getVideoType(videoInfo) {
  const extension = videoInfo.split(".");
  switch (extension[extension.length - 1].toLowerCase()) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
      return "video/ogg";
    case "m3u8":
      return "application/x-mpegURL";
    default:
      break;
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = videos.length - 1;
      }
      updateVideo();
      break;
    case "ArrowRight":
      currentIndex++;
      if (currentIndex >= videos.length) {
        currentIndex = 0;
      }
      updateVideo();
      break;
    case "Enter":
      const video = document.querySelector("#video");
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen();
      }
      break;
  }
});

document.addEventListener("fullscreenchange", () => {
  const video = document.querySelector("#video");
  if (document.fullscreenElement) {
    video.play();
  } else {
    video.pause();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Backspace" && document.fullscreenElement) {
    document.exitFullscreen();
  }
});
