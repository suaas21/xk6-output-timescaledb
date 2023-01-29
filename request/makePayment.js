import http from "k6/http";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from "k6/data";
import { sleep, check } from "k6";

const { properties } = require("../resources/properties/config.js")
const { getInvoice, settlementConfirmPin, settlementVerifyChallenge } = require("./common.js")
const { userArray, loginToken } = require("../resources/properties/responseData.js")
const merchantNumber = new SharedArray("merchant data", function () {
    // Load CSV file and parse it using Papa Parse , return array
    return papaparse.parse(open('../resources/properties/merchantNumber.csv'), { header: true }).data;
});

let pin
let headerParam
let url_makePayment = properties.baseUrl + 'settlements/make-payment'


export function makePayment() {
    for (var i = 0; i < merchantNumber.length; i++) {
        findMerchant(merchantNumber[i].phone_number)
    }
}

export function findMerchant(phone_number) {

    userArray.forEach(e => {
        var url = properties.baseUrl + 'member/merchant/find-merchant?phone_number=' + phone_number
        pin = `${JSON.parse(e).pin}`
        var device_id = JSON.parse(e).device_id
        var access_token = JSON.parse(e).access_token
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${access_token}`,
                'Ppay-Device-Id': `${device_id}`
            }
        }
        let merchantResponse = http.get(url, headerParam)
        console.log(`Make Payment Find Merchant :` + merchantResponse.status)
        if (merchantResponse.status === 200) {
            var merchant_data = JSON.parse(merchantResponse.body).data
            var merchant_id = merchant_data.merchant_id
            var terminal_id = merchant_data.terminal_id
            createInvoice(merchant_id, terminal_id)
        } else {
            console.log(`Make Payment Find Merchant :` + JSON.stringify(merchantResponse))
        }
    })
}

export function createInvoice(merchant_id, terminal_id) {
    var payload = JSON.stringify({
        "amount": 500,
        "merchant_id": merchant_id,
        "terminal_id": terminal_id,
        "note": "Hello Pathao"
    })
    var createInvoiceResponse = http.post(url_makePayment, payload, headerParam)
    console.log(`Make Payment Create Invoice :` + createInvoiceResponse.status)
    if (createInvoiceResponse.status === 200) {
        var data = JSON.parse(createInvoiceResponse.body).data
        settlementConfirmPin(url_makePayment,data.invoice_id, pin, headerParam)
    } else {
        console.log(`Make Payment Create Invoice :` + JSON.stringify(createInvoiceResponse))
    }
}



































// export function confirmMakePayment(invoice_id) {
//     var url = properties.baseUrl + 'settlements/make-payment/confirm'
//     var payload = JSON.stringify({
//         "invoice_id": invoice_id,
//         "pin": pin
//     })
//     var confirmMakePaymentResponse = http.post(url, payload, headerParam)
//     console.log(`Confirm Make Payment ` + confirmMakePaymentResponse.status)
//     if (confirmMakePaymentResponse.status === 401) {
//         var PpayChallengeToken = (confirmMakePaymentResponse.headers['Ppay-Challenge-Token'])
//         var url = properties.baseUrl + 'settlements/make-payment/verify'
//         settlementVerifyChallenge(url, headerParam, PpayChallengeToken, invoice_id)
//     } else if (confirmMakePaymentResponse.status === 200) {
//         var successData = JSON.parse(confirmMakePaymentResponse.body).data
//         var invoice_id = successData.invoice_id
//         getInvoice(invoice_id, headerParam)
//     } else {
//         console.log(`Confirm Make Payment : ${JSON.stringify(confirmMakePaymentResponse)}`)
//     }
// }

// export function verifyMakePayment(PpayChallengeToken, invoice_id) {
//     var url = properties.baseUrl + 'settlements/make-payment/verify'
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
//     var verifyMakePayment = http.post(url, payload, newHeader)
//     console.log(`Verify Make Payment : ` + verifyMakePayment.status)
//     if (verifyMakePayment.status === 200) {
//         var successData = JSON.parse(verifyMakePayment.body).data
//         var invoice_id = successData.invoice_id
//         getInvoice(invoice_id, headerParam)
//     } else {
//         console.log(`Verify Make Payment : ${JSON.stringify(verifyMakePayment)}`)
//     }


// }
// function getInvoice(invoice_id) {
//     var url = url_getInvoice + invoice_id
//     var getInvoice = http.get(url, headerParam)
//     if (getInvoice.status === 200) {
//         console.log(`Make Payment Get Invoice : ${getInvoice.status}`)
//     } else {
//         console.log(`Make Payment Get Invoice : ${JSON.stringify(getInvoice)}`)
//     }
// }
module.exports = { makePayment }