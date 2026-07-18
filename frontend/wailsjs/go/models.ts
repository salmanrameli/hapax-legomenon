export namespace structs {
	
	export class AvailableLocalModels {
	    Label: string;
	    Value: string;
	
	    static createFrom(source: any = {}) {
	        return new AvailableLocalModels(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Label = source["Label"];
	        this.Value = source["Value"];
	    }
	}
	export class ConfigGenerateImage {
	    mode: string;
	    model: string;
	    url_local: string;
	    url_cloud: string;
	    api_key_cloud: string;
	    steps: number;
	    dimension_width: number;
	    dimension_height: number;
	
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
	        this.steps = source["steps"];
	        this.dimension_width = source["dimension_width"];
	        this.dimension_height = source["dimension_height"];
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
	export class UserProjectItem {
	    id: string;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new UserProjectItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	    }
	}

}

