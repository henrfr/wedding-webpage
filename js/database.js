var firebaseConfig = {
    apiKey: "AIzaSyDvT7mI-t-E8uNNISpJvaUqYykmA0KSqJA",
    authDomain: "henrikogjulie.firebaseapp.com",
    databaseURL: "https://henrikogjulie-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "henrikogjulie",
    storageBucket: "henrikogjulie.appspot.com",
    messagingSenderId: "996672953611",
    appId: "1:996672953611:web:cc1e903239279ee265560e",
    measurementId: "G-0N9KRTMKMZ"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";

const app = initializeApp(firebaseConfig);

import { getDatabase, ref, set, child, update, remove, get, onValue, orderByChild, query, limitToFirst} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

const db = getDatabase();

var namn = document.getElementById("namn");
var nr = document.getElementById("nr");
var kjem = document.getElementById("kjem");
var msg = document.getElementById("msg");
var email = document.getElementById("email");
var submitBtn = document.getElementById("knapp-1");
var knapp2 = document.getElementById("knapp-2");
var submitBtnGrill = document.getElementById("knapp-1-grill")
var wishlistNamn = document.getElementById("wishlistNamn");
var wishlistNumber = document.getElementById("wishlistNumber");

async function InsertDataWishlist(){
    if (wishlistNamn.value == "") {
        showFailure("Namn og antal er påkrevd. Prøv på nytt");
        return;
    }
    if (wishlistNumber.value == "") {
        showFailure("Namn og antal er påkrevd. Prøv på nytt");
        return;        
    }
    if (parseInt(wishlistNumber.value) <= 0) {
        showFailure("Antall må vere større enn 0");
        return;
    }
    var presentName = document.getElementById("wishlist-header").innerHTML;
    var howMany = wishlistNumber.value;
    const inDatabase = await get(child(ref(db), "Gaver/"+presentName))
    .then((snapshot) => {
        return snapshot.exists();
    });
    if (!inDatabase){
        showFailure("Denne gåva finnes ikkje i databasen!");
        return;
    }
    
    const amount = await get(child(ref(db), "Gaver/"+presentName))
    .then((snapshot) => {
        return snapshot.val()["antall"];
    });
    if (howMany > amount){
        showFailure("Du kan ikkje velge fleire gåver enn det som er tilgjengeleg.");
        return;
    }

    var availablePresents = amount;
    if (availablePresents > howMany) {
        update(ref(db, "Gaver/" + presentName),{
            antall: Number(availablePresents - howMany),
        })
        .catch((error) => {
            alert("Noko har gått gale. Kopier feilmeldinga og send den til Henrik på henrik.friis@outlook.com. Feilmelding: " + error);
            return;
        });
        set(ref(db, "Givere/" +presentName + wishlistNamn.value),{
            namn: presentName,
            antall: Number(howMany),
            giver: wishlistNamn.value,
        })
        .then(() => {
            showSuccess("Takk for at du registrerte " + String(howMany) + " stk. av gåva " + "'"+presentName+"'");
        }).catch((error) => {
            alert("Noko har gått gale. Kopier feilmeldinga og send den til Henrik på henrik.friis@outlook.com. Feilmelding: " + error);
            return;
        })
    } else {
        update(ref(db, "Gaver/" + presentName),{
            giver: "Sann",
            antall: Number(availablePresents - howMany),
        })
        .catch((error) => {
            alert("Noko har gått gale. Kopier feilmeldinga og send den til Henrik på henrik.friis@outlook.com. Feilmelding: " + error);
        })
        set(ref(db, "Givere/" + presentName + wishlistNamn.value),{
            antall:Number(howMany),
            giver: wishlistNamn.value,
            namn: presentName
        })
        .then(() => {
            showSuccess("Takk for at du registrerte " + String(howMany) + " stk. av gåva: " + "'"+presentName+"'");
        })
        .catch((error) => {
            alert("Noko har gått gale. Kopier feilmeldinga og send den til Henrik på henrik.friis@outlook.com. Feilmelding: " + error);
        }); 
    }

    document.getElementById("wishlistForm").reset()
    document.querySelector(".wishlist-modal").style.display = 'none';
}

async function InsertData(){
    if (namn.value == "") {
        showFailure("Namn, nr. og email er påkrevd. Prøv på nytt.");
        return;
    }
    if (nr.value == "") {
        showFailure("Namn, nr. og email er påkrevd. Prøv på nytt.");
        return;
    } 
    if (email.value == "") {
        showFailure("Namn, nr. og email er påkrevd. Prøv på nytt.");
        return;
    }
    const alreadyRegistered = await get(child(ref(db), "Gjester/" + namn.value + "/public"))
    .then((snapshot) => {
        return snapshot.exists();
    });
    if (alreadyRegistered) {
        showFailure("Du er allerede registrert. Ta kontakt med Henrik eller Julie om du vil endre noko.");
        return;
    }
    set(ref(db, "Gjester/" + namn.value),{
        public: {
            namn: namn.value
        },
        private: {
            email: email.value,
            nr: nr.value,
            kjem: kjem.value,
            msg: msg.value,
            namn: namn.value
        }
    })
    .then(()=>{
        popUp(namn.value, kjem.value);
        showSuccess("Takk for at du registrerte deg!");
    })
    .catch((error)=>{
        alert("Noko har gått gale, kopier feilmeldinga og ta kontakt med Henrik på henrik.friis@outlook.com, Feil: " + error);
    });
}

async function InsertGrillData(){
    if (namn.value == "") {
        showFailure("Namn er påkrevd. Prøv på nytt.");
        return;
    }
    const alreadyRegistered = await get(child(ref(db), "Grillgjester/" + namn.value + "/public"))
    .then((snapshot) => {
        return snapshot.exists();
    });
    if (alreadyRegistered) {
        showFailure("Du er allerede registrert. Ta kontakt med Henrik eller Julie om du vil endre noko.");
        return;
    }
    set(ref(db, "Grillgjester/" + namn.value),{
        public: {
            namn: namn.value
        },
        private: {
            kjem: kjem.value,
            namn: namn.value
        }
    })
    .then(()=>{
        popUp(namn.value, kjem.value);
        showSuccess("Takk for at du registrerte deg!");
    })
    .catch((error)=>{
        alert("Noko har gått gale, kopier feilmeldinga og ta kontakt med Henrik på henrik.friis@outlook.com, Feil: " + error);
    });
}

function popUp(namn, kjem){

    var namnList = namn.split(/\s+/);
    if(kjem == 'Eg kjem'){
        document.querySelector(".varsel").innerHTML = "Hei, " + namnList[0] +"! Me sett pris på at du kjem.";
        document.querySelector(".varsel").style.display = 'block';
    }
    else{
        document.querySelector(".varsel").innerHTML = "Hei, " + namnList[0] +"! Takk for at du svarte.";
        document.querySelector(".varsel").style.display = 'block';
    }
    document.getElementById("contactForm").reset();
}

function wishlistPopUp(){
    var wishlistHeader = document.getElementById("wishlist-header");
    wishlistHeader.innerHTML = this.id;
    document.querySelector(".wishlist-modal").style.display = 'flex';
}
function closeWishlistPopUp(){
    document.querySelector(".wishlist-modal").style.display = "none";
}
function showSortMenu() {
    document.getElementById("sort-modal").style.display = "flex";
}
function closeSortMenu(){
    document.getElementById("sort-modal").style.display = "none";
}
function showSuccess(msg){
    document.getElementById("su-fa").style.display = "flex";
    document.getElementById("su-fa-msg").innerHTML = msg;
    document.getElementById("su-fa-header").innerHTML = "Registreringa var vellykka!"
}
function showFailure(msg){
    document.getElementById("su-fa-content").classList.add("fa");
    document.getElementById("su-fa").style.display = "flex";
    document.getElementById("su-fa-header").innerHTML = "Registreringa var mislykka!"
    document.getElementById("su-fa-msg").innerHTML = msg;
}
// This was commented out due to the rsvp-form being closed and replaced by the grill-rsvp-form.
// submitBtn.addEventListener("click", InsertData);
submitBtnGrill.addEventListener("click", InsertGrillData);
knapp2.addEventListener("click", InsertDataWishlist);
document.getElementById("sort").addEventListener("click", showSortMenu);
document.getElementById("close-sort-modal").addEventListener("click", closeSortMenu);
document.getElementById("stigende").addEventListener("click", sortByAscendingPrice);
document.getElementById("synkende").addEventListener("click", sortByDescendingPrice);
document.getElementById("alfabetisk").addEventListener("click", sortByName);
document.getElementById("mengde").addEventListener("click", sortByAmount);
document.getElementById("close-wishlist-modal").addEventListener("click", closeWishlistPopUp);

var tbody = document.getElementById("tbody1");
var pris = 0;
var antall = 0;

function addItemToTable(namn, pris, skildring, lenke, antall){
    let trow = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let td6 = document.createElement("td");

    var str = "Link";

    td1.innerHTML=namn;
    td2.innerHTML=+pris;
    td2.id = namn + "pris";
    td3.innerHTML=skildring;
    td3.id = namn + "skildring";
    td4.innerHTML=str.link(lenke);
    td4.id = namn + "link";
    td5.innerHTML=+antall;
    td5.id = namn + "antall";
    td6.innerHTML="Laster";
    td6.id = namn;
    td6.classList.add("inactive-wishlist-btn");

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);

    tbody.appendChild(trow);
}

