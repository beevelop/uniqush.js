'use strict'

const got = require('got')

class Uniqush {
  /**
   * @constructor
   * @this {Uniqush}
   * @param {String} endpoint - The Uniqush url to connect to without trailing slash (e.g. `http://uniqush.beevelop.com`)
   *
   * @example
   * var uniqush = new Uniqush('http://uniqush.beevelop.com')
   */
  constructor(endpoint) {
  /* @private */ this.endpoint = endpoint
  }

  _post(route, body) {
    return got(this.endpoint + '/' + route, {body: body})
  }

  _get(route) {
    return got(this.endpoint + '/' + route)
  }

  /**
   * Get the version of the server
   * 
   * @return {Promise} A promise with the server's response (e.g. `uniqush-push 1.5.2`)
   *
   * @example
   * uniqush.version.then(console.log)
   *
   * @example
   * uniqush.version.then(response => {
   *   // response is e.g. `uniqush-push 1.5.2`
   * })
   */
  get version() {
    return this._get('version').then(response => response.body)
  }

  /**
   * Synchronize the database and stop the server
   * 
   * @return {Promise} A promise with the server's response
   */
  stop() {
    return this._get('stop').then(response => response.body)
  }

  /**
   * Add a new Push Service Provider
   * Usually there is no need to use this function explicitly
   * 
   * @param {Object} params - The parameters / options for the PSP (e.g. `service`, `pushservicetype`, `apikey`, etc.)
   *
   * @return {Promise} A promise with the server's response
   */
  addPSP(params) {
    return this._post('addpsp', params).then(response => response.body)
  }

  /**
   * Add a new GCM Push Service Provider
   *
   * @param {String} service   - The services internal name (will be referenced for sending push notifications) – acts as some kind of rememberable ID
   * @param {String} projectId - The projectId you get from the Google Developer Console
   * @param {String} apiKey    - The apiKey you get from the Google Developer Console (something like `AabcDEFghIJKLmnz1-dabcdefghE-76abc123ds8`)
   *
   * @return {Promise} A promise with the server's response
   */
  addGCM(service, projectId, apiKey) {
    return this.addPSP({
      service: service,
      projectid: projectId,
      apikey: apiKey,
      pushservicetype: 'gcm'
    })
  }

  /**
   * Add a new APNs Push Service Provider
   *
   * @param {String} service - The services internal name (will be referenced for sending push notifications) – acts as some kind of rememberable ID
   * @param {String} cert    - The absolute path to the certificate file in .pem format (e.g. `/uniqush/cert.pem`)
   * @param {String} key     - The absolute path to the key file in .pem format (e.g. `/uniqush/key.pem`)
   * @param {boolean} [sandbox=false] - **true** for sandbox; otherwise for production environment (default: **false**)
   *
   * @return {Promise} A promise with the server's response
   */
  addAPNs(service, cert, key, sandbox) {
    return this.addPSP({
      service: service,
      pushservicetype: 'apns',
      cert: cert,
      key: key,
      sandbox: sandbox || false
    })
  }

  /**
   * Add a new ADM Push Service Provider
   *
   * @param {String} service  - The services internal name (will be referenced for sending push notifications) – acts as some kind of rememberable ID
   * @param {String} clientId - The Client ID.
   * @param {String} clientSecret - The Client Secret.
   *
   * @return {Promise} A promise with the server's response
   */
  addADM(service, clientId, clientSecret) {
    return this.addPSP({
      service: service,
      pushservicetype: 'adm',
      clientid: clientId,
      clientsecret: clientSecret
    })
  }

  /**
   * Remove an existing Push Service Provider
   * Usually there is no need to use this function explicitly
   * 
   * @param {Object} params - The parameters / options for the PSP (e.g. `service`, `pushservicetype`, `apikey`, etc.)
   *
   * @return {Promise} A promise with the server's response
   */
  rmPSP(params) {
    return this._post('rmpsp', params).then(response => response.body)
  }

  /**
   * Remove an existing GCM Push Service Provider
   *
   * @param {String} service   - The services internal name (will be referenced for sending push notifications) – acts as some kind of rememberable ID
   * @param {String} projectId - The projectId you get from the Google Developer Console
   * @param {String} apiKey    - The apiKey you get from the Google Developer Console (something like `AabcDEFghIJKLmnz1-dabcdefghE-76abc123ds8`)
   *
   * @return {Promise} A promise with the server's response
   */
  rmGCM(service, projectId, apiKey) {
    return this.rmPSP({
      service: service,
      projectid: projectId,
      pushservicetype: 'gcm',
      apikey: apiKey
    })
  }

  /**
   * Remove an existing APNs Push Service Provider
   *
   * @param {String} service - The services internal name (will be referenced for sending push notifications) – acts as some kind of rememberable ID
   * @param {String} cert    - The absolute path to the certificate file in .pem format (e.g. `/uniqush/cert.pem`)
   * @param {String} key     - The absolute path to the key file in .pem format (e.g. `/uniqush/key.pem`)
   *
   * @return {Promise} A promise with the server's response
   */
  rmAPNs(service, cert, key) {
    return this.rmPSP({
      service: service,
      pushservicetype: 'apns',
      cert: cert,
      key: key
    })
  }

