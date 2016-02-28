function buildSections(container, data) {
    if (!data.length) {
        return;
    }

    var sections = data;

    container.innerHTML = '';

    sections.forEach(function (section, index) {
        var sectionElement = document.createElement('div');
        var sectionTitle = document.createElement('h2');
        var sectionDesc = document.createElement('p');

        sectionElement.className = 'sections__item';
        sectionTitle.className = 'sections__title';
        sectionDesc.className = 'sections__description';


        sectionTitle.textContent = section.title;
        sectionDesc.textContent = section.description;
        sectionTitle.dataset.todoId = index + 1;

        function onSectionTitleClick(e) {
            e.target.classList.toggle("sections__title_open");
        }

        sectionTitle.addEventListener('click', onSectionTitleClick);

        sectionElement.appendChild(sectionTitle);
        sectionElement.appendChild(sectionDesc);
        container.appendChild(sectionElement);
    });

    return container;
}

function setData(data) {
    localStorage.setItem('todo', JSON.stringify(data));
}

function getData(name) {
    var json = JSON.parse(localStorage.getItem(name));
    return json ? json : []
}

function removeData() {
    localStorage.clear();
    console.log(getData('todo'));
}

function buildEmptyList() {
    var container = document.querySelector('.sections');
    var tmp = '<div class="empty">' +
        '<h2 class="empty__title">ToDo List is empty</h2>' +
        '<button class="button">Add ToDo</button>' +
        '</div>';
    container.innerHTML = tmp;
}

function main() {
    var container = document.querySelector('.sections');
    var input = document.querySelector('.form__input');
    var textarea = document.querySelector('.form__textarea');
    var removeButton = document.querySelector('.button');
    var button = document.querySelector('.form__button');

    button.addEventListener('click', function () {
        var data = getData('todo');
        var todo = {
            status:'active'
        };
        var title = input.value;
        var desc = textarea.value;
        var gender = document.querySelector('.form__radio-input:checked').value;

        todo.title = title ? title :'--';
        todo.description = desc ? desc :'--';
        todo.gender = gender;

        data.unshift(todo);

        input.value = '';
        textarea.value = '';

        setData(data);

        buildSections(container, data);
    });

    removeButton.addEventListener('click', function () {
        removeData();
        buildEmptyList();
    });

    buildSections(container, getData('todo'));

}

main();

