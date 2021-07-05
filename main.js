'use strict';

// localStorage.clear();
// get forms
let form1 = document.forms.form1;
let form2 = document.forms.form2;

let usersList = [];

// click functions for links
document.getElementById('toSignin').onclick = () => {
    document.querySelector('.block_signup').classList.add('hide');
    document.querySelector('.block_signin').classList.remove('hide');
}
document.getElementById('toSignup').onclick = () => {
    document.querySelector('.block_signin').classList.add('hide');
    document.querySelector('.block_signup').classList.remove('hide');
    document.getElementById('modal_empty').classList.add('hide');
    document.getElementById('modal_incorrect').classList.add('hide');
}

// functions for inputs
for(let i = 0; i < document.forms.length; i++) {
    for(let j = 0; j < document.forms[i].length - 1; j++) {
        document.forms[i][j].addEventListener('input', changeField);
    }
}

function changeField(event) {
    event.target.classList.add('block__input_write');
    event.target.previousElementSibling.classList.add('block__placeholder_write');
}

// check input field
function checkForm1(event) {
    if( inputValid(form1.fname, /^[a-zA-Z]{4,16}$/) &&
        inputValid(form1.lname, /^[a-zA-Z]{4,16}$/) && 
        inputValid(form1.email, /^[a-z0-9_\-.]+@[a-z.]+\.[a-z]+$/) &&
        inputValid(form1.password, /^[\w_\-.]{4,16}$/) ) {
        getUsers();
        if(checkEmail()) {
            addUser();
            location.reload()
        }
    }
}

function inputValid(input, regExp) {
    if(regExp.test(input.value)) {
        input.parentElement.classList.add('valid');
        input.parentElement.classList.remove('invalid');
        return true;
    }
    else {
        input.parentElement.classList.add('invalid');
        input.parentElement.classList.remove('valid');
        input.addEventListener('input', checkField);
        return false;
    }
}

function checkField() {
    let regExp = this.type == 'email' ? /^[a-z0-9_\-.]+@[a-z.]+\.[a-z]+$/ :
        this.type == 'password' ? /^[\w_\-.]{4,16}$/ : /^[a-zA-Z]{4,16}$/;
        if(regExp.test(this.value)) {
            this.parentElement.classList.add('valid');
            this.parentElement.classList.remove('invalid');
            this.removeEventListener('input', checkField);
        }
}

// click functions for buttons
form1.signup.onclick = checkForm1;
form2.signin.onclick = checkForm2;
document.getElementById('btn_user').onclick = () => {
    document.querySelector('.block_profile').classList.add('hide');
    document.querySelector('.block_signin').classList.remove('hide');
}

// sign up
function addUser() {
    let newUser = {};
    newUser.fname = form1.fname.value;
    newUser.lname = form1.lname.value;
    newUser.email = form1.email.value;
    newUser.password = form1.password.value;
    localStorage.setItem(localStorage.length, JSON.stringify(newUser));
}
function getUsers() {
    usersList = [];
    for(let i = 0; i < localStorage.length; i++) {
        let user = JSON.parse(localStorage.getItem(i));
        usersList.push(user);
    }
}

function checkEmail() {
    for(let i = 0; i < usersList.length; i++) {
        if(form1.email.value === usersList[i].email) {
            form1.email.parentElement.classList.add('invalid');
            form1.email.parentElement.classList.remove('valid');
            document.getElementById('modal_exist').classList.remove('hide');
            form1.email.addEventListener('input', checkChangeEmail);
            return false;
        }
    }
    return true;
}

function checkChangeEmail() {
    for(let i = 0; i < usersList.length; i++) {
        if(form1.email.value === usersList[i].email) {
            return;
        }
    }
    form1.email.parentElement.classList.add('valid');
    form1.email.parentElement.classList.remove('invalid');
    document.getElementById('modal_exist').classList.add('hide');
    form1.email.removeEventListener('input', checkChangeEmail);
}

// sign in
function checkForm2() {
    if(!localStorage.length) {
        document.getElementById('modal_empty').classList.remove('hide');
        return;
    }
    getUsers();
    for(let i = 0; i < usersList.length; i++) {
        if(form2.email.value === usersList[i].email && 
            form2.password.value === usersList[i].password) {
            document.getElementById('userName').textContent = usersList[i].fname + ' ' + usersList[i].lname;
            document.getElementById('userEmail').textContent = usersList[i].email;
            userWindow();
            return;
        }
    }
    document.getElementById('modal_incorrect').classList.remove('hide');
}

function userWindow() {
    document.querySelector('.block_signin').classList.add('hide');
    document.querySelector('.block_profile').classList.remove('hide');
    form2.email.value = '';
    form2.password.value = '';
    form2.email.classList.remove('block__input_write');
    form2.email.previousElementSibling.classList.remove('block__placeholder_write');
    form2.password.classList.remove('block__input_write');
    form2.password.previousElementSibling.classList.remove('block__placeholder_write');
}
