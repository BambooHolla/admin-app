import { FLP_Tool, tryRegisterGlobal } from "./FLP_Tool";
import {
    OnInit,
    AfterContentInit,
    OnDestroy,
    ChangeDetectorRef,
} from "@angular/core";
import { PAGE_STATUS } from "./const";

let uuid: number = 0;

export class FLP_Lifecycle extends FLP_Tool implements OnInit, AfterContentInit, OnDestroy {
    public cname: string = this.constructor.name;
    public instance_id = ++uuid;
    public PAGE_LEVEL = 1;
    public PAGE_STATUS = PAGE_STATUS.UNLOAD;
    constructor() {
        super();
        console.log(this.cname, this);
        tryRegisterGlobal("instanceOf" + this.cname, this);
    }

    ngOnInit() {
        // console.log("ngOnInit",this.content,this.header)
        // this.content.fullscreen = true;
        this._oninit_funs.forEach( fun_name => {
            try {
                this[fun_name]();
            } catch(err) {
                console.error(fun_name,err)
            }
        });
        this.tryEmit("onInit");
    }
    ngAfterContentInit() {
        this._aftercontentinit_funs.forEach( fun_name => {
            try {
                this[fun_name]();
            } catch(err) {
                console.error(fun_name,err)
            }
        });
        this.tryEmit("afterContentInit");
    }
    ngOnDestroy() {
        this._ondestory_funs.forEach( fun_name => {
            try {
                this[fun_name]();
            } catch(err) {
                console.error(fun_name,err)
            }
        });
        this.tryEmit("onDestory");
    }

    ionViewWillEnter() {
        this._will_enter_funs.forEach( fun_name => {
            try {
                this[fun_name]();
            } catch(err) {
                console.error(fun_name,err)
            }
        });
        this.PAGE_STATUS = PAGE_STATUS.WILL_ENTER;
        console.log("ionViewWillEnter", this.cname);
        this.tryEmit("willEnter");
    }

    @FLP_Tool.FromGlobal myapp!: any;
    cdRef?: ChangeDetectorRef;
    ionViewDidEnter() {
        this.PAGE_STATUS = PAGE_STATUS.DID_ENTER;
        if(this.cdRef instanceof ChangeDetectorRef) {
            this.cdRef.reattach();
        }
    
        console.log("ionViewDidEnter", this.cname);
        // this.myapp.hideSplashScreen();
        // this.myapp.tryOverlaysWebView(3);
        
        this._did_enter_funs.forEach( fun_name => {
            try {
                this[fun_name]();
            } catch (err) {
                console.error(fun_name, err);
            }
        });
        this.tryEmit("didEnter");
    }
    ionViewWillLeave() {
        this.PAGE_STATUS = PAGE_STATUS.WILL_LEAVE;
        console.log("ionViewWillLeave", this.cname);

        this._will_leave_funs.forEach( fun_name => {
            try {
                this[fun_name]();
            } catch (err) {
                console.error(fun_name, err);
            }
        });
        this.tryEmit("willLeave");
    }
    ionViewDidLeave() {
        this.PAGE_STATUS = PAGE_STATUS.DID_LEAVE;
        if(this.cdRef instanceof ChangeDetectorRef) {
            this.cdRef.detach();
        }
        console.log("ionViewDidLeave", this.cname);
        
        this._did_leave_funs.forEach( fun_name => {
            try {
                this[fun_name]();
            } catch (err) {
                console.error(fun_name, err);
            }
        })
      
        this.tryEmit("didLeave");
    }

    // 生命周期修饰器
    // 这里只保存属性名，在调用的时候就能获取到最终被其它修饰器修饰完的属性值
    @FLP_Lifecycle.cacheFromProtoArray("onInit")
    private _oninit_funs!: Set<string>;
    static onInit(target: any, name: string, descriptor?: PropertyDescriptor) {
      FLP_Tool.addProtoArray(target, "onInit", name);
      return descriptor;
    }
    @FLP_Lifecycle.cacheFromProtoArray("afterContentInit")
    private _aftercontentinit_funs!: Set<string>;
    static afterContentInit(target: any, name: string, descriptor?: PropertyDescriptor) {
      FLP_Tool.addProtoArray(target, "afterContentInit", name);
      return descriptor;
    }
    @FLP_Lifecycle.cacheFromProtoArray("onDestory")
    private _ondestory_funs!: Set<string>;
    static onDestory(target: any, name: string, descriptor?: PropertyDescriptor) {
      FLP_Tool.addProtoArray(target, "onDestory", name);
      return descriptor;
    }
    @FLP_Lifecycle.cacheFromProtoArray("willEnter")
    private _will_enter_funs!: Set<string>;
    static willEnter(target: any, name: string, descriptor?: PropertyDescriptor) {
      FLP_Tool.addProtoArray(target, "willEnter", name);
      return descriptor;
    }
    @FLP_Lifecycle.fromProtoArray("didEnter")
    private _did_enter_funs!: Set<string>;
    static didEnter(target: any, name: string, descriptor?: PropertyDescriptor) {
      FLP_Tool.addProtoArray(target, "didEnter", name);
      return descriptor;
    }
    @FLP_Lifecycle.cacheFromProtoArray("willLeave")
    private _will_leave_funs!: Set<string>;
    static willLeave(target: any, name: string, descriptor?: PropertyDescriptor) {
      FLP_Tool.addProtoArray(target, "willLeave", name);
      return descriptor;
    }
    @FLP_Lifecycle.cacheFromProtoArray("didLeave")
    private _did_leave_funs!: Set<string>;
    static didLeave(target: any, name: string, descriptor?: PropertyDescriptor) {
      FLP_Tool.addProtoArray(target, "didLeave", name);
      return descriptor;
    }


    static cacheFromProtoArray(key) {
        return (target: any, name: string, descriptor?: PropertyDescriptor) => {
            const _cache_key = `-PA-${name}`;
            Object.defineProperty(target, name, {
                get() {
                    return (this[_cache_key] || (this[_cache_key] = FLP_Tool.getProtoArray(this, key)));
                },
            });
        };
    }
    static fromProtoArray(key) {
        return (target: any, name: string, descriptor?: PropertyDescriptor) => {
          Object.defineProperty(target, name, {
            get() {
              return FLP_Tool.getProtoArray(this, key);
            },
          });
        };
    }
}