function addAllItemsToTable(Gaven){
    pris = 0;
    antall = 0;
    tbody.innerHTML="";
    Gaven.filter(v => v.giver == "").forEach(element => {
        addItemToTable(element.namn, Number(element.pris), element.skildring, element.link, Number(element.antall));
    });
}

function GetAllDataRealTime(){
    const dbRef = ref(db, "Gaver");

    onValue(dbRef, (snapshot)=>{
        var gaver = [];

        snapshot.forEach(childSnapshot => {
            gaver.push(childSnapshot.val());
        });

        addAllItemsToTable(gaver);
        makeButtons();
    });
}

function makeButtons(){
    const range = document.getElementsByClassName("inactive-wishlist-btn").length;
    var submitBtn2 = document.getElementsByClassName("inactive-wishlist-btn");
    var submitBtn2Copy = [...submitBtn2];
    for (var i = 0; i<range; i++){
        submitBtn2Copy[i].addEventListener('click', wishlistPopUp);
        submitBtn2Copy[i].classList.remove("inactive-wishlist-btn");
        submitBtn2Copy[i].innerHTML = "Velg";
        submitBtn2Copy[i].classList.add("wishlist-btn");   
    }
};


window.onload = GetAllDataRealTime;

function addAllItemsToTableReversed(Gaven){
    Gaven.reverse();
    pris = 0;
    antall = 0;
    tbody.innerHTML="";
    Gaven.filter(v => v.giver == "").forEach(element => {
        addItemToTable(element.namn, Number(element.pris), element.skildring, element.link, Number(element.antall));
    });
}

