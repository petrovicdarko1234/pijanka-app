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
Object.defineProperty(exports, "__esModule", { value: true });
let _txtarea = "";
const common_1 = require("./common");
function addSong() {
    return __awaiter(this, void 0, void 0, function* () {
        if (_txtarea != "") {
            yield fetch(common_1._URL + "/api/songs/", {
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
            let res = yield fetch(common_1._URL + "/api/songs/sim", {
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
        let response = yield fetch(common_1._URL + "/api/eventID", {
            method: 'GET',
        });
        let json = yield response.json();
        let eventID = yield json.id;
        window.location.href = common_1._URL + "/pesme.html?id=" + eventID;
    });
}
//# sourceMappingURL=index.js.map