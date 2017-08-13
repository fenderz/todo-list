{
    const POPUP_OPEN_CLASS = 'popup_open';
    const SECTION_OPEN_CLASS = 'sections__title_open';
    const BUTTON_SHOW_CLASS = 'button_show';
    const MAIN_FIELD_NAME = 'todo';

    document.addEventListener('DOMContentLoaded', function () {
        const containerNode = document.querySelector('.sections');
        const popupNode = document.querySelector('.js-popup');
        const addBtnNode = document.querySelector('.js-add-todo');

        main();

        /**
         * Открывает/закрывает попап
         *
         * @param {boolean} isOpen
         */
        function togglePopup(isOpen) {
            popupNode.classList.toggle(POPUP_OPEN_CLASS, isOpen);
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
         * @param {Node} node
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

            data.forEach(function (section, index) {
                const sectionElement = document.createElement('div');
                const sectionTitle = document.createElement('h2');
                const sectionDesc = document.createElement('p');

                sectionElement.className = 'sections__item';
                sectionTitle.className = 'sections__title';
                sectionDesc.className = 'sections__description';


                sectionTitle.textContent = section.title;
                sectionDesc.textContent = section.description;
                sectionTitle.dataset.todoId = index + 1;

                sectionTitle.addEventListener('click', event => event.target.classList.toggle(SECTION_OPEN_CLASS));

                sectionElement.appendChild(sectionTitle);
                sectionElement.appendChild(sectionDesc);
                node.appendChild(sectionElement);
            });

            return node;
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

            document.querySelector('.js-add-todo').addEventListener('click', togglePopup(true));
            toggleAddBtn(false);
        }

        function main() {
            const inputNode = document.querySelector('.form__input');
            const textareaNode = document.querySelector('.form__textarea');
            const removeButtonNode = document.querySelector('.button');
            const formButtonNode = document.querySelector('.form__button');
            const closeButtonNode = document.querySelector('.js-close-popup');

            addBtnNode.addEventListener('click', () => togglePopup(true));

            formButtonNode.addEventListener('click', function () {
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

                data.unshift(todo);

                inputNode.value = '';
                textareaNode.value = '';

                setData(MAIN_FIELD_NAME, data);
                togglePopup(false);
                buildSections(containerNode, data);
            });

            removeButtonNode.addEventListener('click', function () {
                removeData();
                renderAddButton();
            });

            closeButtonNode.addEventListener('click', () => togglePopup(false));

            buildSections(containerNode, getData(MAIN_FIELD_NAME));
            console.log(getData(MAIN_FIELD_NAME));
        }

    });
}