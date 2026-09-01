 const checkPermission = (data,id) => {
     // Create a queue and add the root items
    let queue = Array.isArray(data) ? [...data] : [data];
    
    while (queue.length > 0) {
        const item = queue.shift();
        
        // Check if current item matches
        if (item.id === id) {
            return item;
        }
        
        // Add subModules to queue if they exist
        if (item.subModules && item.subModules.length > 0) {
            queue.push(...item.subModules);
        }
        
        // Add items to queue if they exist
        if (item.items && item.items.length > 0) {
            queue.push(...item.items);
        }
    }
    
    return null;
  };
export default checkPermission;