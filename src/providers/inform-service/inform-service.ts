import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../commonService';
import { AppFetchProvider } from '../app-fetch/app-fetch';

/*
  Generated class for the InformServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InformServiceProvider extends CommonService {

	constructor(
		public fetch: AppFetchProvider,
	) {
		super();
		this.fetch.on("io@data",this.getInforms.bind(this))
		

	}

	getInforms(data) {
		console.log("inform",data)
	}
}
