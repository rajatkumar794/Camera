let videoPlayer = document.querySelector("video")
let recordButton = document.querySelector("#record-video")
let photoButton = document.querySelector("#capture-photo")
let zoomIn = document.querySelector(".in")
let zoomOut = document.querySelector(".out")
let filters = document.querySelectorAll(".filters")
let constraints = {video:true};
let recordedData;
let mediaRecorder;

let curZoom = 1;
let minZoom = 1;
let maxZoom = 3;  
let curFilter="";

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

    recordButton.addEventListener("click", function(e){
        if(recordingState)
        {
            mediaRecorder.stop();
            recordButton.querySelector("div").classList.remove("record-animate")
        }
        else
        {
            mediaRecorder.start();
            recordButton.querySelector("div").classList.add("record-animate")
        }
        recordingState=!recordingState
    })

    photoButton.addEventListener("click", function(e){
        capturePhotos()
    })

    zoomIn.addEventListener("click", function(e){
        if(curZoom+0.1<=maxZoom)
            curZoom+=0.1
        videoPlayer.style.transform = `scale(${curZoom})`
    });
    
    zoomOut.addEventListener("click", function(e){
        if(curZoom-0.1>=minZoom)
            curZoom-=0.1
        videoPlayer.style.transform = `scale(${curZoom})`
    });

    for(let i=0; i<filters.length; ++i)
    {
        filters[i].addEventListener("click", addFilter)
    }
})();

function saveVideotoFS()
{
    let videoUrl = URL.createObjectURL(recordedData)

    let iv = setInterval(function(){
        if(db)
        {   saveMedia("video", videoUrl)
            clearInterval(iv)
        }
    },100);

    // let aTag = document.createElement("a")
    // aTag.download = "video.mp4"
    // aTag.href = videoUrl;
    
    // aTag.click();
    // aTag.remove();

}

function capturePhotos()
{   
    photoButton.querySelector("div").classList.add("capture-animate")
    setTimeout(function(){
        photoButton.querySelector("div").classList.remove("capture-animate")
    },500)

    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext('2d')
    canvas.height = videoPlayer.videoHeight;
    canvas.width = videoPlayer.videoWidth

    if(curZoom!=1)
    {
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.scale(curZoom, curZoom);
        ctx.translate(-canvas.width/2, -canvas.height/2)
    }

    ctx.drawImage(videoPlayer, 0, 0)
    let imageUrl = canvas.toDataURL("image/jpg")
    
    let iv = setInterval(function(){
        if(db)
        {   saveMedia("image", imageUrl)
            clearInterval(iv)
        }
    },100);

    //skipping downloading part
    // let aTag = document.createElement("a")
    // aTag.download = "img.jpg"
    // aTag.href = imageUrl;
    // aTag.click();
}

function addFilter(e)
{
    let newFilter = e.path[1].classList[1];
    if(newFilter==curFilter)
        curFilter=""
    else
        curFilter=newFilter
    videoPlayer.classList=curFilter
}