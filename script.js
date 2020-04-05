var moment = require('moment');

class Book {
    constructor(title, author, pages) {
        this.title = title
        this.author = author
        this.pages = pages
        this.hasRead = false
        this.info = function () {
            if (this.hasRead) {
                return `${title} by ${author}, ${pages} pages, you have read.`
            }
            else {
                return `${title} by ${author}, ${pages} pages, not read yet.`
            }
        }
    }
}

let theLibrary = [];
let bagel = "bagel";
function addBookToLibrary(title, author, pages) {
    let book = new Book(title, author, pages);
    theLibrary.push(book);
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function setLocalStorage(){
    if (storageAvailable('localStorage')) {
        localStorage.setItem("books", JSON.stringify(theLibrary));
    }
    else {
        addBookToLibrary("The Hobbit", "J.R.R Tolkien", 295);
        addBookToLibrary("Holes", "Louis Sachar", 240);
        addBookToLibrary("A Game of Thrones", "George R.R. Martin", 694);
    }
}

function getLocalStorage(){
    if (storageAvailable('localStorage')) {
        if("books" in localStorage){
            theLibrary = JSON.parse(localStorage.getItem("books"));
         } else {
            addBookToLibrary("The Hobbit", "J.R.R Tolkien", 295);
            addBookToLibrary("Holes", "Louis Sachar", 240);
            addBookToLibrary("A Game of Thrones", "George R.R. Martin", 694);
         }
        
    } else {
        addBookToLibrary("The Hobbit", "J.R.R Tolkien", 295);
        addBookToLibrary("Holes", "Louis Sachar", 240);
        addBookToLibrary("A Game of Thrones", "George R.R. Martin", 694);
    }
}
getLocalStorage();

let shelves = document.querySelector('#theLibrary');
function displayLibrary() {
    if(document.querySelector('table') !== null){
        let table = document.querySelector('table');
        table.remove();
    }
    let libraryContainer = document.createElement('table');
    let libraryHeader = document.createElement('tr');
    let titleHeader = document.createElement('th');
    titleHeader.className = "tableheader";
    titleHeader.textContent = "Title";
    libraryHeader.appendChild(titleHeader);

    let authorHeader = document.createElement('th');
    authorHeader.className = "tableheader";
    authorHeader.textContent = "Author";
    libraryHeader.appendChild(authorHeader);

    let pagesHeader = document.createElement('th');
    pagesHeader.className = "tableheader";
    pagesHeader.textContent = "Pages";
    libraryHeader.appendChild(pagesHeader);

    let readHeader = document.createElement('th');
    readHeader.className = "tableheader";
    readHeader.textContent = "Read";
    libraryHeader.appendChild(readHeader);

    let changeHeader = document.createElement('th');
    changeHeader.className = "tableheader";
    changeHeader.textContent = "Change Status";
    libraryHeader.appendChild(changeHeader);

    let removeHeader = document.createElement('th');
    removeHeader.className = "tableheader";
    removeHeader.textContent = "Remove Book";
    libraryHeader.appendChild(removeHeader);

    libraryContainer.appendChild(libraryHeader);

    theLibrary.forEach(function (book, index) {
        let placeBook = document.createElement('tr');
    
        let titleData = document.createElement('td');
        titleData.className = "book-title tabledata";
        titleData.textContent = book.title;
        placeBook.appendChild(titleData);
    
        let authorData = document.createElement('td');
        authorData.className = "book-author tabledata";
        authorData.textContent = book.author;
        placeBook.appendChild(authorData);
    
        let pageData = document.createElement('td');
        pageData.className = "book-pages tabledata";
        pageData.textContent = book.pages;
        placeBook.appendChild(pageData);

        let readData = document.createElement('td');
        readData.className = "book-read-status tabledata";
        readData.textContent = book.hasRead;
        placeBook.appendChild(readData);

        let changeReadStatus = document.createElement('td');
        let changeReadButton = document.createElement('button');
        changeReadButton.className = "changeReadStatus tabledata";
        changeReadButton.id = `changeReadStatus${index}`;
        changeReadButton.textContent = "Read";
        changeReadStatus.appendChild(changeReadButton);
        placeBook.appendChild(changeReadStatus);

        let removeTd = document.createElement('td');
        let removeButton = document.createElement('button');
        removeButton.className = "removeMe tabledata";
        removeButton.id = `remove${index}`;
        removeButton.textContent = "Remove Me";
        removeTd.appendChild(removeButton);
        placeBook.appendChild(removeTd);
    
        libraryContainer.appendChild(placeBook);
    });
    shelves.appendChild(libraryContainer);
    addEvents();
}
displayLibrary();


let addBookButton = document.querySelector('#addBook');
addBookButton.addEventListener('click', function() {
    if(document.querySelector('.error') !== null){
        let error = document.querySelector('.error');
        error.remove();
    }
    let newTitle = document.getElementById('title').value;
    let newAuthor = document.getElementById('author').value;
    let newPages = document.getElementById('pages').value;

    if( newTitle !== null && newAuthor !== null && newPages !== null) {
        addBookToLibrary(newTitle, newAuthor, newPages);
        displayLibrary();
        setLocalStorage();
        document.getElementById('title').value = "";
        document.getElementById('author').value = "";
        document.getElementById('pages').value = "";
    } else {
        let addBookContainer = document.querySelector('#addABookContainer');
        let errorMessage = document.createElement('p');
        errorMessage.className = 'error';
        errorMessage.textContent = "Please provide a title, author, and page amount to add a new book.";
        addBookContainer.appendChild(errorMessage);
    }
})

function addEvents() {
    let removeEventButton = document.querySelectorAll('.removeMe');
    removeEventButton.forEach( function(rmvbtn){
        rmvbtn.addEventListener('click', function(e) {
            let removeIdForArray = e.target.id;
            let indexNumber = parseInt(removeIdForArray.charAt(removeIdForArray.length-1));
            theLibrary.splice(indexNumber, 1);
            displayLibrary();
            setLocalStorage();
        })
    })

    let changeReadStatusEventButton = document.querySelectorAll('.changeReadStatus');
    changeReadStatusEventButton.forEach( function(chngbtn){
        chngbtn.addEventListener('click', function(e) {
            let changeIdForArray = e.target.id;
            let indexNumber = parseInt(changeIdForArray.charAt(changeIdForArray.length-1));
            if(theLibrary[indexNumber].hasRead){
                theLibrary[indexNumber].hasRead = false;
            } else {
                theLibrary[indexNumber].hasRead = true;
            }
            
            displayLibrary();
            setLocalStorage();
        })
    })
}
