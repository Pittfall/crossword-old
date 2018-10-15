import axios from 'axios';
import HandleError from './HandleError';
import { HTTP_HEADERS } from './Config';

// Don't need to set these this time.
axios.defaults.headers.common['Accept'] = HTTP_HEADERS.ACCEPT;
axios.defaults.headers.post['Content-Type'] = HTTP_HEADERS.CONTENT_TYPE;

// HTTP GET
export const get = (path) => {
    return new Promise((resolve, reject) => {
        axios.get(path)
            .then(response => { resolve(response) })
            .catch(error => { reject(HandleError(error)) });
    });
};

export const post = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.post(path, data)
            .then(response => { resolve(response) })
            .catch(error => { reject(HandleError(error)) });
    });
};

export const patch = (path, data) => {
    return new Promise((resolve, reject) => {
      axios.patch(path, data)
        .then(response => { resolve(response) })
        .catch(error => { reject(HandleError(error)) });
    });
  };

export const del = (path) => {
    return new Promise((resolve, reject) => {
        axios.delete(path)
            .then(response => { resolve(response) })
            .catch(error => { reject(HandleError(error)) });
    });
};