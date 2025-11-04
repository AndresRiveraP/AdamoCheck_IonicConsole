package com.adamocheck;

import android.app.Application;
import android.content.Context;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          // Si tenías paquetes manuales, agrégalos aquí
          return new java.util.ArrayList<>();
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected Boolean isHermesEnabled() {
          return Boolean.TRUE;
        }

        @Override
        protected boolean isNewArchEnabled() {
          return false;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (mReactNativeHost.getReactInstanceManager().getDevSupportManager() != null) {
      DefaultNewArchitectureEntryPoint.load();
    }
  }
}
