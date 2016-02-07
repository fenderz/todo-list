function buildSections(container, data) {
    if (data === null) {
        return;
    }

    var male = data.male || [];
    var female = data.female || [];
    var sections = male.concat(female);

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
    return json ? json : {male: [],female: []}
}

function removeData() {
    localStorage.clear()
}

function main() {
    var data = getData('todo');

    var container = document.querySelector('.sections');
    var input = document.querySelector('.form__input');
    var textarea = document.querySelector('.form__textarea');
    var removeButton = document.querySelector('.button');
    var button = document.querySelector('.form__button');

    button.addEventListener('click', function (e) {
        var todo = {};
        var title = input.value;
        var desc = textarea.value;
        var gender = document.querySelector('.form__radio-input:checked').value;

        todo.title = title;
        todo.description = desc;
        todo.gender = gender;

        data[gender].push(todo);

        input.value = '';
        textarea.value = '';

        setData(data);

        buildSections(container, data);
    });

    removeButton.addEventListener('click', function () {
        removeData();
        buildSections(container, getData('todo'));
    });

    buildSections(container, getData('todo'));

}

main();

