import axios from 'axios'

export const geocode = params => axios.get('https://restapi.amap.com/v3/geocode/geo'+params);
