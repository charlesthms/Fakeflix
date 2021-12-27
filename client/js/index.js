const searchIcon = document.getElementById("si");
const searchBar = document.getElementById("sb");
const suggContainer = document.getElementById("suggestion");
const suggestions = document.getElementById("list");

searchIcon.addEventListener('click', () => {
    searchBar.focus();
});

const onFocusOut = () => {
    setTimeout(() => {
        suggContainer.style.display = "none";
        suggestions.innerHTML = ''
    }, 200);
}
searchBar.addEventListener('focusout', onFocusOut);

// Search logic
const findMatch = async searchText => {
    const res = await fetch('/api/json/index.json');
    const suggestions = await res.json();

    let matches = suggestions.filter(sugg => {
        // Looking for titles with the same firsts letters of the input text
        const regex = new RegExp(`^${searchText}`, 'gi');
        return sugg.title.match(regex);
    });

    if(searchText.length==0){
        matches = [];
        matches.innerHTML = '';
        suggContainer.style.display = "none";
    }
    outputHtml(matches);
}

function outputHtml(matches){
    if(matches.length > 0){
        const html = matches.map((match) => {
            if(match.type == "movie"){
                return `<li><a href="${match.path}">${match.title}</a></li>`;
            } else {
                return `<li><a href="${match.link}">${match.title}</a></li>`;
            }
        }).join('');
        suggContainer.style.display = "block";
        suggestions.innerHTML = html;
    }

}

searchBar.addEventListener('input', (e) => {
    findMatch(e.target.value);
});

