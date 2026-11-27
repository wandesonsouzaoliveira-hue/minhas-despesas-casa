const CACHE='despesas-casa-v2';
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(['./','./index.html','./manifest.json']);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('despesas-casa-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(event.request);
        const cache=await caches.open(CACHE);
        cache.put('./index.html',response.clone());
        return response;
      }catch(error){
        return (await caches.match('./index.html'))||Response.error();
      }
    })());
  }
});