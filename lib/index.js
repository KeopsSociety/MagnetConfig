/*!
 * node-config
 * Copyright(c) 2022 Keops Society
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

require('dotenv').config();

const path = require("path");
const fs = require("fs");
const yaml = require('js-yaml');
const convict = require('convict');
const convict_format_with_validator = require('convict-format-with-validator');

// Add all formats
convict.addFormats(convict_format_with_validator);

// Enable Yaml extension
convict.addParser({ extension: ['yml', 'yaml'], parse: yaml.load });

/**
 * Module exports.
 * @public
 */

module.exports = initConfig;

/**
 * Parse config file against convict schema and
 * returning an object to read properties.
 *
 * @param {string}    [directory] The folder where your config files are stored
 * @param {Object}    [schema] The object containing the structure and validation constraints
 * @param {Object}    [options={}] An object with options.
 * @param {boolean}   [options.validate=false] If true, will throw an error, else will throw warns.
 * @return {Object}   The parsed object to interact with
 * @public
 */

function initConfig (directory, schema, options) {
    const mergedSchema = {
        environment: {
            doc: 'The application environment.',
            format: ['production', 'development', 'test'],
            default: 'development',
            env: 'NODE_ENV',
            arg: 'environment'
        },
        ...schema
    };

    const mergedOptions = {
        validate: false,
        ...options
    };

    // Define a schema
    const config = convict(mergedSchema);

    const env = config.get('environment');
    const configFilePath = path.join(directory, `${env}.yml`);

    try {
        config.loadFile(configFilePath);
    } catch (e) {
        throw new Error('Cannot find config file in path: ' + configFilePath);
    }

    if (schema) {
        config.validate({allowed: mergedOptions.validate ? 'strict' : 'warn'}); // throws error if config does not conform to schema
    }

    const indentedJson = JSON.stringify(yaml.load(fs.readFileSync(configFilePath, 'utf8')), null, 4);
    // console.debug(indentedJson);

    return config.getProperties(); // so we can operate with a plain old JavaScript object and abstract away convict (optional)
}