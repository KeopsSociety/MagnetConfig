# MagnetConfig

MagnetConfig is a Node module that make access to config variables easy and simple, 
giving the possibility to validate them against a schema thanks to [convict](https://github.com/mozilla/node-convict),
also takes care of command arguments and environment variables with [dotenv](https://github.com/motdotla/dotenv)

---

## Installation

```bash
# install locally (recommended)
npm install magnet-config --save
```

---

## Usage

- Create a `config` directory in your project
- Create a `development.yml` file in config directory or any environment you desire


### 1 Basic usage

As early as possible in your application, import and configure magnet-config:

```javascript
//import
const initConfig = require('magnet-config');

//where is your config files
const configFolder = path.join(__dirname, 'config');

//basic initialization
const config = initConfig(configFolder);

//to use config anywhere
global.config = config;

//show result
console.log(config);
```

Your yaml file should look something like this:
```yaml
# Server info
server:
  url: localhost
  port: 3000

# Database config
datasource:
  hostname: localhost:3306
  database: database
  username: username
  password: secret
  dialect: postgres

# View engine
views:
  engine: hbs
  extension: hbs
  layouts:
    default: main
i18n:
  defaultLanguage: en
  supportedLanguages:
    - en
    - es
    - fr

# Cookie & Session
secret: mySecretKey 
# Secrets should be provided using command line or environment variables
```

> **:warning: Secrets and passwords:**
> 
> Secrets should be provided using command line or environment variables

To use environment variables or command arguments, see [dotenv repository](https://github.com/motdotla/dotenv/blob/master/README.md#usage) for more information.


### 2 Advanced usage

```javascript
//example schema
const schema = {
    server: {
        url: {
            doc: 'The IP address to bind.',
            format: 'url',
            default: '127.0.0.1',
            env: 'SERVER_URL',
            arg: 'server-url'
        },
        port: {
            doc: 'The port to bind.',
            format: 'port',
            default: 8080,
            env: 'PORT',
            arg: 'port'
        }
    }
};

//initialization with schema and options
const config = initConfig(configFolder, schema, { validate: true });

//remove this after test your config
console.log('https://' + config.server.url + ':' + config.server.port);
```

Try to run your project with some command arguments:
```bash
node index.js --port=3000
```

Here is an example schema:
```javascript
/**
 * Use this class to define your validations constraints for configuration.
 * To see more documentation visit:
 * https://www.npmjs.com/package/convict
 * https://www.npmjs.com/package/dotenv
 * @public
 */

module.exports = {
    environment: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV',
        arg: 'environment'
    },

    server: {
        url: {
            doc: 'The IP address to bind.',
            format: 'url',
            default: '127.0.0.1',
            env: 'SERVER_URL',
            arg: 'server-url'
        },
        port: {
            doc: 'The port to bind.',
            format: 'port',
            default: 8080,
            env: 'PORT',
            arg: 'port'
        }
    },

    datasource: {
        hostname: {
            doc: 'Database host name/IP',
            format: '*',
            default: 'server1.dev.test',
            env: 'DB_HOSTNAME'
        },
        database: {
            doc: 'Database name',
            format: String,
            default: 'users',
            env: 'DB_DATABASE'
        },
        username: {
            doc: 'Database user',
            format: String,
            default: 'root',
            env: 'DB_USERNAME'
        },
        password: {
            doc: 'Database password',
            format: String,
            default: 'root',
            env: 'DB_PASSWORD'
        },
        dialect: {
            doc: 'Database dialect',
            format: ['mysql', 'mariadb', 'postgres', 'mssql', 'sqlite'],
            default: null,
            env: 'DB_DIALECT'
        }
    },

    views: {
        engine: {
            doc: 'Engine to use for view rendering',
            format: String,
            nullable: true,
            default: null
        },
        extension: {
            doc: 'Extension name of views',
            format: String,
            nullable: true,
            default: null
        },
        layouts: {
            default: {
                doc: 'Default layout to use when rendering views',
                format: String,
                default: 'index'
            },
        },
    },

    i18n: {
        defaultLanguage: {
            doc: 'Default language to use if no one was specified',
            format: String,
            nullable: true,
            default: null
        },
        supportedLanguages: {
            doc: 'Available languages',
            format: Array,
            nullable: true,
            default: null
        },
    },
}
```

For more information about schema and validation, check out the [convict repository](https://github.com/mozilla/node-convict/tree/master/packages/convict#usage).

---