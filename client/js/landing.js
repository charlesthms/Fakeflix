// Filling
const find = async (searchText) => {
    const res = await fetch('/api/json/index.json');
    const suggestions = await res.json();
    
    return suggestions.filter(sugg => {
        // Looking for titles with the same firsts letters of the input text
        const regex = new RegExp(`^${searchText}`, 'gi');
        return sugg.type.match(regex);
    });
}

find("movie").then((res) => {
    const container = document.getElementById("films");

    for (let i = 0; i < res.length; i++) {
        const img = res[i].img;
        const href = res[i].path;
        
        container.innerHTML += `
        <div class="swiper-slide">
            <a href="${href}">
                <img src="${img}">
            </a>
        </div>
        `;
    }
    const swiper = new Swiper('.swiper', {
        slidesPerView: 5,
        slidesPerGroup: 2,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            100: {
                slidesPerView: 1,
                slidesPerGroup: 1,
            },
            430: {
                slidesPerView: 2,
                slidesPerGroup: 1,
            },
            740: {
                slidesPerView: 3,
            },
            1100: {
                slidesPerView: 4,
            },
        },
    });
});
