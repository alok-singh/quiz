import 'fetch';

export const post = (url, data, headers) => {
    return fetchAPI(url, 'POST', data, headers);
}

export const get = (url, headers) => {
    return fetchAPI(url, 'GET', null, headers);
}

const fetchAPI = (url, type, data, headers) => {
    let options = {
        method: type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        } // body data type must match "Content-Type" header
    };
    options.headers.authorization = (headers && headers.authorization) ? headers.authorization : undefined;
    options.body = data ? JSON.stringify(data) : undefined;
    return fetch(url, options).then(response => response.json())
}