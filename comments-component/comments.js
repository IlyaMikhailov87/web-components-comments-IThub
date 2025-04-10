// определение класса для нашего пользовательского компонента (Реализуйте пользовательский элемент "комментарий" с использованием Custom Elements API)
class CommentComponent extends HTMLElement {
    constructor() {
        super();

        // создаем теневое дерево (Внедрите Shadow DOM в компонент для обеспечения изоляции стилей и функциональности)
        this.attachShadow({ mode: 'open' });

        // получаем шаблон comment-template
        const instance = document.getElementById('comment-template').content.cloneNode(true);

        // добавляем содержимое шаблона в теневое дерево
        this.shadowRoot.appendChild(instance);

        // сохраняем ссылки на элементы
        this._replyForm = this.shadowRoot.querySelector('form');
        this._repliesList = this.shadowRoot.querySelector('.replies');
        this._sendReplyButton = this.shadowRoot.querySelector('.sendreply');
        this._replyButton = this.shadowRoot.querySelector('.reply');
        this._likeButton = this.shadowRoot.querySelector('button[onclick="like(event)"]');
        this._deleteButton = this.shadowRoot.querySelector('.delete');

        // вешаем обработчики событий на кнопки
        this._sendReplyButton.addEventListener('click', () => this.sendreply());
        // кнопка ответить добавляет вложенный комментарий в виде пользовательского элемента (Покажите, как этот элемент может быть повторно использован для разных комментариев)
        this._replyButton.addEventListener('click', () => addComments(this._repliesList, author()));
        this._deleteButton.addEventListener('click', () => this.deleteComment());
    }

    //метод, вызываемый при добавлении элемента в документ
    connectedCallback() {
        const replyButton = this._replyButton;
        const sendReplyButton = this._sendReplyButton;
        const replyForm = this._replyForm;
        // проверка ввода текста комментария и разблокировка кнопки отправки
        replyForm.addEventListener('input', function (event) {
            if (event.target.value.trim() !== '') {
                sendReplyButton.disabled = false;
            } else {
                sendReplyButton.disabled = true;
            }
        })
    }

    //метод добавления текста написанного комментария
    sendreply() {
        const commentText = this._replyForm.querySelector('textarea').value;
        this.shadowRoot.getElementById('message').innerHTML = commentText;
        this._replyForm.style.display = 'none';
        this._sendReplyButton.style.display = 'none';
        this._replyButton.style.display = 'inline-block';
        this._likeButton.style.display = 'inline-block';
    }

    disconnectedCallback() { console.log('Комментарий без вложенных комментариев-потомков удален из DOM') };

    //метод удаления комментария
    deleteComment() {
        //если нет вложенных комментариев-потомков, удаляем элемент целиком из DOM
        if (this.shadowRoot.querySelector('comment-component') === null) {
            this.remove();
        }
        //если есть вложенные комментарии-потомков, удаляем только текст сообщения и кнопки
        else {
            const form = this.shadowRoot.querySelector('form');
            this._likeButton.remove();
            this._replyButton.remove();
            this._deleteButton.remove();
            this.shadowRoot.getElementById('message').parentElement.innerHTML = 'Сообщение удалено'
        }
    }
}

//регистрация нового пользовательского элемента
customElements.define('comment-component', CommentComponent);

//Определение автора
function author() {
    const names = ['Иван', 'Петр', 'Павел'];
    const surnames = ['Иванов', 'Петров', 'Павлов'];
    const authorName = names[Math.floor(Math.random() * names.length)];
    const authorSurname = surnames[Math.floor(Math.random() * surnames.length)];
    return { authorName, authorSurname }
}

//инициируем добавление корневого комментария к посту по клику кнопки Добавить комментарий'
const comments = document.getElementById('comments');
document.getElementById('addcomment').addEventListener('click', function () {
    addComments(comments, author())
});

//добавление пользовательского элемента комментариев
function addComments(parent, author) {
    const el = document.createElement('comment-component');
    el.innerHTML += `<span slot="author">${author.authorName} </span>`
    el.innerHTML += `<span slot="author">${author.authorSurname}</span>`
    parent.appendChild(el);
}