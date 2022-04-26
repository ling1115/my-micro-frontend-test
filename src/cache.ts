const cache: Record<string,  any> = {};

export const setCache = (key: string, url: string, vlalue: any)=>{
  cache[key] = {
    ...cache[key],
    [url]: vlalue
  }
}

export const getCache = (key: string, url:string)=>{
  if(cache[key]){
    return cache[key][url];
  }
}