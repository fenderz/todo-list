function main() {
    var data = {
        male:[],
        female:[]
    };

    var input = document.querySelector('.form__input');
    var textarea = document.querySelector('.form__textarea');
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

        console.log(data);
    });

}

main();