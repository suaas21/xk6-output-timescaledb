import { check } from 'k6';
import http from 'k6/http';
import { usersData } from './config/loginData.js';


export const options = {
    vus: 2,
    duration: '10s',
    thresholds: {
        // the rate of successful checks should be higher than 90%
        checks: ['rate>0.9'],
      },
};

export function challengeValidation(PpayChallengeToken) {
    console.log("This is challengeValidation\n")
    var url = "https://api.pp-stage.xyz/api/v1/"+"auth/challenges/validate";
    console.log(url)
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
    check(challengeResponse, {
        'is status 200': (r) => r.status === 200,
      });
    console.log(`Challenge Response status :` + challengeResponse.status)
    let data = JSON.parse(challengeResponse.body).data
    
    console.log("value from challangeValidation :    ", data);
}

export function login(){
    const url = 'https://api.pp-stage.xyz/api/v1/auth/login';

    var headerParam = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    console.log("First One...............");

    let position = Math.floor(Math.random()*usersData.length);
    //let v1 = JSON.stringify(loginData.users[position]);
    let v1 = JSON.stringify(usersData[position])
    console.log(typeof(v1));
    console.log(v1);
    // console.log(v1);
    let response = http.post(url, v1, headerParam);
    //console.log(response);
    check(response, {
        'is status 401': (r) => r.status === 401,
      });
    console.log(`Login status :` + response.status)
    if (response.status === 401) {
        let PpayChallengeToken = response.headers['Ppay-Challenge-Token']
        var req = `${JSON.parse(JSON.stringify(response.request.body))}`
        console.log(typeof(response.request))
        const value = JSON.stringify({
            "mobile": `${JSON.parse(req).mobile}`,
            "PpayChallengeToken": `${PpayChallengeToken}`
        })
        console.log(value)
        challengeValidation(PpayChallengeToken)
    }
}

export default function() {
    login()
}
