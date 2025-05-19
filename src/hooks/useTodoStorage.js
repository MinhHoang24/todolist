import { useEffect, useState } from "react";

export default function useTodoStorage(key, defaultValue = []) {
  const [state, setState] = useState(defaultValue);
  const [isReady, setIsReady] = useState(false);

  // Lần đầu mount: đọc localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setState(parsed);
        }
      }
    } catch (err) {
      console.error("❌ Lỗi khi đọc localStorage:", err);
    }
    setIsReady(true);
  }, [key]);

  // Mỗi khi `state` thay đổi và đã mount xong → ghi vào localStorage
  useEffect(() => {
    if (isReady) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (err) {
        console.error("❌ Lỗi khi ghi localStorage:", err);
      }
    }
  }, [key, state, isReady]);

  return [state, setState];
}