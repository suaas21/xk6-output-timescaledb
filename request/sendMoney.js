import http from "k6/http";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from "k6/data";


const { userArray, loginToken } = require("../resources/properties/responseData.js")
const receiveMoney = new SharedArray("receive data", function () {
    // Load CSV file and parse it using Papa Parse, return array
    return papaparse.parse(open('../resources/properties/receiveMoney.csv'), { header: true }).data;
});
http.setResponseCallback(
    http.expectedStatuses(404, 200)
);
const { properties } = require("../resources/properties/config.js")
const { getInvoice, settlementConfirmPin, settlementVerifyChallenge } = require("./common.js")
let headerParam
let pin;
let url_sendMoney = properties.baseUrl + 'settlements/send-money'

export function sendMoney() {
    for (var i = 0; i < receiveMoney.length; i++) {
        findReceiver(receiveMoney[i].phone_number)
    }
}
export function findReceiver(receiverNumber) {
    userArray.forEach(e => {
        var url = properties.baseUrl + "member/find-member?phone_number=" + receiverNumber
        pin = `${JSON.parse(e).pin}`
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${JSON.parse(e).access_token}`,
                'Ppay-Device-Id': `${JSON.parse(e).device_id}`
            }
        }
        let getReceiverResponse = http.get(url, headerParam)
        console.log(`Send Money Find Receiver : ` + getReceiverResponse.status)
        if (getReceiverResponse.status === 200) {
            var data = JSON.parse(getReceiverResponse.body).data
            createInvoice(data.user_slug)
        } else {
            console.log(`Send Money Find Receiver : ` + JSON.stringify(getReceiverResponse))
        }
    })
}
export function createInvoice(receiver_slug) {
    var payload = JSON.stringify({
        "amount": 500,
        "receiver_slug": receiver_slug,
        "note": "Send Money note"
    })
    var createInvoiceResponse = http.post(url_sendMoney, payload, headerParam)
    console.log(`Send Money Create Invoice :` + createInvoiceResponse.status)
    if (createInvoiceResponse.status === 200) {
        var data = JSON.parse(createInvoiceResponse.body).data
        settlementConfirmPin(url_sendMoney, data.invoice_id, pin, headerParam)
    }
    else {
        console.log(`Send Money Create Invoice :` + JSON.stringify(createInvoiceResponse))
    }
}






































// function sendMoneyConfirm(invoice_id) {
//     var url = properties.baseUrl + 'settlements/send-money/confirm'
//     var payload = JSON.stringify({
//         "invoice_id": invoice_id,
//         "pin": pin
//     })
//     var sendMoneyConfirm = http.post(url, payload, headerParam)
//     console.log(`Confirm Send Money : ` + sendMoneyConfirm.status)
//     if (sendMoneyConfirm.status === 200) {
//         var data = JSON.parse(sendMoneyConfirm.body).data
//         getInvoice(data.invoice_id, headerParam)
//     } else if (sendMoneyConfirm.status === 401) {
//         var PpayChallengeToken = (sendMoneyConfirm.headers['Ppay-Challenge-Token'])
//         // verifySendMoney(PpayChallengeToken, invoice_id)
//         var url = properties.baseUrl + 'settlements/send-money/verify'
//         settlementVerifyChallenge(url, headerParam, PpayChallengeToken, invoice_id)
//     }
//     else {
//         console.log(`Verify Send Money : ` + JSON.stringify(sendMoneyConfirm))
//     }
// }

// function verifySendMoney(PpayChallengeToken, invoice_id) {
//     var url = properties.baseUrl + 'settlements/send-money/verify'
//     var payload = JSON.stringify({
//         "invoice_id": invoice_id,
//         "otp": "123456"
//     })
//     var header = headerParam.headers

//     var newHeader = {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': header.Authorization,
//             'Ppay-Device-Id': header['Ppay-Device-Id'],
//             'Ppay-Challenge-Token': PpayChallengeToken
//         }
//     }
//     var verifySendMoney = http.post(url, payload, newHeader)
//     console.log(`Verify Send Money : ` + verifySendMoney.status)
//     if (verifySendMoney.status === 200) {
//         var successData = JSON.parse(verifySendMoney.body).data
//         var invoice_id = successData.invoice_id
//         getInvoice(invoice_id, headerParam)
//     } else {
//         console.log(`Verify Send Money : ${JSON.stringify(verifySendMoney)}`)
//     }
// }
module.exports = { sendMoney }