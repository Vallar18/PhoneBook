window.onload = function (){
    var quickAddBtn = document.querySelectorAll(".js-quick-add");
    var AddBtn = document.querySelector(".js-add-contact");
    var cancelButtons = document.querySelectorAll(".js-cancel-add-contact");
    var formReset = document.querySelector(".js-form-reset");
    var quickAddFormDiv = document.querySelector(".js-quick-add-form");
    var searchInput = document.querySelector('.js-input-search');
    var clearSearchBtn = document.querySelector('.clear-search');
    var emptyContact = document.querySelector('.empty-contact');

    var arrRegExpName = [/^[а-яА-ЯёЁa-zA-Z]+$/,
        /^\d{9,12}\d$/,
        /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/
    ];
    var name = document.getElementById("name");
    var surname = document.getElementById("surname");
    var phone = document.getElementById("phone");
    var email = document.getElementById("email");

    var addBookDiv = document.querySelector(".addBook");

    var phoneBook = [];

    for (var i = 0; i<quickAddBtn.length; i++){
        quickAddBtn[i].addEventListener("click", function (){
            quickAddFormDiv.style.display = "flex";
            // addBookDiv.querySelectorAll('.circles').style.display = "none";
        });
    }

    var emptyLocalStorage = localStorage['addBook'] === "[]";
    if(emptyLocalStorage){
        emptyContact.style.display = "flex";
    } else if (!emptyLocalStorage){
        emptyContact.style.display = "none";
    }

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
        var input = document.querySelector('.js-input-search');
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
        if  (name.value == '') {
            alert('Name не заполнено');
        }
        else if (surname.value == '') {
            alert('Surname не заполнено');
        }
        else if (phone.value == '') {
            alert('Phone не заполнено');
        }
        else if (email.value == '') {
            alert('Email не заполнено');
        }
        else if (document.querySelectorAll(".invalid").length){
            alert('Проверте введенные данные');
            return false;
        }
        if(isNull){
            var obj = new jsonStructure(name.value,surname.value,phone.value,email.value);
            phoneBook.push(obj);
            localStorage['addBook'] = JSON.stringify(phoneBook);
            quickAddFormDiv.style.display = "none";
            clearForm();
            showPhoneBook();
            window.location.reload();
        }
    }

    function clearForm() {
        var frm = document.querySelectorAll(".js-form-fields");
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
        }else if(e.target.classList.contains('js-show-delete-btn')) {
            showDeleteBtn(entryId)
        }else if(e.target.classList.contains('js-hide-delete-btn')){
            hideDeleteBtn(entryId)
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
            var confirmRemove = confirm('Удалить контакт ' + phoneBook[id].name + " " + phoneBook[id].surname + "?");
            if (phoneBook[id] && confirmRemove){
                phoneBook.splice(id, 1);
                localStorage['addBook'] = JSON.stringify(phoneBook);
                showPhoneBook();
                window.location.reload();
            }else{
                showPhoneBook();
            }
        }
    function showDeleteBtn() {
        addBookDiv.querySelector('.js-delete-contact').style.display = "block";
        addBookDiv.querySelector('.js-hide-delete-btn').style.display = "block";
        addBookDiv.querySelector('.circles').style.display = "none";
    }
    function hideDeleteBtn() {
        addBookDiv.querySelector('.js-delete-contact').style.display = "none";
        addBookDiv.querySelector('.js-hide-delete-btn').style.display = "none";
        addBookDiv.querySelector('.circles').style.display = "block";
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
        str += '<button class="js-cancel-info-block">+</button>';
        str += '<li class="surname">Surname: <input type="text" class="input" readonly value="' + phoneBook[id].surname + '" data-default-value="'+ phoneBook[id].surname +'"></li>';
        str += '<li class="phone">Phone: <input type="text" class="input" readonly value="' + phoneBook[id].phone + '" data-default-value="'+ phoneBook[id].phone +'"></li>';
        str += '<li class="email">Email: <input type="text" class="input" readonly value="' + phoneBook[id].email + '" data-default-value="'+ phoneBook[id].email +'"></li>';
        str += '<button class="btn js-btn js-delete-contact" data-id="' + id + '">Delete</button>';
        str += '<button class="btn js-btn js-change-info-contact" data-id="' + id + '">Change</button>';
        str += '<button class="btn js-btn js-change-save-info-contact" style="display: none" data-id="' + id + '">Save</button>';
        str += '<button class="btn js-btn js-change-cancel-info-contact" style="display: none" data-id="' + id + '">Cancel</button>';
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
                var str = '<ul class="entryOne data-id="' + n + '">';
                str += '<li class="name"><a href="#" data-id="'+n+'" class="js-open-contact-info">' + phoneBook[n].name + '</a></li>';
                str += '<li class="surname"><a href="#" data-id="'+n+'" class="js-open-contact-info">' + phoneBook[n].surname + '</a></li>';
                str += '<button class="delete-contact-btn js-delete-contact" style="display: none" data-id="' + n + '">Delete</button>';
                str += '<button class="hide-delete-btn js-hide-delete-btn" style="display: none" data-id="' + n + '">Hide</button>';
                str += '</ul>';
                addBookDiv.innerHTML += str;
            }
        }
    }
    showPhoneBook();
};