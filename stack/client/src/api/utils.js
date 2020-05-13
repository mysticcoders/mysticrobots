// @flow
import querystring from 'querystring';

import {
    ERR_SESSION_TIMEOUT,
    ERR_FORBIDDEN,
    ERR_SERVER_ERROR,
    ERR_REQUEST_ERROR,
    ERR_NOT_FOUND,
    ERR_CLIENT_ERROR,
    ERR_OTHER,
    ERR_NETWORK_ERROR,
} from '../constants/error';

const NETWORK_ERROR = 'Network Error';

export const handleAxiosError = (error) => {
    if (error.response) {
        const resp = error.response
        if (resp.status >= 500) {
            throw new Error(ERR_SERVER_ERROR)
        } else if (resp.status === 401) {
            throw new Error(ERR_SESSION_TIMEOUT)
        } else if (resp.status === 403) {
            throw new Error(ERR_FORBIDDEN)
        } else if (resp.status === 404) {
            throw new Error(ERR_NOT_FOUND)
        } else if (resp.data) {
            throw new Error(resp.data.message || ERR_OTHER);
        } else if (resp.status === 400) {
            throw new Error(ERR_CLIENT_ERROR)
        } else {
            throw new Error(ERR_OTHER)
        }
    } else if (error.message === NETWORK_ERROR) {
        throw new Error(ERR_NETWORK_ERROR)
    } else if (error.request) {
        throw new Error(ERR_REQUEST_ERROR)
    } else {
        throw new Error(error.message)
    }
}

export const totalPages = (total, perPage) =>
    Math.ceil(total / perPage);

export const queryStringify = (params) => {
    const filtered = {};
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (value === null || value === undefined) {
            return;
        }

        filtered[key] = params[key];
    });

    return querystring.stringify(filtered);
};
