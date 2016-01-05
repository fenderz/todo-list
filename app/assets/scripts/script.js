function filterData(data, str) {
    var filteredData = {};

    str = str.trim();

    if (!str) {
        return data
    }

    filteredData.topics = data.topics.filter(function (topic) {
        return topic.title.match(new RegExp('\\b' + str, 'gi'));
    });

    filteredData.sections = data.sections.filter(function (section) {
        return filteredData.topics.some(function (topic) {
            return topic.section === section.id;
        });
    });

    return filteredData;
}


function sortBy (arr, key) {

    arr.sort(function(a, b) {

        if (a[key] > b[key]) {
            return 1
        }

        if (a[key] < b[key]) {
            return -1
        }

        return 0
    });

    return arr
}

function buildSections(container, data) {
    var sections = sortBy(data.sections, 'title');
    var topics = sortBy(data.topics, 'title');

    buildSections.disposed.forEach(function(fn){
        fn();
    });

    buildSections.disposed = [];

    container.innerHTML = '';

    sections.forEach(function (section) {
        var sectionElement = document.createElement('div');
        var sectionTitle = document.createElement('h2');
        var topicsList = document.createElement('ul');

        sectionElement.className = 'sections__item';
        sectionTitle.className = 'sections__title';
        topicsList.className = 'topics-list';

        var groupedArray = topics.filter(function (topic) {
            return topic.section === section.id;
        });

        groupedArray.forEach(function (topic) {
            var topicElement = document.createElement('li');
            topicElement.className = 'topics-list__item';

            topicElement.textContent = topic.title;

            function onTopicClick() {
                alert(topic.title + " " + section.title);
            }

            topicElement.addEventListener('click', onTopicClick);

            buildSections.disposed.push(function() {
                topicElement.removeEventListener('click', onTopicClick);
            });

            topicsList.appendChild(topicElement);

        });

        sectionTitle.textContent = section.title;
        sectionTitle.dataset.topicsCounter = groupedArray.length;

        function onSectionTitleClick(e) {
            e.target.classList.toggle("sections__title_open");
        }

        sectionTitle.addEventListener('click', onSectionTitleClick);

        buildSections.disposed.push(function() {
            sectionTitle.removeEventListener('click', onSectionTitleClick);
        });

        sectionElement.appendChild(sectionTitle);
        sectionElement.appendChild(topicsList);
        container.appendChild(sectionElement);
    });

    return container;
}

buildSections.disposed = [];

// Fetch data
function loadData(callback) {
    var data;
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'data.json', true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status !== 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            data = JSON.parse(xhr.responseText);
            callback(data);
        }
    };
}

function main() {
    var data;
    var sectionsContainer = document.querySelector('.sections');
    var filterInput = document.querySelector('.filter__input');

    filterInput.addEventListener('input', function (e) {
        var value = e.target.value;
        build(filterData(data, value));
    });

    load();

    function build(data) {
        buildSections(sectionsContainer, data);
    }

    function load() {
        loadData(function (json) {
            data = json;

            build(data);
            reload();
        });
    }

    function reload() {
        setTimeout(function () {
            load();
        }, 5000);
    }
}

main();