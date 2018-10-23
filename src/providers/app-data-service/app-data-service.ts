import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable()
export class AppDataServiceProvider {

    constructor(
        private storage: Storage,
    ) {
        this.initProperties();
        this.getPropertiesStorage();
    }

    readonly APPDATASERVICE_PREIX = "App-Data-Service:";
    // 
    private storage_data = {
        hiddenData: false,
    }

    public hiddenData: boolean;

    initProperties() {
        Object.keys(this.storage_data).forEach(key => {
            let storage_set = localStorage.setItem.bind(localStorage);
            let storage_remove = localStorage.removeItem.bind(localStorage);
            // let storage_set = (k, v) =>
            //         this.storage
            //             .ready()
            //             .then(() => this.storage.set(k, JSON.stringify(v)));
            // let storage_remove = k =>
            //     this.storage.ready().then(() => this.storage.remove(k));

            Object.defineProperty(this, key, {
                get: () => {
                    return this.storage_data[key];
                },
                set: value => {
                    this.storage_data[key] = value;
                    if (value !== null && value !== undefined) {
                        storage_set(
                            this.APPDATASERVICE_PREIX + key,
                            JSON.stringify(value),
                        );
                    } else {
                        storage_remove(this.APPDATASERVICE_PREIX + key);
                    }
                },
                // 确保在 defineProperty 之后不允许再更改属性的设置。
                configurable: false,
                // 允许枚举
                enumerable: true,
            });
        });
      
    }

    private getPropertiesStorage() {
        Object.keys(this.storage_data).forEach(key => {
                this.storage_data[key] = this.isJSON(
                    localStorage.getItem(this.APPDATASERVICE_PREIX + key),
                );
        });
    }

    isJSON(str: any) {
        if (typeof str == "string") {
            try {
                return JSON.parse(str);
            } catch (e) {
                return str;
            }
        }
        return str;
    }
}