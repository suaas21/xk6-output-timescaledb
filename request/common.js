import http from "k6/http"
const { properties } = require("/test/resources/properties/config.js")

function getInvoice(invoice_id, headerParam) {
    var url = properties.baseUrl + 'settlements/invoices/' + invoice_id
    var getInvoice = http.get(url, headerParam)
    if (getInvoice.status === 200) {
        console.log(`Get Invoice : ${getInvoice.status}`)
    } else {
        console.log(`Get Invoice : ${JSON.stringify(getInvoice)}`)
    }
}

function settlementConfirmPin(url, invoice_id, pin, headerParam) {
    var url_confirm = url + '/confirm'
    var payload = JSON.stringify({
        "invoice_id": invoice_id,
        "pin": pin
    })
    var confirmPin = http.post(url_confirm, payload, headerParam)
    console.log(`Confirm Pin : ` + confirmPin.status)
    if (confirmPin.status === 200) {
        var data = JSON.parse(confirmPin.body).data
        getInvoice(data.invoice_id, headerParam)
    } else if (confirmPin.status === 401) {
        var PpayChallengeToken = (confirmPin.headers['Ppay-Challenge-Token'])
        settlementVerifyChallenge(url, headerParam, PpayChallengeToken, invoice_id)
    }
    else {
        console.log(`Confirm Pin :  ` + JSON.stringify(confirmPin))
    }
}

function settlementVerifyChallenge(url, header, PpayChallengeToken, invoice_id) {
    var url = url + '/verify'
    var payload = JSON.stringify({
        "invoice_id": invoice_id,
        "otp": "123456"
    })
    var h = JSON.stringify(header)
    var newHeader = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(h).headers.Authorization,
            'Ppay-Device-Id': JSON.parse(h).headers['Ppay-Device-Id'],
            'Ppay-Challenge-Token': PpayChallengeToken
        }
    }
    var verifyResponse = http.post(url, payload, newHeader)
    console.log(`Verify OTP : ` + verifyResponse.status)
    if (verifyResponse.status === 200) {
        var successData = JSON.parse(verifyResponse.body).data
        var invoice_id = successData.invoice_id
        getInvoice(invoice_id, header)
    } else {
        console.log(`Verify OTP : ${JSON.stringify(verifyResponse)}`)
    }
}

module.exports = { getInvoice,settlementConfirmPin, settlementVerifyChallenge }