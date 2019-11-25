import ServiceWorker from './lib/sw/ServiceWorker'

if (typeof ServiceWorkerGlobalScope !== 'undefined' 
  && self !== 'undefined' 
  && self instanceof ServiceWorkerGlobalScope) 
{
  new ServiceWorker()
}
