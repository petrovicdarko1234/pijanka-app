let _txtarea = ""
let _URL = "http://192.168.88.34:5000"
//http://localhost:5000/api/songs

async function addSong() {
    if (_txtarea != "") {
        await fetch(_URL + "/api/songs/", {
            method: 'POST',
            body: JSON.stringify({ name: _txtarea }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
    }
    let txtbox = <HTMLInputElement>document.getElementById("txt")
    if (txtbox != null) {
        txtbox.value = ""
    }
    let list = <HTMLUListElement>document.getElementById("list")
    list.innerHTML = ""
}

async function updateTextarea() {
    console.log("updateTextarea")
    let txtbox = <HTMLInputElement>document.getElementById("txt")
    if (txtbox != null) {
        _txtarea = txtbox.value
    }
    console.log("ovo je txt" + _txtarea)
    if (_txtarea != "") {
        let res = await fetch(_URL + "/api/songs/sim", {
            method: 'POST',
            body: JSON.stringify({ name: _txtarea }),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        let matchs = await res.json() as string[]
        //let  = json.res
        let list = <HTMLUListElement>document.getElementById("list")
        list.innerHTML = ""
        if (matchs.length != 0) {

            for (let i = 0; i < matchs.length; i++) {
                let li = document.createElement("li")
                li.innerHTML = matchs[i]
                li.onclick = function () {
                    txtbox.value = li.innerHTML
                }
                list.appendChild(li)
            }
        }
    }
}

async function getEventID() {
    let response = await fetch(_URL + "/api/eventID", {
        method: 'GET',
    })
    let json = await response.json()
    let eventID = await json.id as string

    window.location.href = _URL + "/pesme.html?id=" + eventID
}