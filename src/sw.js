import ServiceWorker from './lib/ServiceWorker'

if (typeof ServiceWorkerGlobalScope !== 'undefined' 
  && self !== 'undefined' 
  && self instanceof ServiceWorkerGlobalScope) 
{
  new ServiceWorker()
}
