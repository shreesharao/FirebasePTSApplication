// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
    $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 2000, 'easeInOutExpo');
        event.preventDefault();
    });
});



var config = {
    apiKey: "AIzaSyCgsf-3kcMBOhoY-pqaQwLQOABrRrHP3H0",
    authDomain: "pts-app-14f2a.firebaseapp.com",
    databaseURL: "https://pts-app-14f2a.firebaseio.com",
    storageBucket: "pts-app-14f2a.appspot.com",
    projectId: "pts-app-14f2a",
    storageBucket: "pts-app-14f2a.appspot.com",
    messagingSenderId: "474415846860"
};

var app = firebase.initializeApp(config);
var database = app.database();
var auth = app.auth();
var storage = app.storage();

function intiApp() {
    authenticate();
}

function authenticate() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            toggleDiv("loginform");
            var login = document.getElementById("login");
            login.addEventListener('click', function (e) {
                if (validateCredentials()) {
                    authenticateUser();
                }

            });

        }
        else {
            var upload = document.getElementById("upload");
            upload.addEventListener('click', function (e) {
                if (validateInputs()) {
                    uploadImage(e);
                }
            });
            // file.addEventListener('change', function (e) {
            //     uploadImage(e);
            // });
            toggleDiv("dashboard");
            fetchData();

        }
    });

}
function validateCredentials() {
    var email = $('#email').val();
    var pwd = $('#password').val();
    var valid = true;
    if (email === "") {
        valid = false;
        $('#email').attr('placeholder', "Email id is required");
    }
    if (pwd === "") {
        valid = false;
        $('#password').attr('placeholder', 'password is required');
    }

    return valid;
}
function validateInputs() {
    var size = $('#size').val();
    var file = $('#file').val();
    var messages = "";
    var valid = true;
    if (size === "") {
        valid = false;
        messages += "<li>size is required</li>";
    }
    if (file === "") {
        valid = false;
        messages += "<li>file is required</li>";
    }
    if (!valid) {
        $('#validationMsg').empty().append(messages);
        return false;
    }
    return true;
}

//to display either login div or dashboard div
function toggleDiv(div) {
    if (div === "loginform") {
        $('#loginform').show();
        $('#dashboard').hide();
        $('#navsection').hide();
    }
    else {
        $('#loginform').hide();
        $('#dashboard').show();
        $('#navsection').show();
    }
}

function authenticateUser() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        }
        else if (errorCode = 'auth/network-request-failed') {
            alert('Network error.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
}
function fetchData() {
    var databaseRef = database.ref().child('order');
    databaseRef.once('value')
        .then(function (dataSnapshot) {
            var jsonData = dataSnapshot.val();
            var values = $.map(jsonData, function (el) { return el });
            values.forEach(displayInTable);
            var table = document.getElementById("datatable");
            $("#table").tablesorter({ sortList: [[1, 0]] });
        });
}

function displayInTable(data, index) {
    //var row='<tr><td>#id#</td><td>#name#</td><td>#phn#</td><td>#quant#</td><td>#addr#</td></tr>';
    var table = document.getElementById("datatable");
    rowEl = table.insertRow();  // DOM method for creating table rows
    rowEl.insertCell().textContent = index + 1;
    rowEl.insertCell().textContent = data.Size;
    rowEl.insertCell().textContent = data.Name;
    rowEl.insertCell().textContent = data.phNumber;
    rowEl.insertCell().textContent = data.Quantity;
    rowEl.insertCell().textContent = data.Address;
    rowEl.insertCell().textContent = data.Time;
}


function uploadImage(e) {
    var file = document.getElementById('file');
    var storageRef = firebase.storage().ref();

    // File 
    var objFile = file.files[0]; //e.target.files[0];

    //only images can be uploaded
    var acceptedTypes = ["image/jpeg", "image/gif", "image/png", "image/bmp", "image/webp"];
    if ($.inArray(objFile.type, acceptedTypes)) {
        alert("only images can be uploaded\n accpeted file types:" + acceptedTypes);
        file.value = "";
        return;
    }

    // Create the file metadata
    var metadata = {
        contentType: objFile.type
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    storageRef.child('images/' + objFile.name).put(objFile, metadata).then(function (snapshot) {
        console.log('Uploaded' + snapshot.totalBytes + 'bytes.');
        var url = snapshot.downloadURL;
        var size = document.getElementById('size').value;
        var item = { Size: size, Url: url }
        AddItemToDatabase(item);

    }).catch(function (error) {
        // [START onfailure]
        alert('Upload failed:' + error);
        // [END onfailure]
    });
    // [END oncomplete]
}
function AddItemToDatabase(item) {
    var databaseRef = database.ref().child('Items');
    databaseRef.push().set(item).then(function () {
        alert('Image uploaded successfully');
    });
}
window.onload = function () {

    intiApp();
}