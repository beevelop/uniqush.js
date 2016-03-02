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

  rmPSP(params) {
    return this._post('rmpsp', params).then(response => response.body)
  }

  rmGCM(service, projectId, apiKey) {
    return this.rmPSP({
      service: service,
      projectid: projectId,
      pushservicetype: 'gcm',
      apikey: apiKey
    })
  }

  rmAPNs(service, cert, key) {
    return this.rmPSP({
      service: service,
      pushservicetype: 'apns',
      cert: cert,
      key: key
    })
  }

  rmADM(service, clientId, clientSecret) {
    return this.rmPSP({
      service: service,
      pushservicetype: 'adm',
      clientid: clientId,
      clientsecret: clientSecret
    })
  }

  subscribe(params) {
    return this._post('subscribe', params).then(response => response.body)
  }

  subscribeGCM(service, subscriber, regId) {
    return this.subscribe({
      service: service,
      pushservicetype: 'gcm',
      subscriber: subscriber,
      regid: regId
    })
  }

  subscribeAPNs(service, subscriber, devToken) {
    return this.subscribe({
      service: service,
      pushservicetype: 'apns',
      subscriber: subscriber,
      devtoken: devToken
    })
  }

  subscribeADM(service, subscriber, regId) {
    return this.subscribe({
      service: service,
      pushservicetype: 'adm',
      subscriber: subscriber,
      regid: regId
    })
  }

  unsubscribe(params) {
    return this._post('unsubscribe', params).then(response => response.body)
  }

  unsubscribeGCM(service, subscriber, regId) {
    return this.unsubscribe({
      service: service,
      pushservicetype: 'gcm',
      subscriber: subscriber,
      regid: regId
    })
  }

  unsubscribeAPNs(service, subscriber, devToken) {
    return this.unsubscribe({
      service: service,
      pushservicetype: 'apns',
      subscriber: subscriber,
      devtoken: devToken
    })
  }

  unsubscribeADM(service, subscriber, regId) {
    return this.unsubscribe({
      service: service,
      pushservicetype: 'adm',
      subscriber: subscriber,
      regid: regId
    })
  }

  push(service, subscriber, params) {
    params = params || {}
    params.service = service
    params.subscriber = subscriber
    return this._post('push', params).then(response => response.body)
  }

}

module.exports = Uniqush
