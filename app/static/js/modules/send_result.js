export function returnURL(test_name, score, test_time=null) {
    const stringURL = window.location.origin + '/send_result';
    console.log(stringURL);
    const webSiteURL = new URL(stringURL);
    webSiteURL.searchParams.append('test_name', test_name);
    webSiteURL.searchParams.append('score', score);
    webSiteURL.searchParams.append('test_time', test_time);
    return webSiteURL.href
}

export function followLink(url) {
    document.location.href = url;
}