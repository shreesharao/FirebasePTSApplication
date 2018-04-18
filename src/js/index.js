var config = {
    apiKey: "AIzaSyCgsf-3kcMBOhoY-pqaQwLQOABrRrHP3H0",
    authDomain: "pts-app-14f2a.firebaseapp.com",
    databaseURL: "https://pts-app-14f2a.firebaseio.com",
    storageBucket: "pts-app-14f2a.appspot.com",
    messagingSenderId: "474415846860"
};

var app = firebase.initializeApp(config);
var database = app.database();
var auth = app.auth();
var storage = app.storage();

function intiApp() {

    AddEventListner();
    fetchItems();
}

function AddEventListner(user) {
    var submit = document.getElementById('submit');
    submit.addEventListener('click', function (e) {
        if (validateInputs()) {
            processRequest();
        }
        e.preventDefault();
    });

}
function validateInputs() {
    var size = $('#size').val();
    var quantity = $('#quantity').val();
    var name = $('#name').val();
    var phNumber = $('#phNumber').val();
    var address = $('#address').val();
    var messages = "";
    var valid = true;
    if (size === "") {
        valid = false;
        messages += "<li>size is required</li>";
    }
    if (quantity === "") {
        valid = false;
        messages += "<li>quantity is required</li>";
    }
    if (quantity !== "") {
        var regex = new RegExp('[0-9]');
        if (!regex.test(quantity)) {
            valid = false;
            messages += "<li>quantity must be a number</li>";
        }
    }
    if (name === "") {
        valid = false;
        messages += "<li>name is required</li>";
    }
    if (phNumber === "") {
        valid = false;
        messages += "<li>phone Number is required</li>";
    }
    if (phNumber !== "") {
        var regex = new RegExp('[0-9]');
        if (!regex.test(phNumber)) {
            valid = false;
            messages += "<li>Phone number must be a number</li>";
        }
        else if (phNumber.length !== 10) {
            valid = false;
            messages += "<li>Phone number must be 10 digits</li>";
        }

    }
    if (address === "") {
        valid = false;
        messages += "<li>address is required</li>";
    }
    if (!valid) {
        $('#validationMsg').empty().append(messages);
        return false;
    }
    return true;
}
function processRequest() {
    var size = document.getElementById('size').value;
    var quantity = document.getElementById('quantity').value;
    var name = document.getElementById('name').value;
    var phNumber = document.getElementById('phNumber').value;
    var address = document.getElementById('address').value;
    var time = new Date();
    var order = { Size: size, Quantity: quantity, Name: name, phNumber: phNumber, Address: address, Time: time.toDateString() }
    AddOrderToDatabase(order);
}
function AddOrderToDatabase(order) {
    var databaseRef = database.ref().child('order');
    databaseRef.push().set(order).then(function () {
        alert('Order placed successfully');
    });
}

function fetchItems() {
    var databaseRef = database.ref().child('Items');
    databaseRef.once('value')
        .then(function (dataSnapshot) {
            var jsonData = dataSnapshot.val();

            if (jsonData !== null) {
                var values = $.map(jsonData, function (el) { return el });
                // values.forEach(displayItems);
                displayItems(values);
            }
            else
            {
               displayNoDataMessage(); 
            }

        });
}

function displayItems(values) {
    console.log('values' + values);
    var template = "<li class='item-list'><img class='image-style' src='#url#' onclick='fillSize(\"#size#\");'><h3>#size#</h3></li>";
    var li = "";
    values.forEach(function (data) {
        li += template.replace('#url#', data.Url).replace(/#size#/g, data.Size);
    });
    $('#loader').hide();
    $('#items').append(li);

}

function displayNoDataMessage() {
    $('#loader').hide();
    $('#items').append("<h1>No Items Found</h1>");
}

function fillSize(size) {
    $('#size').val(size);
}
window.onload = function () {
    intiApp();
}