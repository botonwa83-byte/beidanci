import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {Alert} from 'react-native';
import {
  purchaseUpdatedListener,
  purchaseErrorListener,
  type Purchase,
  type PurchaseError,
} from 'react-native-iap';
import {
  PREMIUM_PRODUCT_ID,
  PRICE_FALLBACK,
  initIAP,
  endIAP,
  getCachedPremium,
  setCachedPremium,
  fetchPremiumProduct,
  requestPremiumPurchase,
  restorePremiumPurchase,
  finishPremiumTransaction,
} from './entitlementService';

interface EntitlementContextValue {
  isPremium: boolean; // 是否已解锁完整版
  loading: boolean; // 购买/恢复进行中
  price: string; // 本地化价格，如 "¥12.00"
  purchase: () => Promise<void>; // 发起购买
  restore: () => Promise<void>; // 恢复购买（带结果提示）
}

const EntitlementContext = createContext<EntitlementContextValue>({
  isPremium: false,
  loading: false,
  price: PRICE_FALLBACK,
  purchase: async () => {},
  restore: async () => {},
});

export const EntitlementProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<string>(PRICE_FALLBACK);

  useEffect(() => {
    let updateSub: {remove: () => void} | undefined;
    let errorSub: {remove: () => void} | undefined;

    (async () => {
      // 1. 先用本地缓存秒开，不等网络
      setIsPremium(await getCachedPremium());

      // 2. 连接商店；连不上就只用缓存状态
      const ok = await initIAP();
      if (!ok) {
        return;
      }

      // 3. 监听购买结果（购买弹窗确认后走这里）
      updateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
        if (purchase.productId === PREMIUM_PRODUCT_ID) {
          await setCachedPremium(true);
          setIsPremium(true);
          await finishPremiumTransaction(purchase);
        }
        setLoading(false);
      });

      errorSub = purchaseErrorListener((err: PurchaseError) => {
        setLoading(false);
        if (err.code !== 'E_USER_CANCELLED') {
          Alert.alert('购买未完成', err.message || '请稍后重试');
        }
      });

      // 4. 拉本地化价格
      const product = await fetchPremiumProduct();
      if (product?.localizedPrice) {
        setPrice(product.localizedPrice);
      }

      // 5. 静默恢复，校准会员状态（应对重装/换机）
      const owned = await restorePremiumPurchase();
      if (owned) {
        setIsPremium(true);
      }
    })();

    return () => {
      updateSub?.remove();
      errorSub?.remove();
      endIAP();
    };
  }, []);

  const purchase = useCallback(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await requestPremiumPurchase();
      // 成功/失败由上面的 listener 收尾并重置 loading
    } catch (e: any) {
      setLoading(false);
      if (e?.code !== 'E_USER_CANCELLED') {
        Alert.alert('购买未完成', e?.message || '请稍后重试');
      }
    }
  }, [loading]);

  const restore = useCallback(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const owned = await restorePremiumPurchase();
    setIsPremium(owned);
    setLoading(false);
    Alert.alert(
      owned ? '已恢复' : '未找到购买记录',
      owned
        ? '完整版权益已恢复 🎉'
        : '该 Apple ID 下没有可恢复的购买记录',
    );
  }, [loading]);

  return (
    <EntitlementContext.Provider
      value={{isPremium, loading, price, purchase, restore}}>
      {children}
    </EntitlementContext.Provider>
  );
};

export const useEntitlement = () => useContext(EntitlementContext);
