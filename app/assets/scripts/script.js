{
    const POPUP_OPEN_CLASS = 'popup_open';
    const SECTION_OPEN_CLASS = 'sections__title_open';
    const SETTINGS_OPEN_CLASS = 'settings_open';
    const SECTION_ITEM_FEMALE_CLASS = 'sections__item_female';
    const SECTION_ITEM_DONE_CLASS = 'sections__item_done';
    const BUTTON_SHOW_CLASS = 'button_show';
    const MAIN_FIELD_NAME = 'todo';
    const KEY_CODE_ESC = 27;
    const KEY_CODE_ENTER = 13;

    document.addEventListener('DOMContentLoaded', function () {
        const containerNode = document.querySelector('.sections');
        const popupNode = document.querySelector('.js-popup');
        const formNode = document.querySelector('.js-form');
        const addBtnNode = document.querySelector('.js-add-todo');
        const inputNode = document.querySelector('.form__input');
        const textareaNode = document.querySelector('.form__textarea');
        let isPopupOpen = false;
        let editableItemId = null;

        main();

        /**
         * Открывает/закрывает попап, очищает форму при закрытие
         *
         * @param {boolean} isOpen
         */
        function togglePopup(isOpen) {
            popupNode.classList.toggle(POPUP_OPEN_CLASS, isOpen);
            isPopupOpen = isOpen;
            if (!isOpen) {
                addBtnNode.blur();
                formNode.reset();
            }
        }

        /**
         * Скрывает/показыват кнопку подачи
         *
         * @param {boolean} isShow
         */
        function toggleAddBtn(isShow) {
            addBtnNode.classList.toggle(BUTTON_SHOW_CLASS, isShow)
        }

        /**
         * Строит секции из списка тудушек
         *
         * @param {HTMLElement} node
         * @param {Object} data
         * @returns {*}
         */
        function buildSections(node, data) {
            if (!data.length) {
                renderAddButton();
                return;
            }

            node.innerHTML = '';

            toggleAddBtn(true);

            data.forEach(function (section) {
                const sectionElement = document.createElement('div');
                const sectionTitle = document.createElement('h2');
                const sectionDesc = document.createElement('p');
                const sectionClose = document.createElement('div');
                const settingsElement = document.createElement('div');
                const settingsIcon = document.createElement('i');
                const settingsList = document.createElement('ul');

                sectionElement.className = 'sections__item';
                sectionTitle.className = 'sections__title';
                sectionDesc.className = 'sections__description';
                sectionClose.className = 'sections__close';
                settingsElement.className = 'settings js-settings';
                settingsIcon.className = 'settings__icon fa fa-cog js-settings-icon';
                settingsList.className = 'settings__list';

                sectionTitle.textContent = section.title;
                sectionDesc.textContent = section.description;
                sectionTitle.dataset.todoId = section.id + 1;
                sectionElement.classList.toggle(SECTION_ITEM_FEMALE_CLASS, section.gender === 'female');
                sectionElement.classList.toggle(SECTION_ITEM_DONE_CLASS, section.status === 'done');

                settingsList.innerHTML = `
                    <li class="settings__list-item js-edit">
                        Edit
                    </li>
                    <li class="settings__list-item js-delete">
                        Delete
                    </li>
                    <li class="settings__list-item js-done">
                        Done
                    </li>`;

                settingsElement.appendChild(settingsIcon);
                settingsElement.appendChild(settingsList);
                sectionClose.appendChild(settingsElement);
                sectionElement.appendChild(sectionClose);
                sectionElement.appendChild(sectionTitle);
                sectionElement.appendChild(sectionDesc);
                node.appendChild(sectionElement);

                sectionTitle.addEventListener('click', event => event.target.classList.toggle(SECTION_OPEN_CLASS));
                settingsIcon.addEventListener('click', event => event.target.closest('.js-settings').classList.toggle(SETTINGS_OPEN_CLASS));
                settingsElement.querySelector('.js-edit').addEventListener('click', () => editItem(section.id));
                settingsElement.querySelector('.js-delete').addEventListener('click', () => deleteItem(section.id));
                settingsElement.querySelector('.js-done').addEventListener('click', () => closeItem(section.id));
            });

            return node;
        }

        /**
         * Редактирует тудушку по id
         *
         * @param {number} id
         */
        function editItem(id) {
            const item = getData(MAIN_FIELD_NAME).filter(item => item.id === id)[0];
            inputNode.value = item.title;
            textareaNode.value = item.description;
            if (item.gender === 'female') {
                document.querySelector('#female.form__radio-input').checked = true;
            }
            editableItemId = id;
            togglePopup(true);
        }

        /**
         * Удаляет тудушку по id
         *
         * @param {number} id
         */
        function deleteItem(id) {
            const filteredData = getData(MAIN_FIELD_NAME).filter(item => item.id !== id);

            setData(MAIN_FIELD_NAME, filteredData);
            buildSections(containerNode, filteredData);
        }

        /**
         * Закрывает тудушку по id
         *
         * @param {number} id
         */
        function closeItem(id) {
            const changedData = getData(MAIN_FIELD_NAME).map((item) => {
                if (item.id === id) {
                    item.status = 'done';
                }
                return item;
            });
            setData(MAIN_FIELD_NAME, changedData);
            buildSections(containerNode, changedData);
        }

        /**
         * Сохроняет данные в localStorage
         *
         * @param {string} name
         * @param {Object} data
         */
        function setData(name, data) {
            localStorage.setItem(name, JSON.stringify(data));
        }

        /**
         * Запрашивает данные из localStorage
         *
         * @param {string} name
         * @returns {Array}
         */
        function getData(name) {
            const json = JSON.parse(localStorage.getItem(name));
            return json ? json : []
        }

        /**
         * Очищает данные из localStorage
         *
         */
        function removeData() {
            localStorage.clear();
            console.log(getData(MAIN_FIELD_NAME));
        }

        /**
         * Рендерит кнопку подачи, если нет тудушек
         *
         */
        function renderAddButton() {
            const tmp = '<div class="empty">' +
                '<h2 class="empty__title">ToDo List is empty</h2>' +
                '<button class="button js-add-todo"><i class="fa fa-plus"></i>Add ToDo</button>' +
                '</div>';
            containerNode.innerHTML = tmp;

            document.querySelector('.js-add-todo').addEventListener('click', () => togglePopup(true));
            toggleAddBtn(false);
        }

        /**
         * Слушаем горячии клавиши
         *
         * @param {Object} event
         */
        function handleKeyDown(event) {
            if (!isPopupOpen) {
                return;
            }

            switch (event.keyCode) {
                case KEY_CODE_ESC:
                    togglePopup(false);
                    break;
                case KEY_CODE_ENTER:
                    submitToDo();
                    break;
            }
        }

        /**
         * Добавляет тудушку
         *
         */
        function submitToDo() {
            const data = getData(MAIN_FIELD_NAME);
            const todo = {
                status:'active'
            };
            const title = inputNode.value;
            const desc = textareaNode.value;
            const gender = document.querySelector('.form__radio-input:checked').value;

            todo.title = title ? title :'--';
            todo.description = desc ? desc :'--';
            todo.gender = gender;
            todo.id = data.length;

            if (editableItemId) {
                data.forEach((item, index) => {
                    if (item.id === editableItemId) {
                        data[index] = todo;
                    }
                });
                editableItemId = null;
            } else {
                data.unshift(todo);
            }

            setData(MAIN_FIELD_NAME, data);
            togglePopup(false);
            buildSections(containerNode, data);
        }

        function main() {
            const removeButtonNode = document.querySelector('.button');
            const formButtonNode = document.querySelector('.form__button');
            const closeButtonNode = document.querySelector('.js-close-popup');

            addBtnNode.addEventListener('click', () => togglePopup(true));
            formButtonNode.addEventListener('click', submitToDo);
            document.addEventListener('keydown', handleKeyDown);
            closeButtonNode.addEventListener('click', () => togglePopup(false));
            removeButtonNode.addEventListener('click', () => {
                removeData();
                renderAddButton();
            });

            buildSections(containerNode, getData(MAIN_FIELD_NAME));
            console.log(getData(MAIN_FIELD_NAME));
        }
    });
}