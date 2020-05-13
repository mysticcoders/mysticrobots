import axios from 'axios';
import { apiUrl, defaultHeaders } from './api';
import { handleAxiosError } from './utils';

export default class RasamApi {

    static fetchLatestChallenge() {
        return axios
            .get(`${apiUrl()}/challenges?latest=true`, defaultHeaders)
            .then(response => {
                const { data } = response;

                return {
                    ...data
                }
            })
            .catch(handleAxiosError);
    }

    static fetchPuzzlesByChallenge(challengeId) {
        console.dir(challengeId)

        const url = `${apiUrl()}/puzzles/${challengeId}`

        console.log(url)

        return axios
            .get(url, defaultHeaders)
            .then(response => {
                const { data } = response;

                return {
                    ...data
                }
            })
            .catch(handleAxiosError);
    }
}
