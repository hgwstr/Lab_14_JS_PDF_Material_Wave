// 1. Функция для сохранения всех редактируемых текстов в localStorage
function saveEditableContent() {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    const data = {};
    editableElements.forEach(el => {
        const field = el.getAttribute('data-field');
        if (field) {
            data[field] = el.innerText;
        }
    });
    localStorage.setItem('resumeData', JSON.stringify(data));
}

// 2. Восстановление сохранённых данных при загрузке страницы
function loadSavedContent() {
    const saved = localStorage.getItem('resumeData');
    if (!saved) return;
    const data = JSON.parse(saved);
    for (const [field, value] of Object.entries(data)) {
        const element = document.querySelector(`[data-field="${field}"]`);
        if (element && element.innerText !== value) {
            element.innerText = value;
        }
    }
}

// 3. Добавление CSS-анимации при изменении содержимого (необязательно, но эффектно)
//    Будем вешать класс 'changed' на 0.3 секунды
function animateChange(element) {
    element.style.transition = 'all 0.2s';
    element.style.backgroundColor = '#fff9c6';
    setTimeout(() => {
        element.style.backgroundColor = '';
    }, 300);
}

// 4. Обработчик события 'input' (текст меняется) – сохраняем и анимируем
function setupEditableListeners() {
    const editables = document.querySelectorAll('[contenteditable="true"]');
    editables.forEach(el => {
        el.addEventListener('input', function(e) {
            saveEditableContent();
            animateChange(this);
        });
    });
}

// 5. Material Wave (ripple) эффект – работает на любом элементе с классом .ripple-btn или по желанию
function addRippleEffect(element) {
    element.addEventListener('click', function(event) {
        // Создаём элемент-волну
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.position = 'absolute';
        element.style.position = 'relative';
        element.appendChild(ripple);
        // Удаляем после анимации
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// 6. Экспорт в PDF с помощью html2pdf
function setupPDFDownload() {
    const button = document.getElementById('downloadPDF');
    const resumeElement = document.getElementById('resume-content');
    button.addEventListener('click', () => {
        // Опции для pdf (можно настроить)
        const opt = {
            margin:        [0.5, 0.5, 0.5, 0.5], // отступы (top, right, bottom, left)
            filename:     'my_resume.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, letterRendering: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        // Вызов библиотеки
        html2pdf().set(opt).from(resumeElement).save();
    });
}

// 7. Инициализация всего при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Восстанавливаем текст из localStorage
    loadSavedContent();
    // Навешиваем слушатели на редактируемые элементы
    setupEditableListeners();
    // Настраиваем кнопку PDF
    setupPDFDownload();
    // Добавляем ripple эффект на все кликабельные элементы:
    const clickableItems = document.querySelectorAll('.ripple-btn, .editable, .block li, .job, .photo img, #downloadPDF');
    clickableItems.forEach(el => addRippleEffect(el));
    
    // Дополнительно: если хотим ripple на всей странице – можно на body, но ограничимся указанными
});