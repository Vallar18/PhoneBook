window.onload = function (){
    var quickAddBtn = document.getElementById("quickAdd");
    var AddBtn = document.getElementById("Add");
    var cancelButtons = document.querySelectorAll(".cancel");
    var formReset = document.getElementById("formReset");
    var quickAddFormDiv = document.querySelector(".quickAddForm");
    var searchInput = document.getElementById('input-search');
    var clearSearchBtn = document.querySelector('.clear-search');
    var arrRegExpName = [/^[a-z][a-z0-9]*?([-_][a-z0-9]+){0,2}$/i,
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
        /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/im
    ];

    var name = document.getElementById("name");
    var surname = document.getElementById("surname");
    var phone = document.getElementById("phone");
    var email = document.getElementById("email");

    var addBookDiv = document.querySelector(".addBook");

    var phoneBook = [];

    quickAddBtn.addEventListener("click", function () {
        quickAddFormDiv.style.display = "flex";
    });

    function handleInput(input,regexp) {
        input.addEventListener("keyup", function () {
            if (regexp.test(input.value)) {
                input.classList.remove("invalid");
                input.classList.add("valid");
            }else {
                input.classList.remove("valid");
                input.classList.add("invalid");
            }
        })
    }

    handleInput(name, arrRegExpName[0]);
    handleInput(surname, arrRegExpName[0]);
    handleInput(phone, arrRegExpName[1]);
    handleInput(email, arrRegExpName[2]);

    AddBtn.addEventListener("click", function (e) {
        e.preventDefault();
        addToBook();
    });

    searchInput.addEventListener("keyup", searchContact);
    function searchContact(){
        var input = document.getElementById('input-search');
        var query = input.value.trim().toLowerCase();
        var contacts = document.querySelectorAll('.entryOne');
        if (query.length){
            for (var i=0;i<contacts.length; i++){
                var name = contacts[i].querySelector('.name a').innerText.trim().toLowerCase();
                var surname  = contacts[i].querySelector('.surname a').innerText.trim().toLowerCase();
                if (name.indexOf(query)> -1 || surname.indexOf(query)> -1){
                    contacts[i].style.display = "flex"
                } else {
                    contacts[i].style.display = "none";
                }
            }
        } else {
            for (var i = 0; i<contacts.length; i++){
                contacts[i].style.display = "flex";
            }
        }
    }
    searchInput.addEventListener("keypress", showClearSearchBtn);
    function showClearSearchBtn() {
        clearSearchBtn.style.display = 'block';
    }
    clearSearchBtn.addEventListener('click', clearSearch);
    function clearSearch() {
        searchInput.value = "";
        clearSearchBtn.style.display = 'none';
        showPhoneBook()
    }

    for (var i = 0; i<cancelButtons.length; i++){
        cancelButtons[i].addEventListener("click", function (){
            quickAddFormDiv.style.display = "none";
            clearForm();
        });
    }

    formReset.addEventListener("click", clearForm);

    function jsonStructure (name,surname,phone,email) {
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
    }
    function addToBook() {
        var isNull = name.value!='' && surname.value!='' &&
            phone.value!='' && email.value!='' && !document.querySelectorAll(".invalid").length;
        if(isNull){
            var obj = new jsonStructure(name.value,surname.value,phone.value,email.value);
            phoneBook.push(obj);
            localStorage['addBook'] = JSON.stringify(phoneBook);
            quickAddFormDiv.style.display = "none";
            clearForm();
            showPhoneBook();
        }
    }

    function clearForm() {
        var frm = document.querySelectorAll(".formFields");
        for(var i=0;i<frm.length; i++){
            frm[i].value = '';
            frm[i].classList.remove('valid');
            frm[i].classList.remove('invalid');
        }
    }

    addBookDiv.addEventListener("click", function (e) {
        var entryId= e.target.getAttribute("data-id");
        if(e.target.classList.contains("js-delete-contact")) {
            removeEntry(entryId)
        }else if(e.target.classList.contains('js-open-contact-info')){
            showInfoAboutContact(entryId)
        }else if(e.target.classList.contains('js-cancel-info-block')){
            closeOpenedContactInfo(entryId)
        }else if(e.target.classList.contains('js-change-info-contact')){
            changeInfoContact(entryId)
        }else if (e.target.classList.contains('js-change-save-info-contact')){
            changeSaveInfoContact(entryId);
        } else if(e.target.classList.contains('js-change-cancel-info-contact')){
            changeCancelInfoContact(entryId)
        }
    });
    function removeEntry(id) {
            phoneBook.splice(id, 1);
            localStorage['addBook'] = JSON.stringify(phoneBook);
            showPhoneBook();
        }
    function showInfoAboutContact(id) {
        var oneEntryInfo = addBookDiv.querySelector('.js-info-about-contact') || false,
            phoneBook = JSON.parse(localStorage['addBook']);
        if (!oneEntryInfo) {
            oneEntryInfo = document.createElement('div');
            oneEntryInfo.classList.add('js-info-about-contact');
            addBookDiv.appendChild(oneEntryInfo);
        }else{
            oneEntryInfo.innerHTML="";
        }
        var str = '<ul class="entry js-info-about-contact">';
        str += '<li class="about">About Contact</li>';
        str += '<li class="name"> Name: <input type="text" class="input" readonly value="' + phoneBook[id].name + '" data-default-value="'+ phoneBook[id].name +'"></li>';
        str += '<button class="btn js-cancel-info-block">x</button>';
        str += '<li class="surname">Surname: <input type="text" class="input" readonly value="' + phoneBook[id].surname + '" data-default-value="'+ phoneBook[id].surname +'"></li>';
        str += '<li class="phone">Phone: <input type="text" class="input" readonly value="' + phoneBook[id].phone + '" data-default-value="'+ phoneBook[id].phone +'"></li>';
        str += '<li class="email">Email: <input type="text" class="input" readonly value="' + phoneBook[id].email + '" data-default-value="'+ phoneBook[id].email +'"></li>';
        str += '<button class="btn js-delete-contact" data-id="' + id + '">Delete</button>';
        str += '<button class="btn js-change-info-contact" data-id="' + id + '">Change</button>';
        str += '<button class="btn js-change-save-info-contact" style="display: none" data-id="' + id + '">Save</button>';
        str += '<button class="btn js-change-cancel-info-contact" style="display: none" data-id="' + id + '">Cancel</button>';
        str += '</ul>';
        oneEntryInfo.innerHTML += str;

        var arrayInput = addBookDiv.querySelectorAll('.input');
        handleInput(arrayInput[0], arrRegExpName[0]);
        handleInput(arrayInput[1], arrRegExpName[0]);
        handleInput(arrayInput[2], arrRegExpName[1]);
        handleInput(arrayInput[3], arrRegExpName[2]);
    }
    function closeOpenedContactInfo() {
        var oneEntryInfo = addBookDiv.querySelector('.js-info-about-contact');
            oneEntryInfo.innerHTML = "";
    }
    function changeInfoContact() {
        addBookDiv.querySelector('.js-change-save-info-contact').style.display = "block";
        addBookDiv.querySelector('.js-change-info-contact').style.display = "none";
        addBookDiv.querySelector('.js-change-cancel-info-contact').style.display = "block";

            var inputsInfoContact = addBookDiv.querySelectorAll('.input');
            for (var i = 0; i<inputsInfoContact.length; i++){
                inputsInfoContact[i].removeAttribute('readonly');
            }
    }
    function changeSaveInfoContact(id) {
        var inputsInfoContact = addBookDiv.querySelectorAll('.input');
        for (var i = 0; i<inputsInfoContact.length; i++){
            if(inputsInfoContact[i].value == "" || inputsInfoContact[i].classList.contains('invalid')){
                return false
            }
        }
        addBookDiv.querySelector('.js-change-save-info-contact').style.display = "none";
        addBookDiv.querySelector('.js-change-info-contact').style.display = "none";
        addBookDiv.querySelector('.js-change-cancel-info-contact').style.display = "block";

        for (var i = 0; i<inputsInfoContact.length; i++){
            inputsInfoContact[i].setAttribute('readonly', "");
            inputsInfoContact[i].setAttribute('data-default-value', inputsInfoContact[i].value);
        }
        phoneBook[id].name = inputsInfoContact[0].value;
        phoneBook[id].surname = inputsInfoContact[1].value;
        phoneBook[id].phone = inputsInfoContact[2].value;
        phoneBook[id].email = inputsInfoContact[3].value;
        localStorage['addBook'] = JSON.stringify(phoneBook);
        showPhoneBook();
    }
    function changeCancelInfoContact() {
        addBookDiv.querySelector('.js-change-save-info-contact').style.display = "none";
        addBookDiv.querySelector('.js-change-info-contact').style.display = "block";
        addBookDiv.querySelector('.js-change-cancel-info-contact').style.display = "none";

        var inputsInfoContact = addBookDiv.querySelectorAll('.input');
        for (var i = 0; i<inputsInfoContact.length; i++){
            inputsInfoContact[i].setAttribute('readonly', "");
            inputsInfoContact[i].classList.remove('valid');
            inputsInfoContact[i].classList.remove('invalid');
            inputsInfoContact[i].value = inputsInfoContact[i].getAttribute('data-default-value');
        }
    }

    function showPhoneBook(){
        if(localStorage['addBook'] === undefined){
            localStorage['addBook'] = "[]";
        } else {
            phoneBook = JSON.parse(localStorage['addBook']);
            addBookDiv.innerHTML = '';
            for (var n in phoneBook){
                var str = '<ul class="entryOne" data-id="' + n + '">';
                str += '<li class="name"><a href="#" data-id="'+n+'"  class="js-open-contact-info">' + phoneBook[n].name + '</a></li>';
                str += '<li class="surname"><a href="#" data-id="'+n+'"  class="js-open-contact-info">' + phoneBook[n].surname + '</a></li>';
                str += '</ul>';
                addBookDiv.innerHTML += str;
            }
        }
    }
    showPhoneBook();
};