import { FLP_Route } from "./FLP_Route";
import { NavController, NavParams } from "ionic-angular";

// TODO: 待添加表单验证器
export class FLP_Form extends FLP_Route {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
    ) {
        super(navCtrl,navParams);
    }
    // 输入框收集器
    inputstatus = {};
    setInputstatus(formKey: string, e) {
        this.inputstatus[formKey] = e.type;
        if (e.type === "input") {
            this.checkFormKey(formKey);
        }
        this.event.emit("input-status-changed", {
            key: formKey,
            event: e,
        });
    }
    handlerInputValueLength(inputDom: any, length: number) {
        if(inputDom.value && inputDom.value.length > length) {
           inputDom.value = inputDom.value.substr(0,length);
        }
    }
    handlerInputValueInt(inputDom: any, minValue: string | number = 0, maxValue: string| number = undefined) {
        if(inputDom.value) {
            const _index = String(inputDom.value).indexOf('.');
            let _value = inputDom.value;
            inputDom.value = +_value >= 0 ? String(_value) : minValue;
            if(_index >= 0) {
                inputDom.value =  _value.substr(0, _index)
            }
            if(maxValue != undefined) {
                inputDom.value = +inputDom.value > maxValue ? String(maxValue) : inputDom.value;
            }
        }
    }
    checkFormKey(formKey: string) {
        if (this._error_checks_col[formKey]) {
          this._error_checks_col[formKey].forEach(fun_key => {
            try {
              this[fun_key]();
            } catch (err) {
              console.warn("表单检查出错", fun_key, err);
            }
          });
        }
    } 
    private __ecc__?: { [prop_name: string]: string[] };
    private get _error_checks_col() {
        return this.__ecc__ || (this.__ecc__ = {});
    }
    formData: any = {};
    errors: any = {};
    ignore_keys: string[] = [];
    hasError(errors = this.errors) {
      for (var k in errors) {
        return true;
      }
      return false;
    }

    get canSubmit() {
        return (
            !this.hasError(this.errors) &&
            Object.keys(this.formData).every(k => {
            return (
                this.ignore_keys.indexOf(k) !== -1 ||
                this.formData[k] ||
                typeof this.formData[k] === "boolean"
            );
            })
        );
    }
}