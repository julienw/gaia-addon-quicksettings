/*global
  AddOnManager
 */

'use strict';

AddOnManager.when('QuickSettings').then((QuickSettings) => {
  QuickSettings.contribute({
    onReady(addIcon) {
      addIcon({
        id: 'quick-settings-battery-mode',
        icon: 'battery-10'
      });
    },
    onClick() {
    }
  });
});
