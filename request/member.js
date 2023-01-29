import http from "k6/http"

const { userArray } = require("/test/resources/properties/responseData.js")
const { properties } = require("/test/resources/properties/config.js")

var headerParam;

export function getBalance() {
    userArray.forEach(e => {
        var url = properties.baseUrl + 'settlements/wallets/me'
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${JSON.parse(e).access_token}`,
                'Ppay-Device-Id': `${JSON.parse(e).device_id}`
            }
        }
        let balanceResponse = http.get(url, headerParam)
        if (balanceResponse.status === 200) {
            console.log(`Balance : ` + balanceResponse.status)
        } else {
            console.log(`Balance : ` + `${JSON.stringify(balanceResponse)}`)
        }
    })
}
export function getActivityLog() {
    userArray.forEach(e => {
        var url = properties.baseUrl + 'activity/login-activity'
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${JSON.parse(e).access_token}`,
                'Ppay-Device-Id': `${JSON.parse(e).device_id}`
            }
        }
        let activityLog = http.get(url, headerParam)
        if (activityLog.status === 200) {
            console.log(`Activity Log : ` + activityLog.status)
        } else {
            console.log(`Activity Log : ` + `${JSON.stringify(activityLog)}`)
        }
    })
}
export function getLimit() {
    userArray.forEach(e => {
        var url = properties.baseUrl + 'settlements/limits'
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${JSON.parse(e).access_token}`,
                'Ppay-Device-Id': `${JSON.parse(e).device_id}`
            }
        }
        let limitResponse = http.get(url, headerParam)
        if (limitResponse.status === 200) {
            console.log(`Limit : ` + limitResponse.status)
        } else {
            console.log(`Limit : ` + `${JSON.stringify(limitResponse)}`)
        }
    })
}
export function getPerTransactionLimit() {
    userArray.forEach(e => {
        var url = properties.baseUrl + 'activity/login-activity'
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${JSON.parse(e).access_token}`,
                'Ppay-Device-Id': `${JSON.parse(e).device_id}`
            }
        }
        let getPerTransactionLimit = http.get(url, headerParam)
        if (getPerTransactionLimit.status === 200) {
            console.log(`Per Transaction Limit : ` + getPerTransactionLimit.status)
        } else {
            console.log(`Per Transaction Limit  : ` + `${JSON.stringify(getPerTransactionLimit)}`)
        }
    })
}
export function getAppSetting() {
    userArray.forEach(e => {
        var url = properties.baseUrl + 'settings/app'
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${JSON.parse(e).access_token}`,
                'Ppay-Device-Id': `${JSON.parse(e).device_id}`
            }
        }
        let appSetting = http.get(url, headerParam)
        if (appSetting.status === 200) {
            console.log(`App Setting : ` + appSetting.status)
        } else {
            console.log(`App Setting : ` + `${JSON.stringify(appSetting)}`)
        }
    })
}
export function getTransactionChannel() {
    userArray.forEach(e => {
        var url = properties.baseUrl + 'settings/txn-channel'
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${JSON.parse(e).access_token}`,
                'Ppay-Device-Id': `${JSON.parse(e).device_id}`
            }
        }
        let transactionChannel = http.get(url, headerParam)
        if (transactionChannel.status === 200) {
            console.log(`Transaction Channel : ` + transactionChannel.status)
        } else {
            console.log(`Transaction Channel : ` + `${JSON.stringify(transactionChannel)}`)
        }
    })
}
export function getNotifications() {
    userArray.forEach(e => {
        var url = properties.baseUrl + 'notifications'
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${JSON.parse(e).access_token}`,
                'Ppay-Device-Id': `${JSON.parse(e).device_id}`
            }
        }
        let notifications = http.get(url, headerParam)
        if (notifications.status === 200) {
            console.log(`Notifications : ` + notifications.status)
            // console.log(`Notifications : ` + `${JSON.stringify(notifications)}`)
            var data = JSON.parse(notifications.body).data
            // getNotificationsDetails(data[0].id)
            console.log(data[0].id)
        } else {
            console.log(`Notifications : ` + `${JSON.stringify(notifications)}`)
        }
    })
}
export function getNotificationsDetails(notificationId) {
    userArray.forEach(e => {
        var url = properties.baseUrl + 'notifications/' + notificationId
        headerParam = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${JSON.parse(e).access_token}`,
                'Ppay-Device-Id': `${JSON.parse(e).device_id}`
            }
        }
        let notificationsDetails = http.get(url, headerParam)
        if (notificationsDetails.status === 200) {
            console.log(notificationId + `jkfdsa`)
            // console.log(`Notifications Details : ` + notificationsDetails.status)
            // console.log(`Notifications Details : ` + `${JSON.stringify(notificationsDetails)}`)
        } else {
            console.log(notificationId +`jkfdgsdhgsdfhfdsa`)
            // console.log(`Notifications Details : ` + `${JSON.stringify(notificationsDetails)}`)
        }
    })
}
// export function getAppSetting() {
//     userArray.forEach(e => {
//         var url = properties.baseUrl + 'settings/app'
//         headerParam = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `BEARER ${JSON.parse(e).access_token}`,
//                 'Ppay-Device-Id': `${JSON.parse(e).device_id}`
//             }
//         }
//         let appSetting = http.get(url, headerParam)
//         if (appSetting.status === 200) {
//             console.log(`App Setting : ` + appSetting.status)
//         } else {
//             console.log(`App Setting : ` + `${JSON.stringify(appSetting)}`)
//         }
//     })
// }
// export function getAppSetting() {
//     userArray.forEach(e => {
//         var url = properties.baseUrl + 'settings/app'
//         headerParam = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `BEARER ${JSON.parse(e).access_token}`,
//                 'Ppay-Device-Id': `${JSON.parse(e).device_id}`
//             }
//         }
//         let appSetting = http.get(url, headerParam)
//         if (appSetting.status === 200) {
//             console.log(`App Setting : ` + appSetting.status)
//         } else {
//             console.log(`App Setting : ` + `${JSON.stringify(appSetting)}`)
//         }
//     })
// }
module.exports = { getBalance, getActivityLog, getLimit, getPerTransactionLimit, getAppSetting,getTransactionChannel,
    getNotifications, getNotificationsDetails}
