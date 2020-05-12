import * as consts from '../constants';

export function apiUrl() {
    const { REACT_APP_DEPLOY_ENV } = process.env;
    
    switch (REACT_APP_DEPLOY_ENV) {
        case consts.STAGE_ENV:
            return consts.API_STAGE_URL;
        case consts.PROD_ENV:
            return consts.API_PROD_URL;
        case consts.LOCAL_ENV:
            return consts.API_LOCAL_URL;
        default:
            return consts.API_DEV_URL;
    }
}

export function defaultHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}
