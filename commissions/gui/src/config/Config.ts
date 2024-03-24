/**
 * Created by satishazad on 16/01/24
 * File Name: Config
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/config
 */
import {ConfigurationModel, creatConfigModelFromJSON} from "../core/models/data_models/ConfigurationModel";

const configJSON = require('./env_local.json');

class Config {
    static instance = new Config();
    config: ConfigurationModel;
    constructor() {
        this.config = creatConfigModelFromJSON(configJSON);
    }
}


export default Config;
