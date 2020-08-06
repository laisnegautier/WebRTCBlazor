'use strict'

let nbVideos = 15;

let vpWidth = window.innerWidth;
let vpHeight = window.innerHeight;
console.log(vpWidth);
console.log(vpHeight);

window.initializeGrid = () => {
    window.addEventListener('resize', () => {
        vpWidth = window.innerWidth;
        vpHeight = window.innerHeight;
        adaptVideos();
    });

    let i = 0;
    for (i = 0; i < nbVideos - 2; i++) {
        var d = document.createElement('div')
        d.classList.add('video')
        document.querySelector('.videoboard').appendChild(d)
    }

    adaptVideos();
};

function adaptVideos() {
    let listVideo = document.querySelectorAll('.video');

    let optimalVideoWidth = getVideoWidth(nbVideos, vpWidth, vpHeight);
    let optimalVideoHeight = ~~((3 / 4) * optimalVideoWidth); //int version
    listVideo.forEach((video, index, array) => {
        video.style.width = optimalVideoWidth + "px";
        video.style.height = optimalVideoHeight + "px";
        video.style.animation = "colorchange 3s ease-in-out " + index / 10 + "s infinite alternate";
    });
}

function getVideoWidth(nbVideos, vpWidth, vpHeight) {
    let nbVideosPerCol = 0;
    let videoWidth = 0;
    let videoHeight = 0;
    let nbRows = 0;
    let heightAllLines = 0;

    while (nbVideosPerCol <= nbVideos) {
        console.log("NEW LOOP: nbVideosPerCol: " + nbVideosPerCol);

        videoWidth = ~~(vpWidth / nbVideosPerCol);
        console.log("videoWidth: " + videoWidth);

        nbRows = Math.floor(nbVideos / nbVideosPerCol) + ((nbVideos % nbVideosPerCol == 0) ? 0 : 1);
        console.log("nbRows: " + nbRows);

        videoHeight = ~~((3 / 4) * videoWidth);
        console.log("videoHeight: " + videoHeight);

        heightAllLines = nbRows * videoHeight;
        console.log("heightAllLines: " + heightAllLines);

        if (heightAllLines <= vpHeight) {
            console.log(videoWidth);
            return videoWidth;
        }

        //Exception to avoid the videos to disappear when they are on one line
        if (nbRows == 1) {
            return videoWidth;
        }

        nbVideosPerCol += 1;
    }
}