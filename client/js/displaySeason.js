const params = new URLSearchParams(window.location.search);

const getParams = (params) => {
    return params.get('name');
}

const findEpisodes = async (searchText) => {
    const res = await fetch('/api/json/index.json');
    const suggestions = await res.json();
    
    return suggestions.filter(sugg => {
        // Looking for titles with the same firsts letters of the input text
        const regex = new RegExp(`^${searchText}`, 'gi');
        return sugg.short.match(regex);
    });
}

findEpisodes(getParams(params)).then((res) => {
    const episodes = res[0].episodes;
    const container = document.getElementById('display');

    document.getElementById('name').innerHTML = res[0].title;
    document.title = res[0].title;

    for (let i = 0; i < episodes.length; i++) {
        const element = episodes[i];
        const bgStyle = 'background-image: url(/api/img/gots2.webp)';
        
        container.innerHTML += `
            <a href="${element.path}" id="txt">
                <div class="card" style="${bgStyle};">
                    <div class="title">
                        <p id="title">${element.title}</p>
                    </div>
                </div>
            </a>
        `;
    }
});