function sortByAscendingPrice(){
    const que = query(ref(db, "Gaver"), orderByChild("pris"));
    get(que)
    .then((snapshot)=>{
        var gaver = [];

        snapshot.forEach(childSnapshot => {
            gaver.push(childSnapshot.val());
        });
        addAllItemsToTable(gaver);
        makeButtons();
        closeSortMenu();
    })
}

function sortByName(){
    const que = query(ref(db, "Gaver"), orderByChild("namn"));
    get(que)
    .then((snapshot)=>{
        var gaver = [];

        snapshot.forEach(childSnapshot => {
            gaver.push(childSnapshot.val());
        });
        addAllItemsToTable(gaver);
        makeButtons();
        closeSortMenu();
    })
}

function sortByAmount(){
    const que = query(ref(db, "Gaver"), orderByChild("antall"));
    get(que)
    .then((snapshot)=>{
        var gaver = [];

        snapshot.forEach(childSnapshot => {
            gaver.push(childSnapshot.val());
        });
        addAllItemsToTable(gaver);
        makeButtons();
        closeSortMenu();
    })
}

function sortByDescendingPrice(){
    const que = query(ref(db, "Gaver"), orderByChild("pris"));
    get(que)
    .then((snapshot)=>{
        var gaver = [];

        snapshot.forEach(childSnapshot => {
            gaver.push(childSnapshot.val());
        });
        addAllItemsToTableReversed(gaver);
        makeButtons();
        closeSortMenu();
    })
}