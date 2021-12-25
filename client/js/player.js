class Utils {
    static async findMatch (searchText) {
        const res = await fetch('/api/json/index.json');
        const suggestions = await res.json();
        
        return suggestions.filter(sugg => {
            // Looking for titles with the same firsts letters of the input text
            const regex = new RegExp(`^${searchText}`, 'gi');
            return sugg.short.match(regex);
        });
    }

    static isMovie(params){
        return params.has('name');
    }

    static getParams(params, isMovie){
        if(isMovie){
            return params.get('name');
        } else {
            let path = params.get('path');
            let array = path.split('-');
            return array;
        }
    }

    static async getDetails(params, isMovie){
        if(isMovie){
            const res = await this.findMatch(this.getParams(params, true));
            return res[0];
        } else {
            let array = this.getParams(params);
            let query = `${array[0]}-${array[1]}`;
    
            const res = await this.findMatch(query);
            return res[0];
        }
    }

    static getNextEp(params){
        // Calculating next ep number
        const array = this.getParams(params);
        const epNum = parseInt(array[2].replace( /^\D+/g, ''));
        const epNumStr = (epNum+1).toString();

        // Calculating if needed next season
        if(epNum > 9){
            const seasonNum = parseInt(array[1].charAt(1));
            const nextSeason = "s" + (seasonNum+1).toString();
            return `${array[0]}-${nextSeason}-ep1`;
        } else {
            return `${array[0]}-${array[1]}-ep${epNumStr}`;
        }
    }

    static getPrevEp(params){
        const array = this.getParams(params);
        const epNum = parseInt(array[2].replace( /^\D+/g, ''));
        if(epNum > 1){
            const epNumStr = (epNum-1).toString();
            return `${array[0]}-${array[1]}-ep${epNumStr}`;
        } else {
            const epNumStr = (epNum).toString();
            return `${array[0]}-${array[1]}-ep${epNumStr}`;
        }
    }
}


// DOM
const pa = new URLSearchParams(window.location.search);
const episode = document.getElementById('episode');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const home = document.getElementById("home");
const poster = document.getElementById('video');

// Logic
home.setAttribute('href', "/");

if(Utils.isMovie(pa)){
    document.getElementById("src").setAttribute('src', `http://192.168.1.36:3000/films/${pa.get("name")}`);

    Utils.getDetails(pa, true).then((res) => {
        poster.setAttribute('poster', `${res.img}`);
        document.title = res.title;
        document.getElementById("name").innerHTML = `${res.title}`;
    });
} else {
    const array = Utils.getParams(pa, false);
    
    Utils.getDetails(pa, false).then((res) => {
        const name = `${res.title}`;
        const ep = `| ${array[1].toUpperCase()} - ${array[2].toUpperCase()}`;
        
        poster.setAttribute('poster', `${res.img}`);
        document.getElementById("name").innerHTML = name;
        document.getElementById("ep").innerHTML = ep;
        document.title = res.title;
    });

    document.getElementById("src").setAttribute('src', `http://192.168.1.36:3000/series/${array[0]}/${array[1]}/${array[2]}`);
    document.getElementById("ep").innerHTML = `| ${array[1].toUpperCase()} - ${array[2].toUpperCase()}`;
    next.setAttribute('href', `/watch?path=${Utils.getNextEp(pa)}`);
    prev.setAttribute('href', `/watch?path=${Utils.getPrevEp(pa)}`);
}




