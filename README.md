# seneca-consul-registry
## Seneca key-value registry for Consul


This plugin module provides a simple access to key/vaue store of [Consul](https://www.consul.io/).
This module is a Seneca plugin. For a gentle introduction to Seneca
itself, see the [senecajs.org](http://senecajs.org) site.


## Support

Current Version: 0.1.0

Tested on: Node 0.10.36, Seneca 0.6.1

[Annotated Source Code](http://jmilkiewicz.github.io/seneca-consul-registry/doc/registry.html).



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


## Usage

Keys are strings of the form: _a/b/c_ where each _/_ defines a branch
of a tree. In simple cases, you can treat keys as simple identifiers
and ignore this tree structure. In more complex cases you can use the
tree structure as a namespace mechanism. In particular, you can remove
and list keys recursively.


```js
require('seneca')()
  .use('registry-consul')
  .start()

  .wait('role:registry,cmd:set,key:x,value:1')
  .wait('role:registry,cmd:set,key:x/u,value:2')
  .wait('role:registry,cmd:set,key:x/v,value:3')
  .wait('role:registry,cmd:set,key:x/v/y,value:4')

  .wait('role:registry,cmd:list,key:x')
  .step(function(data){
    console.log( data.keys ) // == [ 'u', 'v' ]
    return true;
  })

  .wait('role:registry,cmd:list,key:x,recurse:true')
  .step(function(data){
    console.log( data.keys ) // == [ 'u', 'v', 'v/y' ]
    return true;
  })

  .end()
```

## Consul 

### Running Consul

The easiest way to run consul is by running it as docker container. 

	$ docker run -p 8400:8400 -p 8500:8500 -p 8600:53/udp -h node1 progrium/consul -server -bootstrap
	
Please take a look at [docker-consul](https://github.com/progrium/docker-consul) for details. 
 

### Consul Configuration parameters
You can specify connection parameters to Consul by passing them as options object when registering the plugin

```js
require('seneca')()
  .use('registry-consul',{host:"localhost", port:"5800"})
  .start()
  .end()
```


The exact parameters ( and their types) are the same as defined by [node-consul]  (https://github.com/silas/node-consul#init) init parameters

## Action Patterns


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









