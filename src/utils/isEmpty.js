export const isEmpty = (obj) => {
    const type = typeof val;
    if ((obj !== null && type === 'object') || type === 'function') {
      const properties = Object.keys(obj);
       if (properties.length === 0 || properties.size === 0) { 
         return true;
       } 
     } 
     return !obj;
}