let videoPlayer = document.querySelector("video")
let recordButton = document.querySelector("#record-video")
let photoButton = document.querySelector("#capture-photo")
let constraints = {video:true};
let recordedData;
let mediaRecorder;


(async function(){

    let mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
    videoPlayer.srcObject = mediaStream;
    let recordingState = false;
    
    mediaRecorder = new MediaRecorder(mediaStream)

    mediaRecorder.onstart = function(e){
        console.log("on Start");
    }

    mediaRecorder.onstop = function(e){
        console.log("on Stop");
        
    }

    mediaRecorder.ondataavailable = function(e){
        console.log("on data available");
        recordedData = e.data;
        saveVideotoFS()
    }
    console.log(mediaRecorder);

    recordButton.addEventListener("click", function(e){
        if(recordingState)
        {
            mediaRecorder.stop();
            recordButton.innerHTML = "Record"
        }
        else
        {
            mediaRecorder.start();
            recordButton.innerHTML = "Recording"
        }
        recordingState=!recordingState
    })

    photoButton.addEventListener("click", function(e){
        capturePhotos()
    })
})();

function saveVideotoFS()
{
    console.log("Saving video");
    let videoUrl = URL.createObjectURL(recordedData)
    console.log(videoUrl);

    let aTag = document.createElement("a")
    aTag.download = "video.mp4"
    aTag.href = videoUrl;
    
    aTag.click();
    aTag.remove();

}

function capturePhotos()
{
    let canvas = document.createElement("canvas")
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    let ctx = canvas.getContext('2d')
    ctx.drawImage(videoPlayer, 0, 0)
    let imageUrl = canvas.toDataURL("image/jpg")
    let aTag = document.createElement("a")
    aTag.download = "img.jpg"
    aTag.href = imageUrl;
    aTag.click();
    aTag.remove();
}