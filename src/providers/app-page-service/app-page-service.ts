import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { CommonService } from '../commonService';

/*
  Generated class for the AppPageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
/**
 * 由于有的功能，需要中间件，用于页面的服务
 * 目前只用到事件监听，后期可能会添加别的功能
 */
@Injectable()
export class AppPageServiceProvider extends CommonService {

  constructor() {
    super();
  }

  
}
