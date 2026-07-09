![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] plugin

This plugin module provides a simple access to key/vaue store of [Consul](https://www.consul.io/).
This module is a Seneca plugin. For a gentle introduction to Seneca
itself, see the [senecajs.org](http://senecajs.org) site.

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Support

Current Version: 0.1.0

Tested on: Node 0.10.36, Seneca 0.6.1

[Annotated Source Code](http://jmilkiewicz.github.io/seneca-consul-registry/doc/registry.html).

## Install

```sh
npm install seneca-consul-registry
```

## Quick Example

Get and set a key:

```js
require('seneca')()
  .use('registry-consul')
  .start()
  .wait('role:registry,cmd:set,key:color,value:red')
  .wait('role:registry,cmd:get,key:color')
  .step(function(data){
    console.log( data.value ) // == "red"
    return true;
  })
  .end()
```

## More Examples

See [test/](test/) for usage examples.

## Motivation

A key-value registry for Seneca microservices using [Consul](https://www.consul.io/) as the backend.

## Support

If you're using this module and need help, you can:

- Post a [github issue][]
- Tweet to [@senecajs][]

## API

### Action Patterns

#### `role:registry, cmd:set`

Set the value of a key.

Parameters:

   * key:   string; key name
   * value: any; key value; serialized to JSON

Response: none.


#### `role:registry, cmd:get`

Get the value of a key.

Parameters:

   * key:   string; key name

Response:

   * value: any; key value; deserialized from JSON


#### `role:registry, cmd:list`

List the sub keys of a key, under the tree structure, with _/_ as branch separator.

Parameters:

   * key:     string; key name or partial prefix name of key to query
   * recurse:  boolean, optional, default: false; if true, list all sub keys, if false, list only child keys 

Response:

   * keys: array[string]; keys in breadth first order


#### `role:registry, cmd:remove`

Remove the value of a key, and optionally all sub keys.

Parameters:

   * key:     string; key name or partial prefix name of key to remove
   * recurse:  boolean, optional, default: false; if true, remove value and all sub keys, if false, remove only value 

Response: none

## Contributing

The [Senecajs org][] encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

### Running tests

```sh
npm run test
```

## Background

Uses [Consul](https://www.consul.io/) for distributed key-value storage.

[Annotated Source Code](http://jmilkiewicz.github.io/seneca-consul-registry/doc/registry.html).
