import type Cesium from "cesium";
import { XhrResponse, XhrResponseHandler, proxy } from "ajax-hook";
import pako from "pako";
type CesiumType = typeof Cesium;

export function isGzip(buffer: ArrayBuffer): boolean {
	const view = new Uint8Array(buffer);
	return view[0] === 0x1f && view[1] === 0x8b;
}

export function loadCesiumGzParser(Cesium: CesiumType) {
	const fetchImage = Cesium.Resource.prototype.fetchImage;
	// 重写fetchImage方法，增加对ktx2.gz的支持
	Cesium.Resource.prototype.fetchImage = function (...args: any) {
		const isKtx2Gz = /\.ktx2\.gz$/.test(this.url);
		if (isKtx2Gz) {
			return (Cesium as any).loadKTX2(this);
		}
		return fetchImage.apply(this, args);
	};
	proxy({
		onResponse: async (res: XhrResponse, handler: XhrResponseHandler) => {
			const { response } = res;
			// 如果类型是Blob，需要先解析为arrayBuffer, 再判断是否为gzip，然后解压
			if (response instanceof Blob) {
				const buffer = await response.arrayBuffer();
				if (isGzip(buffer)) {
					const inflateBuffer = pako.inflate(buffer);
					res.response = new Blob([inflateBuffer], { type: response.type });
				}
			} else if (isGzip(response)) {
				res.response = pako.inflate(new Uint8Array(response));
			}
			handler.next(res);
		},
	});
}

/**
 * @describing xhr添加简易的响应拦截器
 */
// export function xhrResInterceptor() {
//   const origin = XMLHttpRequest.prototype.open;

//   (XMLHttpRequest as any).prototype.open = function (...args: any) {
//     //在这里插入open拦截代码
//     this.__on_response = function (res: any) {
//       return res;
//     };
//     return origin.apply(this, args);
//   };
//   const accessor = Object.getOwnPropertyDescriptor(
//     XMLHttpRequest.prototype,
//     "response"
//   );

//   Object.defineProperty(XMLHttpRequest.prototype, "response", {
//     get: function () {
//       let response = accessor?.get?.call(this);

//       //在__on_response里修改你的response
//       response = this.__on_response(response);

//       return response;
//     },
//     set: function (str) {
//       accessor?.set?.call(this, str);
//     },
//     configurable: true
//   });
// }

/**
 * @describing 通过修改源码加载gz文件
 * @param {*} param0
 */
// export function modifyCesiumSourceLoadGz(Cesium: CesiumType) {
//   xhrResInterceptor();
//   const loadWithXhr = (Cesium.Resource as any)._Implementations.loadWithXhr;
//   // 通过xhr的res拦截器判断是否gz，然后解压
//   (Cesium.Resource as any)._Implementations.loadWithXhr = function (...args: any) {
//     const xhr = loadWithXhr.apply(this, args);
//     // const extNameReg = /(\.ktx2\.gz$)|(\.bin\.gz$)|(\.glb\.gz$)|(\.gltf\.gz$)/;
//     if (xhr) {
//       xhr.__on_response = (res: any) => {
//         if (isGzip(res)) {
//           // eslint-disable-next-line no-undef
//           res = pako.inflate(new Uint8Array(res));
//         }
//         return res;
//       };
//     }
//     return xhr;
//   };
//   (Cesium.Resource as any)._DefaultImplementations.loadWithXhr =
//     (Cesium.Resource as any)._Implementations.loadWithXhr;
//   //  通过判断blob是否为gz，然后解压
//   (Cesium.Resource as any).createImageBitmapFromBlob = async function (blob: Blob, options: any) {
//     (Cesium as any).defined("options", options);
//     (Cesium as any).Check.typeOf.bool("options.flipY", options.flipY);
//     (Cesium as any).Check.typeOf.bool(
//       "options.premultiplyAlpha",
//       options.premultiplyAlpha
//     );
//     (Cesium as any).Check.typeOf.bool(
//       "options.skipColorSpaceConversion",
//       options.skipColorSpaceConversion
//     );
//     const data = await blob.arrayBuffer();
//     if (isGzip(data)) {
//       // eslint-disable-next-line no-undef
//       const buffer = pako.inflate(data);
//       blob = new Blob([buffer], { type: blob.type });
//     }
//     return createImageBitmap(blob, {
//       imageOrientation: options.flipY ? "flipY" : "none",
//       premultiplyAlpha: options.premultiplyAlpha ? "premultiply" : "none",
//       colorSpaceConversion: options.skipColorSpaceConversion
//         ? "none"
//         : "default"
//     });
//   };
// }
