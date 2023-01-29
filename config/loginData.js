import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from "k6/data";

// const loginData = {
//     "users": [{
//         "mobile": "01677112608",
//         "pin": "12345",
//         "device_id": "sdfdsfssdsdsffr"
//     },
//     {
//         "mobile": "01749201006",
//         "pin": "12345",
//         "device_id": "sdfdsfssdsdsffr"
//     },
//     {
//         "mobile": "01551818815",
//         "pin": "12345",
//         "device_id": "sdfdsfssdsdsffr"
//     },
//     {
//         "mobile": "01989456943",
//         "pin": "12345",
//         "device_id": "sdfdsfssdsdsffr"
//     },
//     {
//         "mobile": "01865852590",
//         "pin": "12345",
//         "device_id": "sdfdsfssdsdsffr"
//     }]
// };

export const usersData = new SharedArray("login data", function () {
    // Load CSV file and parse it using Papa Parse, return array
    let ret = papaparse.parse(open('../users/loginData.csv'), { header: true }).data;
    return ret;
});




