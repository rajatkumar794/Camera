let gallery = document.querySelector(".gallery")

let iv = setInterval( function(){
    if(db){
        showMedia();
        clearInterval(iv);
    }
}, 100);

function showMedia()
{   
    //assuming db is open
    let txn = db.transaction("Media", "readonly");
    let mediaStore = txn.objectStore("Media")
    let cursorObj = mediaStore.openCursor();
    cursorObj.onsuccess = function(e){
        let cursor = cursorObj.result
        if(cursor)
        {
            createMediaElement(cursor.value)
            cursor.continue()
        }
    }
}

function createMediaElement(mediaObj)
{
    let newMedia = document.createElement("div");
    newMedia.classList.add("gallery-element")
    newMedia.innerHTML = ` <div class="media">  </div>
                        <div class="media-buttons">
                        <div class="download"><i class="fas fa-download"></i></div>
                        <div class="delete"><i class="fas fa-trash"></i></div>
                        </div>`
    
    if(mediaObj.mediaType=="image")
    {   newMedia.setAttribute("mid" , mediaObj.mid);
        let image = document.createElement("img")
        image.src = mediaObj.mediaSource
        newMedia.querySelector(".media").append(image)
    }
    else
    {   
        newMedia.setAttribute("mid" , mediaObj.mid);
        let blob = new Blob([mediaObj.mediaSource], { type: "video/mp4" });
        let videoUrl = URL.createObjectURL(blob);
        let video = document.createElement("video");
        video.src = videoUrl;
        video.autoplay = "true";
        video.loop = "true";
        //video.controls = "true";
        newMedia.querySelector(".media").append(video)
    }
    gallery.append(newMedia);

    newMedia.querySelector(".download").addEventListener("click",function(e){
        downloadMedia(mediaObj)
    })
    newMedia.querySelector(".delete").addEventListener("click",function(e){
        deleteMedia(mediaObj)
    })
}


function deleteMedia(media){
    let mid = media.mid;
    // DB se remove
    let txn = db.transaction("Media" , "readwrite");
    let mediaStore = txn.objectStore("Media");
    mediaStore.delete(mid);
    
    // UI se remove
    document.querySelector(`div[mid="${mid}"]`).remove();
}

function downloadMedia(media){
    let aTag = document.createElement("a")
    if(media.mediaType=="image")
    {
        aTag.download = "image.jpg"
        aTag.href = media.mediaSource
    }
    else
    {
        let blob = new Blob([media.mediaSource], {type:"video/mp4"})
        let videoUrl = URL.createObjectURL(blob)
        aTag.download = "video.mp4"
        aTag.href = videoUrl
    }
    aTag.click()
    aTag.remove()
}
