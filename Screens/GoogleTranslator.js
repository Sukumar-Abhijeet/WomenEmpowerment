
export function transLanguage(string, language) {
    console.log('GoogleTranslatorScreen transLanguage():', string, language);
    let code = ''
    if (language == "English")
        code = 'en';
    else
        code = 'hi';

    let fromLang = 'en';

    const API_KEY = [YOUR_API_KEY];

    let url = `https://translation.googleapis.com/language/translate/v2?key${API_KEY}`;
    url += '&q=' + encodeURI(string);
    url += `&source=${fromLang}`;
    url += `&target${code}`;

    fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    })
        .then(res => res.json())
        .then((response) => {
            console.log("response from google: ", response);
        })
        .catch(error => {
            console.log("There was an error with the translation request: ", error);
        });
}