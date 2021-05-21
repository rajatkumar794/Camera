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
})();