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

}

