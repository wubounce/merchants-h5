/**
 *  支付宝和实名认证
 */
import { fetch } from './baseService';

const getAliAndStatusApi = 'operator/getAliAndStatus';

export const getAliAndStatusFun = (payload) => fetch.post(getAliAndStatusApi, payload);