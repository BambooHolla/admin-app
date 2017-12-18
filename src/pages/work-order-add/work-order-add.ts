import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { SecondLevelPage } from '../../bnlc-framework/SecondLevelPage';
import { asyncCtrlGenerator } from '../../bnlc-framework/Decorator';
import { FsProvider, FileType } from '../../providers/fs/fs';
import { ImageTakerController } from '../../components/image-taker-controller';

@Component({
	selector: 'page-work-order-add',
	templateUrl: 'work-order-add.html'
})
export class WorkOrderAddPage extends SecondLevelPage {
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public fs: FsProvider,
		public imageTakerCtrl: ImageTakerController
	) {
		super(navCtrl, navParams);
	}

	formData = new FormGroup({
		realName: new FormControl('', [Validators.required]),
		phoneNumber: new FormControl('', [
			Validators.required,
			Validators.pattern(/^1[34578]\d{9}$/)
		]),
		email: new FormControl('', [Validators.required, Validators.email]),
		category: new FormControl('', [Validators.required]),
		detail: new FormControl('', [Validators.required]),
		files: new FormControl('', [Validators.required])
	});
	get realName() {
		return this.formData.get('realName');
	}
	get phoneNumber() {
		return this.formData.get('phoneNumber');
	}
	get email() {
		return this.formData.get('email');
	}
	get category() {
		return this.formData.get('category');
	}
	get detail() {
		return this.formData.get('detail');
	}
	get files() {
		return this.formData.get('files');
	}

	images = [
		{ name: '1', text: '', image: null, fid: '', uploading: false },
		{ name: '2', text: '', image: null, fid: '', uploading: false },
		{ name: '3', text: '', image: null, fid: '', uploading: false }
	];

	category_list = [
		{
			value: '001',
			key: 'a',
			text: '啊'
		},
		{
			value: '002',
			key: 'b',
			text: '吗'
		},
		{
			value: '003',
			key: 'c',
			text: '了'
		}
	];
	upload(name) {
		const imageTaker = this.imageTakerCtrl.create(name);
		const fid_promise = this.fs.getImageUploaderId(FileType.身份证图片);
		imageTaker.onDidDismiss(async (result, role) => {
			if (role !== 'cancel' && result) {
				const image = this.images.find(
					item => item.name === result.name
				);
				// console.log('index: ', index, result);
				if (result.data) {
					// 开始上传
					await this.updateImage(fid_promise, image, result);
					const fids = this.images
						.map(img => img.fid)
						.filter(fid => fid);
					this.files.setValue(fids.join(' '));
				} else {
					image.image = 'assets/images/no-record.png';
				}
				// console.log(this.images);
			}
		});
		imageTaker.present();
	}
	@asyncCtrlGenerator.error('图片上传失败')
	async updateImage(
		fid_promise: Promise<any>,
		image: typeof WorkOrderAddPage.prototype.images[0],
		result: any
	) {
		image.uploading = true;
		try {
			const fid = await fid_promise;
			const result_data = result.data;
			const blob = this.dataURItoBlob(result_data);
			const blob_url = URL.createObjectURL(blob);
			image.image = result_data;
			const upload_res = await this.fs.uploadImage(fid, blob);
			console.log('upload_res', upload_res);
			if (image.image === result_data) {
				image.fid = fid;
			}
		} finally {
			image.uploading = false;
		}
	}

	dataURItoBlob(dataURI) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else byteString = decodeURI(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI
			.split(',')[0]
			.split(':')[1]
			.split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], { type: mimeString });
	}
}