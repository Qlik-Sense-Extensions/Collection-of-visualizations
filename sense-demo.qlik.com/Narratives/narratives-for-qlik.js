// Narratives for Qlik plugin. Thin wrapper around the library.
(function() {
  var config, staticUrl;

  config = {
    apiUrl: 'https://prod-viz-saas-api.narrativescience.com',
    apiKey: '58376815700f57d0b21fd902dbfed3d4',
    betaCode: '48f28bd7-2101-44be-b58f-04f9608dfe4b',
    extensionVersion: '1.13.17',
    releaseVersion: '1.0',
    staticUrl: 'https://prod-viz-saas-extensions.narrativescience.com'
  };

  staticUrl = "" + config.staticUrl + "/v1/extensions/qlik-sense/" + config.releaseVersion + "/static";

  define([
    "" + staticUrl + "/main.js?user_key=" + config.apiKey + "&code=" + config.betaCode],
    function(main) {
      return main;
    });

}).call(this);
