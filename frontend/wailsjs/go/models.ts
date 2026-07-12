export namespace structs {
	
	export class ConfigGenerateImage {
	    mode: string;
	    model: string;
	    url_local: string;
	    url_cloud: string;
	    api_key_cloud: string;
	
	    static createFrom(source: any = {}) {
	        return new ConfigGenerateImage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mode = source["mode"];
	        this.model = source["model"];
	        this.url_local = source["url_local"];
	        this.url_cloud = source["url_cloud"];
	        this.api_key_cloud = source["api_key_cloud"];
	    }
	}
	export class ConfigGeneratePrompt {
	    mode: string;
	    model: string;
	    url_local: string;
	    url_cloud: string;
	    api_key_cloud: string;
	
	    static createFrom(source: any = {}) {
	        return new ConfigGeneratePrompt(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mode = source["mode"];
	        this.model = source["model"];
	        this.url_local = source["url_local"];
	        this.url_cloud = source["url_cloud"];
	        this.api_key_cloud = source["api_key_cloud"];
	    }
	}
	export class ConfigTraining {
	    mode: string;
	    model: string;
	    url_local: string;
	    url_cloud: string;
	    api_key_cloud: string;
	
	    static createFrom(source: any = {}) {
	        return new ConfigTraining(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mode = source["mode"];
	        this.model = source["model"];
	        this.url_local = source["url_local"];
	        this.url_cloud = source["url_cloud"];
	        this.api_key_cloud = source["api_key_cloud"];
	    }
	}
	export class LocalModelResponseItem {
	    model: string;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new LocalModelResponseItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.model = source["model"];
	        this.name = source["name"];
	    }
	}
	export class LocalModelResponseArray {
	    models: LocalModelResponseItem[];
	
	    static createFrom(source: any = {}) {
	        return new LocalModelResponseArray(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.models = this.convertValues(source["models"], LocalModelResponseItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

