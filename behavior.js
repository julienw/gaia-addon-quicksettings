/*global
  addOnManager
 */

'use strict';
(function(exports) {
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    //Object.getOwnPropertyNames(window).sort().forEach((key) => console.log(key));
    /*
    for (var key in window) {
      console.log(key);
    }
    */
    //Object.keys(window).sort().forEach((key) => console.log(key));

    console.log('DOMContentLoaded');
    window.addOnManager.when('QuickSettings').then((QuickSettings) => {
      console.log('>>> got quicksettings');
      QuickSettings.contribute({
        onReady(addIcon) {
          console.log('onReady');
          var elt = addIcon({
            id: 'quick-settings-battery-mode',
            icon: 'battery-10'
          });

          elt.addEventListener('click', onClick);
        }
      });
    });
  }

  var settings = {
    'screen.timeout': 60,
    'screen.automatic-brightness': false,
    'screen.brightness': 0.1,
    'wifi.sleepMode': true
  };

  var savedSettings;
  var processing = false;

  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (processing) {
      return;
    }

    var enabling = e.target.dataset.enabled === 'false';
    processing = true;

    var lock = navigator.mozSettings.createLock();
    var settingsKeys = Object.keys(settings);
    var endPromise;
    if (enabling) {
      savedSettings = {};
      endPromise = Promise.all(
        settingsKeys.map((setting) => lock.get(setting))
      ).then(results => {
        settingsKeys.forEach((key, i) => {
          savedSettings[key] = results[i][key];
        });

        console.log('enaling');
        console.log('results are', JSON.stringify(results));
        console.log('saved', JSON.stringify(savedSettings));

        return Promise.resolve(navigator.mozSettings.createLock().set(settings));
      });
    } else {
      endPromise = Promise.all(
        settingsKeys.map((setting) => lock.get(setting))
      ).then(results => {
        console.log('disabling');
        console.log('results are', JSON.stringify(results));
        settingsKeys.forEach((key, i) => {
          if (settings[key] !== results[i][key]) {
            delete savedSettings[key];
          }
        });

        console.log('will reset to', savedSettings);

        var promise = navigator.mozSettings.createLock().set(savedSettings);
        savedSettings = {};
        return Promise.resolve(promise);
      });
    }

    endPromise.then(() => processing = false);
    e.target.dataset.enabled = enabling;
  }
})(window);
