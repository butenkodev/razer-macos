import { getMenuItemSetCustomColor } from '../menu/menucommon';
import { FeatureHelper } from '../feature/featurehelper';

export class RazerDevice {
  constructor(addon, settingsManager, razerProperties) {
    this.addon = addon;
    this.settingsManager = settingsManager;
    this.name = razerProperties.name;
    this.productId = razerProperties.productId;
    this.internalId = razerProperties.internalId;
    this.mainType = razerProperties.mainType;
    this.image = razerProperties.image;

    if(razerProperties.features == null) {
      this.features = FeatureHelper.getStandardFeaturesFor(this.mainType);
    } else {
      this.features = razerProperties.features.map(featureConfig => FeatureHelper.createFeatureFrom(featureConfig));
    }

    this.defaultColorSettings = {
      hex: '#ffff00',
      rgb: {
        r: 255,
        g: 255,
        b: 0,
      }
    };
  }

  async init() {
    this.settings = await this.settingsManager.getSettingsFor(this);
    return this;
  }

  getName() {
    return this.name;
  }

  getSettingsKey() {
    return 'razer_'+this.productId;
  }

  getDefaultSettings() {
    return {
      customColor1: this.defaultColorSettings
    };
  }

  async setSettings(settings) {
    this.settings = settings;
    return this.settingsManager.saveSettingsFor(this);
  }

  getMenuItem(razerApp) {
    let deviceMenu = [
      { type: 'separator' },
      {
        label: this.getName(),
      },
      { type: 'separator' },
    ];

    const featureMenu = this.features.map(feature => feature.getMenuItemFor(this, razerApp));
    deviceMenu = deviceMenu.concat(featureMenu);
    deviceMenu = deviceMenu.concat([getMenuItemSetCustomColor(this, 'Custom settings', razerApp)]);
    return deviceMenu;
  }

  //override in device types
  setModeNone() {}
  setModeStaticNoStore(color) {}
  setModeStatic(color) {}
  setSpectrum() {}
  setBreathe(color) {}

  serialize() {
    return {
      name: this.name,
      productId: this.productId,
      internalId: this.internalId,
      mainType: this.mainType,
      features: this.features,
      settings: this.settings,
      image: this.image,
    };
  }
}