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
let _txtarea = "";
let _URL = "http://192.168.1.9:5000";
//http://localhost:5000/api/songs
function addSong() {
    return __awaiter(this, void 0, void 0, function* () {
        if (_txtarea != "") {
            yield fetch(_URL + "/api/songs/", {
                method: 'POST',
                body: JSON.stringify({ name: _txtarea }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        }
        let txtbox = document.getElementById("txt");
        if (txtbox != null) {
            txtbox.value = "";
        }
        let list = document.getElementById("list");
        list.innerHTML = "";
    });
}
function updateTextarea() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("updateTextarea");
        let txtbox = document.getElementById("txt");
        if (txtbox != null) {
            _txtarea = txtbox.value;
        }
        console.log("ovo je txt" + _txtarea);
        if (_txtarea != "") {
            let res = yield fetch(_URL + "/api/songs/sim", {
                method: 'POST',
                body: JSON.stringify({ name: _txtarea }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            let matchs = yield res.json();
            //let  = json.res
            let list = document.getElementById("list");
            list.innerHTML = "";
            if (matchs.length != 0) {
                for (let i = 0; i < matchs.length; i++) {
                    let li = document.createElement("li");
                    li.innerHTML = matchs[i];
                    li.onclick = function () {
                        txtbox.value = li.innerHTML;
                    };
                    list.appendChild(li);
                }
            }
        }
    });
}
function getEventID() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(_URL + "/api/eventID", {
            method: 'GET',
        });
        let json = yield response.json();
        let eventID = yield json.id;
        window.location.href = _URL + "/pesme.html?id=" + eventID;
        console.log(eventID);
    });
}
//# sourceMappingURL=index.js.map