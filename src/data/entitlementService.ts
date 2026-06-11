import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  getAvailablePurchases,
  finishTransaction,
  type Product,
  type Purchase,
} from 'react-native-iap';
import {secureGet, secureSet} from './secureStorage';

/**
 * 会员权益（内购）服务层。
 *
 * 模式：iOS 单一「非消耗型」内购 = 一次性买断，永久解锁完整版。
 * 会员状态绑定用户的 Apple ID，换机靠「恢复购买」，与本地手机号登录无关。
 *
 * 当前为纯客户端校验（无服务端验收据），起步阶段够用；
 * 后期要防越狱破解，可加服务端验证 Apple 收据。
 */

// App Store Connect 里创建的非消耗型内购 Product ID（价格档：¥12）
export const PREMIUM_PRODUCT_ID = 'com.botonwa83.wordpulse.lifetime';

// 本地缓存会员状态的 key（存 Keychain，复用 secureStorage）
const ENTITLEMENT_KEY = 'premium';

// 拉不到商店本地化价格时的兜底展示
export const PRICE_FALLBACK = '¥12';

let connected = false;

/** 连接 App Store。重复调用安全。 */
export const initIAP = async (): Promise<boolean> => {
  if (connected) {
    return true;
  }
  try {
    await initConnection();
    connected = true;
    return true;
  } catch (e) {
    console.warn('[IAP] initConnection 失败:', e);
    return false;
  }
};

/** 断开商店连接（App 卸载 Provider 时调用）。 */
export const endIAP = async (): Promise<void> => {
  if (!connected) {
    return;
  }
  try {
    await endConnection();
  } catch {
    // 断开失败无需处理
  }
  connected = false;
};

/** 读取本地缓存的会员状态（秒开，不等网络）。 */
export const getCachedPremium = async (): Promise<boolean> => {
  try {
    const v = await secureGet(ENTITLEMENT_KEY);
    return v === '1';
  } catch {
    return false;
  }
};

/** 写入本地会员状态缓存。 */
export const setCachedPremium = async (val: boolean): Promise<void> => {
  try {
    await secureSet(ENTITLEMENT_KEY, val ? '1' : '0');
  } catch {
    // 缓存写入失败下次启动会重新校准，忽略
  }
};

/** 拉取内购商品（用于展示本地化价格）。 */
export const fetchPremiumProduct = async (): Promise<Product | null> => {
  try {
    const products = await getProducts({skus: [PREMIUM_PRODUCT_ID]});
    return (
      products.find(p => p.productId === PREMIUM_PRODUCT_ID) ||
      products[0] ||
      null
    );
  } catch (e) {
    console.warn('[IAP] getProducts 失败:', e);
    return null;
  }
};

/**
 * 发起购买。购买结果通过 purchaseUpdatedListener 异步回调，
 * 这里只负责把系统购买弹窗拉起来。
 */
export const requestPremiumPurchase = async (): Promise<void> => {
  await requestPurchase({sku: PREMIUM_PRODUCT_ID});
};

/**
 * 恢复购买：查询该 Apple ID 名下的历史购买，
 * 命中即视为会员（用于重装 / 换机 / 静默校准）。
 */
export const restorePremiumPurchase = async (): Promise<boolean> => {
  try {
    const purchases = await getAvailablePurchases();
    const owned = purchases.some(p => p.productId === PREMIUM_PRODUCT_ID);
    if (owned) {
      await setCachedPremium(true);
    }
    return owned;
  } catch (e) {
    console.warn('[IAP] 恢复购买失败:', e);
    return false;
  }
};

/** 完成交易（非消耗品，isConsumable=false），否则交易会反复回调。 */
export const finishPremiumTransaction = async (
  purchase: Purchase,
): Promise<void> => {
  try {
    await finishTransaction({purchase, isConsumable: false});
  } catch (e) {
    console.warn('[IAP] finishTransaction 失败:', e);
  }
};
