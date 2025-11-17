document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("bookForm").addEventListener("submit", function(event) {
      event.preventDefault();
      
      const title = document.getElementById("bookFormTitle").value;
      const author = document.getElementById("bookFormAuthor").value;
      const year = parseInt(document.getElementById("bookFormYear").value);
      const isComplete = document.getElementById("bookFormIsComplete").checked;
      
      const newBook = {
        id: new Date().getTime(), 
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
      };
      
      let books = JSON.parse(localStorage.getItem("books")) || [];
      books.push(newBook);
      localStorage.setItem("books", JSON.stringify(books));
      
      renderBooks(); 
    });
  
 
    function renderBooks() {
      const books = JSON.parse(localStorage.getItem("books")) || [];
      const incompleteBookList = document.getElementById("incompleteBookList");
      const completeBookList = document.getElementById("completeBookList");
      
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
      
      books.forEach(book => {
        const bookItem = createBookItem(book);
        
        if (book.isComplete) {
          completeBookList.appendChild(bookItem);
        } else {
          incompleteBookList.appendChild(bookItem);
        }
      });
    }


    function createBookItem(book) {
      const bookItem = document.createElement("div");
      bookItem.setAttribute("data-bookid", book.id);
      bookItem.setAttribute("data-testid", "bookItem");
      
      const title = document.createElement("h3");
      title.setAttribute("data-testid", "bookItemTitle");
      title.textContent = book.title;
      
      const author = document.createElement("p");
      author.setAttribute("data-testid", "bookItemAuthor");
      author.textContent = `Penulis: ${book.author}`;
      
      const year = document.createElement("p");
      year.setAttribute("data-testid", "bookItemYear");
      year.textContent = `Tahun: ${book.year}`;
      
      const bookId = document.createElement("p");
      bookId.textContent = `ID Buku: ${book.id}`;  

      const buttons = createBookButtons(book);
      
      bookItem.appendChild(title);
      bookItem.appendChild(author);
      bookItem.appendChild(year);
      bookItem.appendChild(bookId);  
      bookItem.appendChild(buttons);
      
      return bookItem;
    }


    function createBookButtons(book) {
      const buttons = document.createElement("div");
      
      const completeButton = document.createElement("button");
      completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");
      completeButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
      completeButton.addEventListener("click", () => toggleComplete(book.id));
      
      const deleteButton = document.createElement("button");
      deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
      deleteButton.textContent = "Hapus Buku";
      deleteButton.addEventListener("click", () => deleteBook(book.id));
      
      buttons.appendChild(completeButton);
      buttons.appendChild(deleteButton);
      
      return buttons;
    }
  
 
    function toggleComplete(bookId) {
      const books = JSON.parse(localStorage.getItem("books")) || [];
      const book = books.find(book => book.id === bookId);
      if (book) {
        book.isComplete = !book.isComplete;
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks(); 
      }
    }
  
    function deleteBook(bookId) {
      let books = JSON.parse(localStorage.getItem("books")) || [];
      books = books.filter(book => book.id !== bookId);
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks(); 
    }
  
    
    document.getElementById('searchBook').addEventListener('submit', function(event) {
      event.preventDefault();
      const searchQuery = document.getElementById('searchBookTitle').value.toLowerCase();
    
      const books = document.querySelectorAll('[data-testid="bookItem"]');
      books.forEach(book => {
        const title = book.querySelector('[data-testid="bookItemTitle"]').textContent.toLowerCase();
        book.style.display = title.includes(searchQuery) ? 'block' : 'none';  
      });
    });
  
    
    document.querySelectorAll('[data-testid="bookItemEditButton"]').forEach(button => {
      button.addEventListener('click', function() {
        const bookItem = this.closest('[data-testid="bookItem"]');
        const bookId = bookItem.getAttribute('data-bookid');
        const title = bookItem.querySelector('[data-testid="bookItemTitle"]').textContent;
        const author = bookItem.querySelector('[data-testid="bookItemAuthor"]').textContent.replace('Penulis: ', '');
        const year = bookItem.querySelector('[data-testid="bookItemYear"]').textContent.replace('Tahun: ', '');
        
       
        document.getElementById('bookFormTitle').value = title;
        document.getElementById('bookFormAuthor').value = author;
        document.getElementById('bookFormYear').value = year;
        
       
        const submitButton = document.getElementById('bookFormSubmit');
        submitButton.textContent = 'Simpan Perubahan';
        
        submitButton.onclick = function() {
          const updatedBook = {
            id: bookId,
            title: document.getElementById('bookFormTitle').value,
            author: document.getElementById('bookFormAuthor').value,
            year: parseInt(document.getElementById('bookFormYear').value),
            isComplete: document.getElementById('bookFormIsComplete').checked
          };
          
          updateBookInLocalStorage(updatedBook);
        };
      });
    });
 
    function updateBookInLocalStorage(updatedBook) {
      let books = JSON.parse(localStorage.getItem("books")) || [];
      books = books.map(book => book.id === updatedBook.id ? updatedBook : book);
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks();
    }
  
    renderBooks();
});
