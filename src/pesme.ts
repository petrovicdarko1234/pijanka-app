let _pesmeURL = "http://192.168.88.34:5000"
//http://localhost:5000/api/songs

let _eventID: string

type Song = {
    id: number
    name: string
}

async function onPage1Load() {
    setEventID()
    let validID = await checkID()
    if (!validID) {
        window.location.href = "/"
    }
    await startRePagination()
    await startLisPagination()
}
async function setEventID() {
    let url: string = window.location.href
    let urlParts: string[] = url.split("?id=")
    if (urlParts.length == 2) {
        _eventID = urlParts[1]
    } else {
        window.location.href = "/"
    }
    //flow
    //1. klik na dugme => api call na server da ti da folder name
    //2. kad se vrati resposne podesis window.location.href = "koja god putanja ?id=folderName"
    //3. kopiras URL na coveka i baacis mu na cat
    //4. cokvek otvori url, na front u onload ispituje se da li ima ?id=folderName. Ako ima uzmes folderName i saljes na server dalje
}
async function checkID(): Promise<boolean> {
    let response = await fetch(_pesmeURL + "/api/checkID/" + _eventID, {
        method: 'GET',
    })
    let validID = await response.json() as boolean
    return validID
}

async function getEventSongs(): Promise<Song[]> {
    let response = await fetch(_pesmeURL + "/api/event/songs/" + _eventID, {
        method: 'GET',
    })
    let json = await response.json()

    let songs: Song[] = json as Song[]
    return songs
}

//paginacija :D
function paginate(items: Song[], itemsPerPage: number, itemsCont: HTMLDivElement, paginationCont: HTMLDivElement) {
    let currentPage = 1;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    function showItems(page: number) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = items.slice(startIndex, endIndex);

        const itemsContainer = itemsCont
        if (itemsContainer == null) {
            return
        }
        itemsContainer.innerHTML = "";

        pageItems.forEach((item) => {
            const li = document.createElement("li");
            li.innerText = item.name;
            li.id = "" + item.id
            li.onclick = function () {
                let next = document.getElementById("next")
                let hidden = <HTMLInputElement>document.getElementById("hidden")
                if (next == null) {
                    return
                }
                next.innerHTML = li.innerText
                hidden.value = "" + item.id
            }
            itemsContainer.appendChild(li);
        });
    }

    function setupPagination() {
        const pagination = paginationCont;
        if (pagination == null) {
            return
        }
        pagination.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement("a");
            link.href = "#";
            link.innerText = "" + i;

            if (i === currentPage) {
                link.classList.add("active");
            }

            link.addEventListener("click", (event) => {
                event.preventDefault();
                currentPage = i;
                showItems(currentPage);

                const currentActive = pagination.querySelector(".active");
                if (currentActive == null) {
                    return
                }
                currentActive.classList.remove("active");
                link.classList.add("active");
            });

            pagination.appendChild(link);
        }
    }
    showItems(currentPage);
    setupPagination();
}

async function startRePagination() {
    let pagCont = <HTMLDivElement>document.getElementById("pagination-container")
    let itemCont = <HTMLDivElement>document.getElementById("item")

    let songs = await getEventSongs()
    paginate(songs, 15, itemCont, pagCont)
}
async function startLisPagination() {
    //pag-cont
    let pagCont = <HTMLDivElement>document.getElementById("pagCont")
    let itemCont = <HTMLDivElement>document.getElementById("itemCont")

    let listened = await getListened()
    paginate(listened, 15, itemCont, pagCont)
}
async function getRandomSong() {
    let songs = await getEventSongs()
    let random = Math.floor(Math.random() * songs.length)
    //if Math.random() return 1
    if (random == songs.length) {
        random--
    }

    let randomSong: Song = songs[random]

    let next = document.getElementById("next")
    let hidden = <HTMLInputElement>document.getElementById("hidden")
    if (next == null || hidden == null) {
        return
    }
    next.innerHTML = randomSong.name
    hidden.value = "" + randomSong.id
}

async function orderThisSong() {
    let txtCont = document.getElementById("input")
    let next = document.getElementById("next")
    let hidden = <HTMLInputElement>document.getElementById("hidden")

    let songID = hidden.value

    await fetch(_pesmeURL + "/api/event/songs/" + _eventID + "/" + songID, {
        method: 'GET',
    })
    if (txtCont == null || next == null) {
        return
    }
    txtCont.innerText = next.innerText

    next.innerText = ""

    startRePagination()
    startLisPagination()
}

async function getListened(): Promise<Song[]> {
    let response = await fetch(_pesmeURL + "/api/event/listened/" + _eventID, {
        method: 'GET',
    })
    let json = await response.json()

    let listened: Song[] = json as Song[]
    return listened
}