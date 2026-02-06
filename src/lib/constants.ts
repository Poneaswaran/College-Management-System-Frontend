import { API_URL as CONFIG_API_URL } from '../config/constant';

export const APP_NAME = 'College Management System';
export const API_URL = import.meta.env.VITE_API_URL || CONFIG_API_URL;
export const ITEMS_PER_PAGE = 10;
