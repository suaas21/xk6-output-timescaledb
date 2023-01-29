import http from "k6/http";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from "k6/data";
import { sleep, check } from "k6";

// Set accepted code 
http.setResponseCallback(
    http.expectedStatuses(401, 200)
);

const { userArray } = require("../resources/properties/responseData.js")
const { properties } = require("../resources/properties/config.js")
const loginCSV = new SharedArray("login data", function () {
    // Load CSV file and parse it using Papa Parse, return array
    return papaparse.parse(open('../resources/properties/loginData.csv'), { header: true }).data;
});

var headerParam = {
    headers: {
        'Content-Type': 'application/json',
    }
}
export let options = {
    vus: 1,
    duration: '10s',
    rps: 1
}

export default function () {
    login()
}

export function challengeValidation(PpayChallengeToken, device_id, pin) {
    var url = properties.baseUrl + 'auth/challenges/validate'
    var headerParam = {
        headers: {
            'Content-Type': 'application/json',
            'Ppay-Challenge-Token': `${PpayChallengeToken}`,
        }
    }
    var payload = JSON.stringify({
        "challenge_code": "123456",
        "trust_this_device": false // true or false
    })
    let challengeResponse = http.patch(url, payload, headerParam)
    console.log(`Challenge :` + challengeResponse.status)
    let data = JSON.parse(challengeResponse.body).data
    const value = JSON.stringify({
        "mobile": `${data.mobile}`,
        "pin": pin,
        "device_id": `${device_id}`,
        "access_token": `${data.access_token}`,
        "refresh_token": `${data.refresh_token}`,
        'PpayChallengeToken': `${PpayChallengeToken}`
    })
    userArray.push(value)
}


export function login() {
    var url = properties.baseUrl + 'auth/login'
    for (var i = 0; i < loginCSV.length; i++) {
        var device_id = loginCSV[i].device_id
        var pin = loginCSV[i].pin
        var response = http.post(url, JSON.stringify(loginCSV[i]), headerParam)
        console.log(`Login :` + response.status)
        if (response.status === 401) {
            let PpayChallengeToken = (response.headers['Ppay-Challenge-Token'])
            var mobile = `${JSON.parse(JSON.stringify(response.request.body))}`
            const value = JSON.stringify({
                "mobile": `${JSON.parse(mobile).mobile}`,
                "PpayChallengeToken": `${PpayChallengeToken}`
            })
            challengeValidation(PpayChallengeToken, device_id, pin)
        } else if (response.status === 200) {
            var requestBody = `${JSON.parse(JSON.stringify(response.request.body))}`
            let responseData = JSON.parse(response.body).data
            const value = JSON.stringify({
                "mobile": `${JSON.parse(requestBody).mobile}`,
                "pin": pin,
                "PpayChallengeToken": 'undefined',
                "device_id": `${JSON.parse(requestBody).device_id}`,
                "access_token": `${responseData.access_token}`,
                "refresh_token": `${responseData.refresh_token}`
            })
            userArray.push(value)
        } else {
            console.log(`Login : ${JSON.stringify(response)}`)
        }
    }
}

module.exports = { login, challengeValidation }

