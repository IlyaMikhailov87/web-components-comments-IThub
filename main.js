// функция смены темы (Дайте возможность изменять цвета и стили через пользовательские свойства.)
function changeTheme(color) {
    document.documentElement.style.setProperty('--bg-color', color);
    if (color == 'black') { document.documentElement.style.setProperty('--color', 'white') }
    else { document.documentElement.style.setProperty('--color', 'black') };
}

//обработка кликов кнопок like
function like(event) {
    event.target.disabled = true;
}
