import type { CartItem, SavingGoal, SavingRecord } from '../types';

const CART_KEY = 'saveMall.cart';
const GOALS_KEY = 'saveMall.goals';
const RECORDS_KEY = 'saveMall.records';
const ONBOARDING_KEY = 'saveMall.onboardingCompleted';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storageRepository = {
  // TODO: 앱인토스 로그인 연동 후 사용자 ID별 저장소로 분리 가능
  // TODO: Supabase/API 연동 시 이 파일만 서버 repository로 교체

  isOnboardingCompleted(): boolean {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  },

  completeOnboarding(): void {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  },

  getCart(): CartItem[] {
    return readJson<CartItem[]>(CART_KEY, []);
  },

  saveCart(cart: CartItem[]): void {
    writeJson(CART_KEY, cart);
  },

  clearCart(): void {
    writeJson<CartItem[]>(CART_KEY, []);
  },

  getGoals(): SavingGoal[] {
    const goals = readJson<SavingGoal[]>(GOALS_KEY, []);

    if (goals.length > 0) {
      return goals;
    }

    const now = new Date().toISOString();

    const defaultGoals: SavingGoal[] = [
      {
        id: 'goal-emergency-fund',
        title: '비상금 만들기',
        targetAmount: 1000000,
        currentAmount: 0,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ];

    writeJson(GOALS_KEY, defaultGoals);
    return defaultGoals;
  },

  saveGoals(goals: SavingGoal[]): void {
    writeJson(GOALS_KEY, goals);
  },

  getRecords(): SavingRecord[] {
    return readJson<SavingRecord[]>(RECORDS_KEY, []);
  },

  saveRecords(records: SavingRecord[]): void {
    writeJson(RECORDS_KEY, records);
  },

  addSavingRecord(record: SavingRecord): void {
    const records = this.getRecords();
    writeJson(RECORDS_KEY, [record, ...records]);
  },
};