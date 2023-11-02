"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let _pesmeURL = "http://192.168.1.9:5000";
//http://localhost:5000/api/songs
let _eventID;
function onPage1Load() {
    return __awaiter(this, void 0, void 0, function* () {
        setEventID();
        let validID = yield checkID();
        if (!validID) {
            window.location.href = "/";
        }
        yield startRePagination();
        yield startLisPagination();
    });
}
function setEventID() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = window.location.href;
        let urlParts = url.split("?id=");
        if (urlParts.length == 2) {
            console.log(urlParts[1]);
            _eventID = urlParts[1];
        }
        else {
            console.log(urlParts[1]);
            window.location.href = "/";
        }
        //flow
        //1. klik na dugme => api call na server da ti da folder name
        //2. kad se vrati resposne podesis window.location.href = "koja god putanja ?id=folderName"
        //3. kopiras URL na coveka i baacis mu na cat
        //4. cokvek otvori url, na front u onload ispituje se da li ima ?id=folderName. Ako ima uzmes folderName i saljes na server dalje
    });
}
function checkID() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(_pesmeURL + "/api/checkID/" + _eventID, {
            method: 'GET',
        });
        let validID = yield response.json();
        return validID;
    });
}
function getEventSongs() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(_pesmeURL + "/api/event/songs/" + _eventID, {
            method: 'GET',
        });
        let json = yield response.json();
        let songs = json;
        return songs;
    });
}
//paginacija :D
function paginate(items, itemsPerPage, itemsCont, paginationCont) {
    let currentPage = 1;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    function showItems(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = items.slice(startIndex, endIndex);
        const itemsContainer = itemsCont;
        if (itemsContainer == null) {
            return;
        }
        itemsContainer.innerHTML = "";
        pageItems.forEach((item) => {
            const li = document.createElement("li");
            li.innerText = item.name;
            li.id = "" + item.id;
            li.onclick = function () {
                let next = document.getElementById("next");
                let hidden = document.getElementById("hidden");
                if (next == null) {
                    return;
                }
                next.innerHTML = li.innerText;
                hidden.value = "" + item.id;
            };
            itemsContainer.appendChild(li);
        });
    }
    function setupPagination() {
        const pagination = paginationCont;
        if (pagination == null) {
            return;
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
                    return;
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
function startRePagination() {
    return __awaiter(this, void 0, void 0, function* () {
        let pagCont = document.getElementById("pagination-container");
        let itemCont = document.getElementById("item");
        let songs = yield getEventSongs();
        paginate(songs, 15, itemCont, pagCont);
    });
}
function startLisPagination() {
    return __awaiter(this, void 0, void 0, function* () {
        //pag-cont
        let pagCont = document.getElementById("pagCont");
        let itemCont = document.getElementById("itemCont");
        let listened = yield getListened();
        paginate(listened, 15, itemCont, pagCont);
    });
}
function getRandomSong() {
    return __awaiter(this, void 0, void 0, function* () {
        let songs = yield getEventSongs();
        let random = Math.floor(Math.random() * songs.length);
        //if Math.random() return 1
        if (random == songs.length) {
            random--;
        }
        let randomSong = songs[random];
        let next = document.getElementById("next");
        let hidden = document.getElementById("hidden");
        if (next == null || hidden == null) {
            return;
        }
        next.innerHTML = randomSong.name;
        hidden.value = "" + randomSong.id;
    });
}
function orderThisSong() {
    return __awaiter(this, void 0, void 0, function* () {
        let txtCont = document.getElementById("input");
        let next = document.getElementById("next");
        let hidden = document.getElementById("hidden");
        let songID = hidden.value;
        yield fetch(_pesmeURL + "/api/event/songs/" + _eventID + "/" + songID, {
            method: 'GET',
        });
        if (txtCont == null || next == null) {
            return;
        }
        txtCont.innerText = next.innerText;
        next.innerText = "";
        startRePagination();
        startLisPagination();
    });
}
function getListened() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(_pesmeURL + "/api/event/listened/" + _eventID, {
            method: 'GET',
        });
        let json = yield response.json();
        let listened = json;
        return listened;
    });
}
//# sourceMappingURL=pesme.js.map