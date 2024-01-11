const ip = '49.13.153.69'
let URL = `http://${ip}:3000/api/`
let jsonIdx = 0;
let threadContainer = document.getElementById('threadContainer')
const submitBtn = document.getElementById('submitBtn');

document.addEventListener('DOMContentLoaded', fetchThread);

submitBtn.addEventListener('click', async () => {
    await post()
    await fetchThread()
    document.getElementById('form_container').scrollIntoView({behavior: 'smooth'})
})

document.addEventListener('click', (event) => {
    const btn = event.target
    if (btn.classList.contains('likeBtn')) {
        likePost(true, btn.closest('.post').id)
        fetchThread()
    }
    if (btn.classList.contains('dislikeBtn')) {
        likePost(false, btn.closest('.post').id)
        fetchThread()
    }
})


function post() {
    const msgInput = document.getElementById('msgInput')
    const fileInput = document.getElementById('fileInput')

    const fd = new FormData()
    fd.append('msg', msgInput.value)
    if (fileInput.files[0] != null) 
        fd.append('file', fileInput.files[0])

    fetch(`${URL}insert`, {method: 'POST', body: fd})
        .then(res => {
            res.ok ? console.log('POST OK') : console.log('POST ERROR')
            msgInput.value = ""
        }).catch(e => console.error(e))
}


function likePost(like, id) {
    const url = like ? `${URL}like/${id}` : `${URL}dislike/${id}`
    fetch(url, { method: 'POST' })
}


function fetchThread() {
    fetch(`${URL}thread`)
        .then(res => res.json())
        .then(json => {
            json.sort((a,b) => a.id - b.id)
            console.log(json)
            for (;jsonIdx < json.length; jsonIdx++) createPost(json[jsonIdx])
            //for (const post of json) createPost(post)
        })
        .catch(err => console.log(err))
}


function getUrl(post) {
    if (!post.media) return null
    return `${URL}media/${post.id}.${post.mediaMimeType}`
}


function isVideo(post) {
    if (post.mediaMimeType === 'webm' || post.mediaMimeType === 'mp4') return true
    return false
}


function createPost(p) {
    const thread = document.getElementById('threadContainer')
    const post = document.createElement('div')
    post.classList.add('post') 
    post.id = p.id

    const postContents = document.createElement('div')
    postContents.classList.add('postContents')

    if (p.media) {
        if (isVideo(p)) {
            const video = createVideo(p)
            postContents.appendChild(video)
        } else {
            const img = document.createElement('img')
            img.src = getUrl(p)
            postContents.appendChild(img)
        }
    }

    const ptag = document.createElement('p')
    if (p.msg != null) ptag.textContent = p.msg
    postContents.appendChild(ptag)

    const postLikesDislikesContainer = document.createElement('div')
    postLikesDislikesContainer.classList.add('postLikesDislikesContainer')

    const likesContainer = createLikesContainer(p.likes)
    const dislikesContainer = createDislikesContainer(p.dislikes)

    postLikesDislikesContainer.appendChild(likesContainer)
    postLikesDislikesContainer.appendChild(dislikesContainer)
    post.appendChild(postContents)
    post.appendChild(postLikesDislikesContainer)
    thread.appendChild(post)
}


function createVideo(post) {
    const video = document.createElement('video')
    video.style.maxwidth = '40%'
    video.style.maxHeight = '40%'
    video.controls = true
    const source = document.createElement('source')
    source.src = getUrl(post)
    source.type = `video/${post.mediaMimeType}`
    video.appendChild(source)
    return video
}


function createLikesContainer(likes) {
    const likesContainer = document.createElement('div')
    likesContainer.classList.add('likesContainer')
    const nLikes = document.createElement('h3')
    nLikes.textContent = likes
    const likeBtn = document.createElement('button')
    likeBtn.classList.add('likesDislikesBtn')
    likeBtn.classList.add('likeBtn')
    likeBtn.textContent = '👍'
    likesContainer.appendChild(likeBtn)
    likesContainer.appendChild(nLikes)
    return likesContainer
}


function createDislikesContainer(dislikes) {
    const dislikesContainer = document.createElement('div')
    dislikesContainer.classList.add('likesContainer')
    const nDislikes = document.createElement('h3')
    nDislikes.textContent = dislikes
    const dislikeBtn = document.createElement('button')
    dislikeBtn.classList.add('likesDislikesBtn')
    dislikeBtn.classList.add('dislikeBtn')
    dislikeBtn.textContent = '👎'
    dislikesContainer.appendChild(dislikeBtn)
    dislikesContainer.appendChild(nDislikes)
    return dislikesContainer
}