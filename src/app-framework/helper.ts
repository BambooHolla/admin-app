import { EventEmitter } from "eventemitter3";
import * as socketio from "socket.io-client";
import { AppDataServiceProvider } from "../providers/app-data-service/app-data-service";


export const is_dev = (() => {
	const test_fun = function DEV_WITH_FULL_NAME() {};
	return test_fun.name === "DEV_WITH_FULL_NAME";
})();

export const global = typeof self === "object" ? self : window;

export function tryRegisterGlobal(name, obj) {
	if (is_dev) {
		return (global[name] = obj);
	}	
}

/*通用的AppUrl*/
export class AppUrl {
	static SERVER_URL = "http://192.168.18.23:40001";
	static SERVER_PREFIX = "/api/v1/bngj";
	// static SERVER_PREFIX = "";
	constructor(public path: string) {}

	toString() {
		return (this.disposable_server_url || AppUrl.SERVER_URL)
		+ AppUrl.SERVER_PREFIX + this.path;
	}
	_disposable_server_url?: string;
	get disposable_server_url() {
		const res = this._disposable_server_url;
		this._disposable_server_url = undefined;
		return res;
	}
	disposableServerUrl(server_url: string) {
		this._disposable_server_url = server_url;
		return this;
	}
}


export const baseConfig = new class BaseConfig {
	private _SERVER_URL = AppUrl.SERVER_URL;
	get SERVER_URL() {
		return this._SERVER_URL;
	}
	set SERVER_URL(v: string) {
		AppUrl.SERVER_URL = v;
		this._SERVER_URL = v;
	}
}();

class WSIOInstance extends EventEmitter {
	constructor(
		public server_url: string, 
		public nsp: string,
		public appId: string,
	) {
		super();
		this.initIo();
		
		this.on("token@valid", (token) => {
			this.openIo(token);
		});
		this.on("token@expire", (token) => {
			this.closeIo(token);
		});
	}
	get io_url_path() {
		return this.server_url + this.nsp;
	}
	private _onLine = navigator.onLine;
	get onLine() {
		return this._onLine;
	}
	private _io?: SocketIOClient.Socket;

	private initIo() {
		if (!this._io) {
			const io = socketio(this.io_url_path, {
				transports: ["websocket"],
				path: '/socket/v1/bngj/push/socket.io'
			});
			this._io = io;
			this._io.on("connect", () => {
				this._onLine = true;
				// this.emit("ononline");
				this.emit('io@reconnect');
			});
			this._io.on("disconnect", () => {
				
				this._onLine = false;
				console.log("sockt disconnect")
				// this.emit("onoffline");
			});
			this._io.on("connect_error", () => {
				this._onLine = false;
				console.log("sockt connect_error")
				// this.emit("onoffline");
			});
			this._io.on("data", (data) => {
				console.log("sockt watch data:",data)
				this.emit("io@data",data);
			});
			// 尝试自动重连，可能一开始服务就不可用，后面才可用的，所以reconnect没法正常工作
			setInterval(() => {
				if (io.connected === false) {
					io.connect();
				}
			}, 1e4);
		} else if(!this._onLine) {
			this._io.open();
		}
		return this._io
	}

	private emitIo(type: string, token:string) {
		this._io.emit(type,[this.appId, token]);
	}
	public closeIo(token: string) {
		if(!this._io) return ;
		this.emitIo('unwatch', token);
	}
	
	public openIo(token: string) {
		!this._io && this.initIo();
		this.emitIo('watch',token);
	}
	// get io() {
	// 	if (!this._io) {
	// 		const io = socketio(this.io_url_path, {
	// 			transports: ["websocket"],
	// 			path: '/socket/v1/bngj/push/socket.io'
	// 		});
	// 		this._io = io;
	// 		this._io.on("connect", () => {
	// 			this._onLine = true;
	// 			this._io.emit("watch",["1002289437"])
	// 			this.emit("ononline");
	// 		});
	// 		this._io.on("disconnect", () => {
	// 			this._onLine = false;
	// 			this.emit("onoffline");
	// 		});
	// 		this._io.on("connect_error", () => {
	// 			this._onLine = false;
	// 			this.emit("onoffline");
	// 		});
	// 		// 尝试自动重连，可能一开始服务就不可用，后面才可用的，所以reconnect没法正常工作
	// 		this._interval_obj = setInterval(() => {
	// 			if (io.connected === false) {
	// 				io.connect();
	// 			}
	// 		}, 1e4);
	// 	}
	// 	return this._io;
	// }
}
const WSIOInstanceMap = new Map<string, WSIOInstance>();

export function getSocketIOInstance(server_url: string, nsp: string, appID: string) {
	const key = server_url + nsp;
	let ins = WSIOInstanceMap.get(key);
	if (!ins) {
		ins = new WSIOInstance(server_url, nsp, appID);
	}
	return ins;
}

export const afCtrl = new class RafController {
	_raf_id_acc = 0;
	_raf_map = {};
	private _raf_register(callback) {
		this._raf_map[++this._raf_id_acc] = callback;
		if (this._cur_raf_id === null) {
			this._cur_raf_id = this.native_raf(t => {
				const raf_map = this._raf_map;
				this._raf_map = {};
				this._cur_raf_id = null;
				for (var _id in raf_map) {
					const cb = raf_map[_id];
					try {
						cb(t);
					} catch (err) {
						console.error(err);
					}
				}
			});
		}
		return this._raf_id_acc;
	}
	private _raf_unregister(id) {
		delete this._raf_map[id];
		var has_size = false;
		for (var _k in this._raf_map) {
			has_size = true;
			break;
		}
		if (has_size && this._cur_raf_id !== null) {
			this.native_unraf(this._cur_raf_id);
			this._cur_raf_id = null;
		}
	}
	private _cur_raf_id: number | null = null;
	native_raf(callback) {
		const raf = (
			window["__zone_symbol__requestAnimationFrame"] ||
			window["webkitRequestAnimationFrame"]
		).bind(window);
		this.native_raf = raf;
		return raf(callback);
	}
	native_unraf(rafId) {
		const caf = (
			window["__zone_symbol__cancelAnimationFrame"] ||
			window["webkitCancelAnimationFrame"]
		).bind(window);
		this.native_unraf = caf;
		return caf(rafId);
	}

	raf(callback) {
		return this._raf_register(callback);
	}
	caf(rafId) {
		return this._raf_unregister(rafId);
	}
}();

