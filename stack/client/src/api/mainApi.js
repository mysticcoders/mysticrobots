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

    static fetchChallenges() {
        return axios
            .get(`${apiUrl()}/challenges`, defaultHeaders)
            .then(response => {
                const { data } = response;

                return {
                    ...data
                }
            })
            .catch(handleAxiosError);
    }

    static fetchPuzzle(id) {
        return axios
            .get(`${apiUrl()}/puzzles/${id}`, defaultHeaders)
            .then(response => {
                const { data } = response;

                return {
                    ...data
                }
            })
            .catch(handleAxiosError);
    }

    static fetchChallenge(id) {
        return axios
            .get(`${apiUrl()}/challenges/${id}`, defaultHeaders)
            .then(response => {
                const { data } = response;

                return {
                    ...data
                }
            })
            .catch(handleAxiosError);
    }

    static fetchPuzzlesByChallenge(challengeId) {

        const url = `${apiUrl()}/challenges/${challengeId}/puzzles`

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
