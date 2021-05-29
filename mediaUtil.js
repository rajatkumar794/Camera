let galleryBtn = document.querySelector(".gallery-button")

galleryBtn.addEventListener("click", function(e){
    location.assign("./gallery.html")
})

function saveMedia(mediaType, mediaSource){
    let txn = db.transaction("Media", "readwrite")
    let mediaStore = txn.objectStore("Media")
    let mediaFile = {
        mid: Date.now(),
        mediaType,
        mediaSource
    }
    mediaStore.add(mediaFile)
}