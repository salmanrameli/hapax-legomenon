export namespace main {
	
	export class AppConfig {
	    mode_generate_prompt: string;
	    mode_generate_image: string;
	
	    static createFrom(source: any = {}) {
	        return new AppConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mode_generate_prompt = source["mode_generate_prompt"];
	        this.mode_generate_image = source["mode_generate_image"];
	    }
	}
	export class CloudConfig {
	    url_generate_prompt: string;
	    api_key_generate_prompt: string;
	    url_generate_image: string;
	    api_key_generate_image: string;
	
	    static createFrom(source: any = {}) {
	        return new CloudConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.url_generate_prompt = source["url_generate_prompt"];
	        this.api_key_generate_prompt = source["api_key_generate_prompt"];
	        this.url_generate_image = source["url_generate_image"];
	        this.api_key_generate_image = source["api_key_generate_image"];
	    }
	}
	export class LocalConfig {
	    url_generate_prompt: string;
	    url_generate_image: string;
	
	    static createFrom(source: any = {}) {
	        return new LocalConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.url_generate_prompt = source["url_generate_prompt"];
	        this.url_generate_image = source["url_generate_image"];
	    }
	}

}

