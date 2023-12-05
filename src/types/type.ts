import type Cesium from "cesium";
import LocalForage from "localforage";

export type CesiumType = typeof Cesium;
export type ILocalForage = typeof LocalForage;
export type Nullable<T> = T | null;

export interface ILoadCesiumGzParserOpt {
	useIndexDB?: boolean;
}