import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from "k6/data";



export const usersData = new SharedArray("login data", function () {
    // Load CSV file and parse it using Papa Parse, return array
    let ret = papaparse.parse(open('../users/loginData.csv'), { header: true }).data;
    return ret;
});