  /**
   * Remove an existing ADM Push Service Provider
   *
   * @param {String} service  - The services internal name (will be referenced for sending push notifications) – acts as some kind of rememberable ID
   * @param {String} clientId - The Client ID.
   * @param {String} clientSecret - The Client Secret.
   *
   * @return {Promise} A promise with the server's response
   */
  rmADM(service, clientId, clientSecret) {
    return this.rmPSP({
      service: service,
      pushservicetype: 'adm',
      clientid: clientId,
      clientsecret: clientSecret
    })
  }

  /**
   * Subscribe a device to an existing service (PSP)
   * Usually there is no need to call this function explicitly
   * 
   * @param {Object} params - The parameters / options for the subscription (e.g. `service`, `pushservicetype`, etc.)
   *
   * @return {Promise} A promise with the server's response
   */
  subscribe(params) {
    return this._post('subscribe', params).then(response => response.body)
  }

  /**
   * Subscribe a device to an existing GCM service
   *
   * @param {string} service    - The services internal name you used when adding the PSP
   * @param {string} subscriber - The subscribers internal name - acts as some kind of rememberable ID
   * @param {string} regId      - One of those cryptic tokens you get when registering at GCM (something like `aBcdEFGH:abCD3fgH1jkLmn0PQR5tuvwXYz-abcdeFGH_GHJIklsmn0123-aksjhdhsk`)
   *
   * @return {Promise} A promise with the server's response
   */
  subscribeGCM(service, subscriber, regId) {
    return this.subscribe({
      service: service,
      pushservicetype: 'gcm',
      subscriber: subscriber,
      regid: regId
    })
  }

  /**
   * Subscribe a device to an existing APNs service
   *
   * @param {string} service    - The services internal name you used when adding the PSP
   * @param {string} subscriber - The subscribers internal name - acts as some kind of rememberable ID
   * @param {string} devToken   - The device token you get when registering at APNs
   *
   * @return {Promise} A promise with the server's response
   */
  subscribeAPNs(service, subscriber, devToken) {
    return this.subscribe({
      service: service,
      pushservicetype: 'apns',
      subscriber: subscriber,
      devtoken: devToken
    })
  }

  /**
   * Subscribe a device to an existing ADM service
   *
   * @param {string} service    - The services internal name you used when adding the PSP
   * @param {string} subscriber - The subscribers internal name - acts as some kind of rememberable ID
   * @param {string} regId      - One of those cryptic tokens you get when registering at ADM
   *
   * @return {Promise} A promise with the server's response
   */
  subscribeADM(service, subscriber, regId) {
    return this.subscribe({
      service: service,
      pushservicetype: 'adm',
      subscriber: subscriber,
      regid: regId
    })
  }

  /**
   * Unubscribe an existing subscriber from a service (PSP)
   * Usually there is no need to call this function explicitly
   * 
   * @param {Object} params - The parameters / options for the subscription (e.g. `service`, `pushservicetype`, etc.)
   *
   * @return {Promise} A promise with the server's response
   */
  unsubscribe(params) {
    return this._post('unsubscribe', params).then(response => response.body)
  }

  /**
   * Unsubscribe a device from an existing GCM service
   *
   * @param {string} service    - The services internal name you used when adding the PSP
   * @param {string} subscriber - The subscribers internal name - acts as some kind of rememberable ID
   * @param {string} regId      - One of those cryptic tokens you get when registering at GCM (something like `aBcdEFGH:abCD3fgH1jkLmn0PQR5tuvwXYz-abcdeFGH_GHJIklsmn0123-aksjhdhsk`)
   *
   * @return {Promise} A promise with the server's response
   */
  unsubscribeGCM(service, subscriber, regId) {
    return this.unsubscribe({
      service: service,
      pushservicetype: 'gcm',
      subscriber: subscriber,
      regid: regId
    })
  }
  
  /**
   * Unsubscribe a device from an existing APNs service
   *
   * @param {string} service    - The services internal name you used when adding the PSP
   * @param {string} subscriber - The subscribers internal name - acts as some kind of rememberable ID
   * @param {string} devToken   - The device token you get when registering at APNs
   *
   * @return {Promise} A promise with the server's response
   */
  unsubscribeAPNs(service, subscriber, devToken) {
    return this.unsubscribe({
      service: service,
      pushservicetype: 'apns',
      subscriber: subscriber,
      devtoken: devToken
    })
  }

  /**
   * Unsubscribe a device from an existing ADM service
   *
   * @param {string} service    - The services internal name you used when adding the PSP
   * @param {string} subscriber - The subscribers internal name - acts as some kind of rememberable ID
   * @param {string} regId      - One of those cryptic tokens you get when registering at ADM
   *
   * @return {Promise} A promise with the server's response
   */
  unsubscribeADM(service, subscriber, regId) {
    return this.unsubscribe({
      service: service,
      pushservicetype: 'adm',
      subscriber: subscriber,
      regid: regId
    })
  }

  /**
   * Push a message to an existing subscriber via an existing service (PSP)
   * Please refer to the [official documentation](https://uniqush.org/documentation/usage.html#push-message) for detailed information about the available parameters
   * 
   * @param {string} service    - The services internal name you used when adding the PSP
   * @param {string} subscriber - The subscribers internal name - acts as some kind of rememberable ID
   * @param {Object} params     - PSP-specific parameters (see official docs)
   */
  push(service, subscriber, params) {
    params = params || {}
    params.service = service
    params.subscriber = subscriber
    return this._post('push', params).then(response => response.body)
  }

}

module.exports = Uniqush
