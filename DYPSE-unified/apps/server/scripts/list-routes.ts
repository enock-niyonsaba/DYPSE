import app from '../app';
import { getRoutes } from '../src/utils/route-utils';
import {Express}  from 'express';

console.log('Registered Routes:');
const routes = getRoutes(app);
console.log(JSON.stringify(routes, null, 2));
