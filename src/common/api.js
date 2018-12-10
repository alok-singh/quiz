import 'fetch';
import $ from 'jquery';

const baseURL = 'http://13.67.94.139/api/user/upload/image/';

export const post = (url, data, headers) => {
    return fetchAPI(url, 'POST', data, headers);
}

export const get = (url, headers) => {
    return fetchAPI(url, 'GET', null, headers);
}

export const uploadImage = (formData, apiToken, callback) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: baseURL,
            method: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            beforeSend: (request) => {
                request.setRequestHeader("authorization", apiToken);
            },
            success: (data) => {
                resolve(data);
            },
            error: (error) => {
                reject(error);
            }
        });  
    })
}

const fetchAPI = (url, type, data, headers) => {
    let options = {
        method: type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    options.headers.authorization = (headers && headers.authorization) ? headers.authorization : undefined;
    options.body = data ? JSON.stringify(data) : undefined;
    return fetch(url, options).then(response => response.json())
}