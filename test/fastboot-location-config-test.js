'use strict';

const chai = require('chai');
const expect = chai.expect;
const RSVP = require('rsvp');
const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
const request = require('request');
const get = RSVP.denodeify(request);

describe('FastBootLocation Configuration', function () {
  this.timeout(300000);

  let app;

  before(function () {
    app = new AddonTestApp();

    return app.create('fastboot-location-config')
      .then(function () {
        return app.startServer({
          command: 'fastboot',
          additionalArguments: ['--serve-assets']
        });
      });
  });

  after(function () {
    return app.stopServer();
  });

  it('should use the redirect code provided by the EmberApp', function () {
    return get({
      url: 'http://localhost:49741/redirect-on-transition-to',
      followRedirect: false
    })
      .then(function (response) {
        if (response.statusCode === 500) throw new Error (response.body);
        expect(response.statusCode).to.equal(302);
      });
  });

  describe('when fastboot.fastbootHeaders is false', function () {
    it('should not send the "x-fastboot-path" header on a redirect', function () {
      return get({
        url: 'http://localhost:49741/redirect-on-transition-to',
        followRedirect: false
      })
        .then(function (response) {
          if (response.statusCode === 500) throw new Error (response.body);
          expect(response.headers).to.not.include.keys([
            'x-fastboot-path'
          ]);
        });
    });
  });
});
