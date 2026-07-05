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

}

