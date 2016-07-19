/* Copyright (c) 2015 Jakub Milkiewicz, MIT License */
/* jshint node:true, asi:true, eqnull:true, loopfunc:true */
"use strict";


var _ = require('lodash')
var consulReq = require('consul')
var valueProperty = _.property('Value')


module.exports = function consul_registry (options) {
  var seneca = this

  options = seneca.util.deepextend({
  },options)

  var consul;

  seneca.add('role:registry,cmd:set',    cmd_set)
  seneca.add('role:registry,cmd:get',    cmd_get)
  seneca.add('role:registry,cmd:remove', cmd_remove)
  seneca.add('role:registry,cmd:list',   cmd_list)


  function cmd_set( args, done ) {
     //TODO shall we check size of of value
    consul.kv.set(args.key, args.value, function(err, result) {
      done(err,{});
    });
  }


  function cmd_get( args, done ) {
   consul.kv.get({key:args.key,recurse:false}, function(err, result) {
      if( err ) {
        done(err);
      }
      else {
        done(null,{value:valueProperty(result || {})});
      }
    });
  }

  
  function cmd_remove( args, done ) {
    consul.kv.del({key:args.key,recurse:args.recurse || false}, function(err) {
      done(err,{});
    });
  }


  function cmd_list( args, done ) {
    var keyPath = buildKeyPath(args.key);    
    consul.kv.keys({key: keyPath}, function(err, result) {
      if ( !err || err.message === 'not found') {
        result = result || []
        var childFilter = args.recurse ? allChildren: immediateChildrenOnly;

        var keys = result.map(function (key) {
          return key.substring(keyPath.length)
        })
        keys = keys.filter(childFilter);

        done(null,{keys: keys});
      }
      else {
        done(err,null);
      }
    })
  }
  

  seneca.add('init:consul_registry',function(args,done){
    consul = consulReq(options);
    done();
  });

  return {
    name: "consul_registry"
  };
};

function buildKeyPath( searchKey ){
  return endsWithSlash(searchKey)? searchKey : searchKey+"/";
}

function endsWithSlash( searchKey ){
  return searchKey.indexOf("/", searchKey.length - 1) === searchKey.length -1;
}


var allChildren = _.constant(true);

var immediateChildrenOnly = function( keyName ){
    return keyName.indexOf("/") === -1
};
