import http from "k6/http";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from "k6/data";

const { login } = require("/test/request/login.js")
const { makePayment } = require("/test/request/makePayment.js")
const { sendMoney } = require("/test/request/sendMoney.js")
const { getBalance, getActivityLog, getLimit, getPerTransactionLimit, getAppSetting,getTransactionChannel,
    getNotifications, getNotificationsDetails} = require("/test/request/member.js")
const { userArray, loginToken } = require("/test/resources/properties/responseData.js")

export const options = {
    vus: 1,
    duration: '10s',
    rps: 1
}

// Set accepted code 
http.setResponseCallback(
    http.expectedStatuses(200, 401, 404, 429)
);

export default function(){
    login()
    // makePayment() // done
    // sendMoney()  // done
    member()

    // console.log(userArray.length)
    
}

export function member(){
        getBalance()
        getActivityLog()
        getLimit()
        getPerTransactionLimit()
        getAppSetting()
        // getTransactionChannel()
        // getNotifications() // NoticicationDetails Call Internally

}
