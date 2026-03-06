import redisClient from "../config/redis.js";    

// Get value from cache
export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    if(data){
      console.log("getting data frmo cache");
    }
    return data ? JSON.parse(data) : null;
    
  } catch (error) {
    console.log("Redis GET error:", error.message);
    return null; // fallback safe
  }
};


//Set value in cache with TTL
export const setCache = async (key, value, ttl = 60) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    console.log("Cache added...");
    
  } catch (error) {
    console.log("Redis SET error:", error.message);
  }
};

//Delete cache by pattern (safe small app usage)
export const deleteByPattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("Deleted cache...");
      
    }
  } catch (error) {
    console.log("Redis DEL error:", error.message);
  }
};