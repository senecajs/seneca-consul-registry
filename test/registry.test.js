"use strict";


var util   = require('util')
var assert = require('assert')

var _   = require('lodash')

var seneca = require('seneca')


describe('plugin', function(){
  var si = seneca({log:'silent'})
  var consulOptions = {host:"localhost",port:"8500"}

   beforeEach(function(done){
    si.use('..',_.clone(consulOptions));
    require('consul')(_.clone(consulOptions)).kv.del({key:'k',recurse:true}, function(err) {
      if(err) throw err;
      done();
    })
  })


  it('getset', function(fin) {

    si
      .start(fin)

      .wait('role:registry,cmd:set,key:k1,value:v1')
      .wait('role:registry,cmd:get,key:k1')
      .step(function(data){
        assert('v1'==data.value)
        return true;
      })

      .wait('role:registry,cmd:get,key:k123')
      .step(function(data){
        assert(null==data.value)
        return true;
      })
      .end()
  })


  it('remove', function(fin) {
    
    si
      .start(fin)

      .wait('role:registry,cmd:set,key:k1,value:v1')
      .wait('role:registry,cmd:remove,key:k1')

      .wait('role:registry,cmd:get,key:k1')
      .step(function(data){
        assert(null==data.value)
        return true;
      })

      .wait('role:registry,cmd:set,key:k1/m1,value:v2')
      .wait('role:registry,cmd:set,key:k1/m2,value:v3')
      .wait('role:registry,cmd:remove,key:k1/m1')

      .wait('role:registry,cmd:get,key:k1/m1')
      .step(function(data){
        assert(null==data.value)
        return true;
      })

      .wait('role:registry,cmd:get,key:k1/m2')
      .step(function(data){
        assert('v3'==data.value)
        return true;
      })

      .wait('role:registry,cmd:set,key:k3/x/y,value:v4')
      .step(function(){
        return true;
      })

      .wait('role:registry,cmd:remove,key:k3/x,recurse:true')

      .wait('role:registry,cmd:get,key:k3/x/y')
      .step(function(data){
        assert(null==data.value)
        return true;
      })

      .wait('role:registry,cmd:get,key:k3/x')
      .step(function(data){
        assert(null==data.value)
        return true;
      })

      .end()
  })


  it('list', function(fin) {

    si
      .start(fin)

      .wait('role:registry,cmd:set,key:k1,value:v1')

      .wait('role:registry,cmd:list,key:k1')
      .step(function(data){
        assert.deepEqual(data.keys,[])
        return true;
      })

      .wait('role:registry,cmd:set,key:k1/m1,value:v2')
      .wait('role:registry,cmd:set,key:k1/m2,value:v3')
      .wait('role:registry,cmd:set,key:k1/m3/z,value:z3')

      .wait('role:registry,cmd:list,key:k1')
      .step(function(data){
        assert.deepEqual(data.keys,["m1","m2"])
        return true;
      })

      .wait('role:registry,cmd:set,key:k3,value:v4')
      .wait('role:registry,cmd:set,key:k3/x,value:v5')
      .wait('role:registry,cmd:set,key:k3/x/y,value:v6')
      .wait('role:registry,cmd:set,key:k3/x/z,value:v7')

      .wait('role:registry,cmd:list,key:k3,recurse:true')
      .step(function(data){
        assert.deepEqual(data.keys.sort(),["x","x/y","x/z"].sort())
        return true;
      })

      .end()
  })


})
