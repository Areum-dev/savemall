import { useEffect, useMemo, useState } from 'react';

type Page =
  | 'onboarding'
  | 'home'
  | 'products'
  | 'cart'
  | 'goalSelect'
  | 'complete'
  | 'goals'
  | 'records'
  | 'serviceGuide'
  | 'usageNotice'
  | 'privacyGuide'
  | 'financeGuide';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  imageEmoji: string;
  tags: string[];
  savingMessage: string;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  imageEmoji: string;
  quantity: number;
}

interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

interface SavingRecord {
  id: string;
  goalId: string;
  goalTitle: string;
  amount: number;
  itemSummary: string;
  itemNames: string[];
  createdAt: string;
}

const products: Product[] = [
  {
    id: 'p001',
    name: '베이직 오버핏 셔츠',
    category: '패션',
    brand: 'MELLOW FIT',
    description: '출근, 데이트, 데일리룩에 모두 어울리는 오버핏 셔츠입니다.',
    price: 39000,
    originalPrice: 59000,
    rating: 4.7,
    reviewCount: 128,
    imageEmoji: '👔',
    tags: ['인기', '오늘의 추천'],
    savingMessage: '이 셔츠 대신 39,000원을 저축하면 이번 달 목표에 더 가까워집니다.',
  },
  {
    id: 'p002',
    name: '무선 노이즈 캔슬링 이어폰',
    category: '디지털',
    brand: 'SOUND NEST',
    description: '출퇴근, 공부, 작업 시간에 집중하기 좋은 무선 이어폰입니다.',
    price: 89000,
    originalPrice: 129000,
    rating: 4.8,
    reviewCount: 342,
    imageEmoji: '🎧',
    tags: ['베스트', '리뷰많음'],
    savingMessage: '이어폰 구매 욕구를 저축으로 바꾸면 더 큰 목표를 만들 수 있습니다.',
  },
  {
    id: 'p003',
    name: '컴팩트 에어프라이어',
    category: '가전',
    brand: 'HOME BREEZE',
    description: '1~2인 가구에 알맞은 미니 에어프라이어입니다.',
    price: 69000,
    originalPrice: 99000,
    rating: 4.6,
    reviewCount: 215,
    imageEmoji: '🍟',
    tags: ['주방가전', '1인가구'],
    savingMessage: '주방가전 구매를 잠시 미루고 저축으로 전환해보세요.',
  },
  {
    id: 'p004',
    name: '수분 진정 크림',
    category: '뷰티',
    brand: 'CALM LEAF',
    description: '건조한 피부를 위한 데일리 수분 크림입니다.',
    price: 24000,
    originalPrice: 32000,
    rating: 4.5,
    reviewCount: 89,
    imageEmoji: '🧴',
    tags: ['뷰티', '데일리'],
    savingMessage: '작은 소비도 모이면 큰 저축 습관이 됩니다.',
  },
  {
    id: 'p005',
    name: '주말 감성 숙소 바우처',
    category: '여행',
    brand: 'REST DAY',
    description: '떠나고 싶은 마음을 담은 여행형 상품입니다.',
    price: 120000,
    originalPrice: 160000,
    rating: 4.7,
    reviewCount: 31,
    imageEmoji: '🏝️',
    tags: ['여행', '목표저축'],
    savingMessage: '여행 욕구를 저축으로 전환하면 진짜 여행 자금에 가까워질 수 있습니다.',
  },
  {
    id: 'p006',
    name: '배달음식 참기',
    category: '음식',
    brand: 'SAVE MEAL',
    description: '오늘 한 번 참은 배달비를 저축으로 바꿔보세요.',
    price: 28000,
    originalPrice: 28000,
    rating: 4.9,
    reviewCount: 210,
    imageEmoji: '🍕',
    tags: ['소비참기', '가성비'],
    savingMessage: '한 번 참은 배달비도 모이면 꽤 큰 돈이 됩니다.',
  },
];

const CART_KEY = 'saveMall.cart.v2';
const GOALS_KEY = 'saveMall.goals.v2';
const RECORDS_KEY = 'saveMall.records.v2';
const ONBOARDING_KEY = 'saveMall.onboarding.v2';

function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function getInitialGoals(): SavingGoal[] {
  const saved = readJson<SavingGoal[]>(GOALS_KEY, []);

  if (saved.length > 0) {
    return saved;
  }

  const defaultGoals: SavingGoal[] = [
    {
      id: 'goal-emergency',
      title: '비상금 만들기',
      targetAmount: 1000000,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    },
  ];

  saveJson(GOALS_KEY, defaultGoals);
  return defaultGoals;
}

function getDiscountRate(product: Product): number {
  if (product.originalPrice <= product.price) {
    return 0;
  }

  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

export default function App() {
  const [page, setPage] = useState<Page>(() =>
    localStorage.getItem(ONBOARDING_KEY) === 'true' ? 'home' : 'onboarding'
  );

  const [cart, setCart] = useState<CartItem[]>(() => readJson<CartItem[]>(CART_KEY, []));
  const [goals, setGoals] = useState<SavingGoal[]>(() => getInitialGoals());
  const [records, setRecords] = useState<SavingRecord[]>(() =>
    readJson<SavingRecord[]>(RECORDS_KEY, [])
  );
  const [latestRecordId, setLatestRecordId] = useState<string | null>(null);

  useEffect(() => {
    saveJson(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    saveJson(GOALS_KEY, goals);
  }, [goals]);

  useEffect(() => {
    saveJson(RECORDS_KEY, records);
  }, [records]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const todayKey = new Date().toISOString().slice(0, 10);

  const todayAmount = records
    .filter((record) => record.createdAt.slice(0, 10) === todayKey)
    .reduce((sum, record) => sum + record.amount, 0);

  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
  const mainGoal = goals[0];

  const latestRecord = records.find((record) => record.id === latestRecordId) ?? null;

  const connectedGoal = latestRecord
    ? goals.find((goal) => goal.id === latestRecord.goalId) ?? null
    : null;

  function start() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setPage('home');
  }

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);

      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
        {
          id: makeId('cart'),
          productId: product.id,
          name: product.name,
          category: product.category,
          brand: product.brand,
          price: product.price,
          imageEmoji: product.imageEmoji,
          quantity: 1,
        },
      ];
    });
  }

  function removeCartItem(cartItemId: string) {
    setCart((current) => current.filter((item) => item.id !== cartItemId));
  }

  function createGoal(title: string, targetAmount: number) {
    const newGoal: SavingGoal = {
      id: makeId('goal'),
      title,
      targetAmount,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    };

    setGoals((current) => [newGoal, ...current]);
  }

  function selectGoal(goalId: string) {
    if (cart.length === 0 || cartTotal <= 0) {
      setPage('cart');
      return;
    }

    const goal = goals.find((item) => item.id === goalId);

    if (!goal) {
      return;
    }

    const itemNames = cart.map((item) =>
      item.quantity > 1 ? `${item.name} ${item.quantity}개` : item.name
    );

    const record: SavingRecord = {
      id: makeId('record'),
      goalId: goal.id,
      goalTitle: goal.title,
      amount: cartTotal,
      itemSummary:
        itemNames.length === 1 ? itemNames[0] : `${itemNames[0]} 외 ${itemNames.length - 1}개`,
      itemNames,
      createdAt: new Date().toISOString(),
    };

    setGoals((current) =>
      current.map((item) =>
        item.id === goal.id ? { ...item, currentAmount: item.currentAmount + cartTotal } : item
      )
    );

    setRecords((current) => [record, ...current]);
    setLatestRecordId(record.id);
    setCart([]);
    setPage('complete');
  }

  if (page === 'onboarding') {
    return (
      <main className="page onboarding-page">
        <div className="pig-icon-large">🐷</div>

        <div className="hero">
          <div className="brand-badge">세이브몰</div>
          <h1>
            진짜처럼 담고,
            <br />
            진짜로 저축한다.
          </h1>
          <p>
            사고 싶은 상품을 장바구니에 담고, 결제 대신 그 금액을 저축 목표에 기록하는
            쇼핑형 저축 서비스입니다.
          </p>
        </div>

        <section className="card">
          <h2>구매가 아닌 저축 전환입니다.</h2>
          <p className="muted">
            세이브몰은 실제 상품을 판매하지 않습니다. 상품 배송은 발생하지 않으며,
            장바구니 금액은 저축 기록으로만 반영됩니다.
          </p>
        </section>

        <Notice />

        <button className="button button-primary" onClick={start} type="button">
          세이브몰 시작하기
        </button>
      </main>
    );
  }

  if (page === 'home') {
    return (
      <main className="page home-page">
        <section className="home-blue-header">
          <div className="home-top-row">
            <div className="home-logo">🐷</div>
            <div>
              <p className="home-brand">세이브몰</p>
              <p className="home-sub">구매 충동을 저축 습관으로</p>
            </div>
          </div>

          <h1>
            담으면 소비,
            <br />
            전환하면 저축
          </h1>

          <p>사고 싶은 상품을 담고 실제 구매 대신 저축 목표에 기록해보세요.</p>
        </section>

        <section className="card summary-card">
          <p className="label">오늘 아낀 금액</p>
          <strong className="big-number">{formatWon(todayAmount)}</strong>
          <p className="muted">누적 저축 전환 금액 {formatWon(totalAmount)}</p>
        </section>

        {mainGoal && (
          <section className="card">
            <div className="row-between">
              <div>
                <p className="label">진행 중인 목표</p>
                <h2>{mainGoal.title}</h2>
              </div>
              <span className="chip">{formatWon(mainGoal.targetAmount)}</span>
            </div>

            <Progress current={mainGoal.currentAmount} target={mainGoal.targetAmount} />

            <p className="muted">현재 {formatWon(mainGoal.currentAmount)} 모았어요.</p>
          </section>
        )}

        <div className="action-stack">
          <button className="button button-primary" onClick={() => setPage('products')} type="button">
            상품 둘러보기
          </button>

          <button className="button button-secondary" onClick={() => setPage('goals')} type="button">
            내 저축 목표
          </button>

          <button className="button button-secondary" onClick={() => setPage('records')} type="button">
            저축 기록 보기
          </button>
        </div>

        <section
          className="card"
          style={{
            borderColor: '#dbeafe',
            background: '#ffffff',
          }}
        >
          <p className="label">서비스 안내</p>
          <h2 style={{ marginTop: 6 }}>세이브몰 이용 전 확인해주세요</h2>
          <p className="muted">
            세이브몰은 현재 MVP 단계입니다. 실제 결제, 배송, 계좌이체는 제공하지 않습니다.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 18,
            }}
          >
            <GuideButton label="서비스 안내" onClick={() => setPage('serviceGuide')} />
            <GuideButton label="이용 유의사항" onClick={() => setPage('usageNotice')} />
            <GuideButton label="개인정보 안내" onClick={() => setPage('privacyGuide')} />
            <GuideButton label="금융 연동 준비 안내" onClick={() => setPage('financeGuide')} />
          </div>
        </section>

        <section className="card notice-card-blue">
          <h2>구매가 아닌 저축 전환입니다.</h2>
          <p>
            실제 결제와 상품 배송이 발생하지 않습니다. 장바구니는 소비 욕구를 저축으로
            바꾸기 위한 기록 도구입니다.
          </p>
        </section>
      </main>
    );
  }

  if (page === 'products') {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <main className="page">
        <Header
          eyebrow="상품 둘러보기"
          title="사고 싶은 걸 담아보세요"
          onHome={() => setPage('home')}
        />

        <Notice />

        <div className="product-list">
          {products.map((product) => {
            const discountRate = getDiscountRate(product);

            return (
              <section className="card" key={product.id}>
                <div className="product-row">
                  <div className="product-image">{product.imageEmoji}</div>

                  <div className="product-info">
                    <div className="product-meta-row">
                      <span className="chip">{product.category}</span>
                      {discountRate > 0 && <span className="discount-chip">{discountRate}%</span>}
                    </div>

                    <p className="product-brand">{product.brand}</p>
                    <h2>{product.name}</h2>

                    <div className="price-row">
                      <strong>{formatWon(product.price)}</strong>
                      {discountRate > 0 && <span>{formatWon(product.originalPrice)}</span>}
                    </div>

                    <p className="rating-text">
                      ★ {product.rating.toFixed(1)} · 리뷰 {product.reviewCount}개
                    </p>
                    <p className="muted">{product.description}</p>

                    <div className="tag-row">
                      {product.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="saving-message">{product.savingMessage}</div>

                <button className="button button-secondary" onClick={() => addToCart(product)} type="button">
                  장바구니 담기
                </button>
              </section>
            );
          })}
        </div>

        <div className="bottom-cta-area">
          <button
            className="button button-primary"
            disabled={cartCount === 0}
            onClick={() => setPage('cart')}
            type="button"
          >
            장바구니 보기 {cartCount > 0 ? `(${cartCount})` : ''}
          </button>
        </div>
      </main>
    );
  }

  if (page === 'cart') {
    return (
      <main className="page">
        <Header
          eyebrow="장바구니"
          title="담은 만큼, 저축으로 전환하기"
          onHome={() => setPage('home')}
        />

        {cart.length === 0 ? (
          <section className="card empty-card">
            <div className="empty-icon">🛒</div>
            <h2>장바구니가 비어있어요</h2>
            <p className="muted">사고 싶은 상품을 담고, 구매 대신 저축 목표에 기록해보세요.</p>
            <button className="button button-primary" onClick={() => setPage('products')} type="button">
              상품 둘러보기
            </button>
          </section>
        ) : (
          <>
            <section className="card summary-card">
              <p className="label">저축 전환 예정 금액</p>
              <strong className="big-number">{formatWon(cartTotal)}</strong>
              <p className="muted">
                실제 결제되지 않습니다. 이 금액은 선택한 저축 목표에 기록됩니다.
              </p>
            </section>

            {cart.map((item) => (
              <section className="card" key={item.id}>
                <div className="cart-row">
                  <div className="cart-item-left">
                    <div className="cart-item-emoji">{item.imageEmoji}</div>
                    <div>
                      <p className="chip inline-chip">{item.category}</p>
                      <p className="product-brand">{item.brand}</p>
                      <h2>{item.name}</h2>
                      <p className="muted">
                        {formatWon(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <button className="remove-button" onClick={() => removeCartItem(item.id)} type="button">
                    삭제
                  </button>
                </div>
              </section>
            ))}

            <Notice />

            <section className="card notice-card-blue">
              <h2>구매하기 버튼은 없습니다.</h2>
              <p>
                세이브몰은 상품을 판매하지 않습니다. 장바구니는 소비 욕구를 저축으로
                바꾸기 위한 기록 도구입니다.
              </p>
            </section>

            <div className="bottom-cta-area">
              <button className="button button-primary" onClick={() => setPage('goalSelect')} type="button">
                저축으로 전환하기
              </button>
              <button className="button button-secondary" onClick={() => setPage('products')} type="button">
                더 담기
              </button>
            </div>
          </>
        )}
      </main>
    );
  }

  if (page === 'goalSelect') {
    return (
      <GoalSelect
        goals={goals}
        cartTotal={cartTotal}
        onBack={() => setPage('cart')}
        onCreateGoal={createGoal}
        onSelectGoal={selectGoal}
      />
    );
  }

  if (page === 'complete') {
    return (
      <main className="page complete-page">
        <section className="complete-hero">
          <div className="pig-icon-large">🐷</div>
          <h1>저축 전환이 완료되었습니다.</h1>
          <p>
            선택한 금액이 저축 목표에 반영되었습니다.
            <br />
            상품 배송은 발생하지 않습니다.
          </p>
        </section>

        {latestRecord && (
          <section className="card">
            <div className="amount-line">
              <span>이번 전환 금액</span>
              <strong>{formatWon(latestRecord.amount)}</strong>
            </div>

            {connectedGoal && (
              <>
                <div className="divider" />
                <div className="amount-line">
                  <span>연결된 목표</span>
                  <strong>{connectedGoal.title}</strong>
                </div>

                <div className="divider" />
                <div className="amount-line">
                  <span>목표 누적 금액</span>
                  <strong>{formatWon(connectedGoal.currentAmount)}</strong>
                </div>

                <Progress current={connectedGoal.currentAmount} target={connectedGoal.targetAmount} />
              </>
            )}
          </section>
        )}

        <section className="card placeholder-card">
          <p className="label">광고 영역</p>
          <h2>TODO: 인앱 광고 placeholder</h2>
          <p className="muted">앱인토스 인앱 광고 연동 시 이 영역을 광고 배너로 교체합니다.</p>
        </section>

        <div className="action-stack">
          <button className="button button-primary" onClick={() => setPage('records')} type="button">
            저축 기록 보기
          </button>
          <button className="button button-secondary" onClick={() => setPage('products')} type="button">
            계속 둘러보기
          </button>
          <button className="button button-secondary" onClick={() => setPage('home')} type="button">
            홈으로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  if (page === 'goals') {
    const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

    return (
      <main className="page">
        <Header
          eyebrow="내 저축 목표"
          title="사고 싶은 마음이 목표가 됩니다"
          onHome={() => setPage('home')}
        />

        <section className="card summary-card">
          <p className="label">전체 목표 진행</p>
          <strong className="big-number">{formatWon(totalCurrentAmount)}</strong>
          <p className="muted">전체 목표 금액 {formatWon(totalGoalAmount)}</p>
        </section>

        {goals.map((goal) => {
          const percent =
            goal.targetAmount <= 0
              ? 0
              : Math.min(Math.floor((goal.currentAmount / goal.targetAmount) * 100), 100);

          return (
            <section className="card" key={goal.id}>
              <div className="row-between">
                <div>
                  <p className="label">{percent >= 100 ? '목표 달성' : '진행 중'}</p>
                  <h2>{goal.title}</h2>
                </div>
                <span className="chip">{percent}%</span>
              </div>

              <Progress current={goal.currentAmount} target={goal.targetAmount} />

              <p className="muted">
                {formatWon(goal.currentAmount)} / {formatWon(goal.targetAmount)}
              </p>
            </section>
          );
        })}

        <div className="action-stack">
          <button className="button button-primary" onClick={() => setPage('records')} type="button">
            저축 기록 보기
          </button>
          <button className="button button-secondary" onClick={() => setPage('home')} type="button">
            홈으로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  if (page === 'records') {
    return (
      <main className="page">
        <Header eyebrow="저축 기록" title="구매 대신 남긴 기록" onHome={() => setPage('home')} />

        <section className="card summary-card">
          <p className="label">누적 저축 전환 금액</p>
          <strong className="big-number">{formatWon(totalAmount)}</strong>
          <p className="muted">실제 결제 없이 저축 목표에 기록한 금액입니다.</p>
        </section>

        {records.length === 0 ? (
          <section className="card empty-card">
            <div className="empty-icon">🧾</div>
            <h2>아직 기록이 없습니다</h2>
            <p className="muted">사고 싶은 상품을 장바구니에 담고 저축으로 전환해보세요.</p>
          </section>
        ) : (
          records.map((record) => (
            <section className="card" key={record.id}>
              <p className="label">{new Date(record.createdAt).toLocaleString('ko-KR')}</p>
              <h2>{record.itemSummary}</h2>

              <div className="record-amount-box">
                <span>저축 전환 금액</span>
                <strong>{formatWon(record.amount)}</strong>
              </div>

              <p className="muted">연결 목표: {record.goalTitle}</p>
              <p className="muted">담았던 항목: {record.itemNames.join(', ')}</p>
            </section>
          ))
        )}

        <button className="button button-secondary" onClick={() => setPage('home')} type="button">
          홈으로 돌아가기
        </button>
      </main>
    );
  }

  if (page === 'serviceGuide') {
    return (
      <InfoPage
        eyebrow="서비스 안내"
        title="세이브몰은 쇼핑형 저축 기록 서비스입니다"
        description="세이브몰은 실제 상품을 구매하는 쇼핑몰이 아니라, 소비 욕구를 저축 행동으로 바꾸기 위한 MVP 서비스입니다."
        items={[
          '상품 이미지는 구매 대상이 아니라 저축 전환을 위한 예시 항목입니다.',
          '장바구니에 담긴 금액은 실제 결제되지 않습니다.',
          '상품 배송, 교환, 환불 절차는 발생하지 않습니다.',
          '현재는 실제 계좌이체 없이 로컬 저장소에 저축 기록만 저장합니다.',
        ]}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'usageNotice') {
    return (
      <InfoPage
        eyebrow="이용 유의사항"
        title="실제 구매와 금융거래가 발생하지 않습니다"
        description="세이브몰 MVP에서는 실제 결제, 상품 배송, 계좌이체, 출금, 입금 기능을 제공하지 않습니다."
        items={[
          '세이브몰에 표시된 상품은 실제 판매 상품이 아닙니다.',
          '장바구니 담기는 구매 신청이 아닙니다.',
          '저축 전환은 실제 계좌이체가 아닌 기록 기능입니다.',
          '앱 안의 금액은 사용자의 저축 목표 진행 상황을 보여주기 위한 시뮬레이션 데이터입니다.',
          '실제 금융기관 또는 오픈뱅킹 연동 전까지 금융거래는 발생하지 않습니다.',
        ]}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'privacyGuide') {
    return (
      <InfoPage
        eyebrow="개인정보 안내"
        title="현재 MVP는 민감한 금융정보를 수집하지 않습니다"
        description="현재 세이브몰 MVP는 회원가입, 계좌 연결, 실명 인증, 결제정보 입력 기능을 제공하지 않습니다."
        items={[
          '현재 버전은 이름, 주민등록번호, 계좌번호, 카드번호를 입력받지 않습니다.',
          '장바구니, 저축 목표, 저축 기록은 사용자의 브라우저 localStorage에 저장됩니다.',
          '브라우저 저장 데이터를 삭제하면 앱 안의 기록도 삭제될 수 있습니다.',
          '향후 로그인, 계좌 연결, 오픈뱅킹 기능이 추가될 경우 별도의 개인정보 처리방침과 동의 절차가 필요합니다.',
        ]}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'financeGuide') {
    return (
      <InfoPage
        eyebrow="금융 연동 준비 안내"
        title="실제 계좌 연동은 아직 제공하지 않습니다"
        description="현재 버전은 금융기관 또는 오픈뱅킹과 연결되지 않은 MVP입니다. 실제 입금, 출금, 이체 기능은 제공하지 않습니다."
        items={[
          '현재 저축 전환은 실제 계좌이체가 아닙니다.',
          '현재 앱은 금융결제원 오픈뱅킹 API를 호출하지 않습니다.',
          '현재 앱은 은행 계좌 잔액을 조회하지 않습니다.',
          '향후 금융기관 협의 또는 오픈뱅킹 연동 후 실제 금융 기능을 검토할 예정입니다.',
        ]}
        onBack={() => setPage('home')}
      />
    );
  }

  return null;
}

function Header({
  eyebrow,
  title,
  onHome,
}: {
  eyebrow: string;
  title: string;
  onHome: () => void;
}) {
  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>

      <button className="text-button" onClick={onHome} type="button">
        홈
      </button>
    </header>
  );
}

function Notice() {
  return (
    <section className="notice-box">
      <strong>안내</strong>
      <p>세이브몰은 실제 상품을 판매하지 않습니다.</p>
      <p>장바구니 금액은 결제되지 않으며, 저축 목표 기록으로만 반영됩니다.</p>
      <p>실제 계좌이체 기능은 아직 제공하지 않습니다.</p>
    </section>
  );
}

function Progress({ current, target }: { current: number; target: number }) {
  const percent = target <= 0 ? 0 : Math.min(Math.floor((current / target) * 100), 100);

  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="progress-text">{percent}% 달성</p>
    </div>
  );
}

function GuideButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        width: '100%',
        minHeight: 58,
        border: 0,
        borderRadius: 18,
        background: '#eff6ff',
        color: '#1d4ed8',
        fontSize: 16,
        fontWeight: 900,
        textAlign: 'left',
        padding: '0 18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 26, fontWeight: 900 }}>›</span>
    </button>
  );
}

function GoalSelect({
  goals,
  cartTotal,
  onBack,
  onCreateGoal,
  onSelectGoal,
}: {
  goals: SavingGoal[];
  cartTotal: number;
  onBack: () => void;
  onCreateGoal: (title: string, targetAmount: number) => void;
  onSelectGoal: (goalId: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const parsedTargetAmount = Number(targetAmount);
  const canCreate = title.trim().length > 0 && parsedTargetAmount > 0;

  function submit() {
    if (!canCreate) {
      return;
    }

    onCreateGoal(title.trim(), parsedTargetAmount);
    setTitle('');
    setTargetAmount('');
  }

  return (
    <main className="page">
      <header className="top-header">
        <div>
          <p className="eyebrow">저축 목표 선택</p>
          <h1>
            {formatWon(cartTotal)}을
            <br />
            어디에 모을까요?
          </h1>
        </div>

        <button className="text-button" onClick={onBack} type="button">
          뒤로
        </button>
      </header>

      <section className="card goal-amount-card">
        <div className="goal-amount-icon">🐷</div>
        <div>
          <p className="label">이번 저축 전환 금액</p>
          <strong>{formatWon(cartTotal)}</strong>
          <p className="muted">실제 계좌이체가 아닌 저축 목표 기록으로만 반영됩니다.</p>
        </div>
      </section>

      <section className="card">
        <h2>기존 목표에 기록하기</h2>

        {goals.map((goal) => (
          <button className="goal-select-item" key={goal.id} onClick={() => onSelectGoal(goal.id)} type="button">
            <div className="row-between">
              <div>
                <strong>{goal.title}</strong>
                <p className="muted">
                  {formatWon(goal.currentAmount)} / {formatWon(goal.targetAmount)}
                </p>
              </div>

              <span className="goal-select-arrow">선택</span>
            </div>

            <Progress current={goal.currentAmount} target={goal.targetAmount} />
          </button>
        ))}
      </section>

      <section className="card">
        <h2>새 목표 만들기</h2>
        <p className="muted">여행, 비상금, 전자기기처럼 사고 싶은 마음을 모을 목표를 만들어보세요.</p>

        <label className="input-label">
          목표명
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예: 여행 자금, 비상금, 새 노트북"
          />
        </label>

        <label className="input-label">
          목표금액
          <input
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
            inputMode="numeric"
            placeholder="예: 1000000"
          />
        </label>

        <button className="button button-primary" disabled={!canCreate} onClick={submit} type="button">
          목표 만들기
        </button>
      </section>
    </main>
  );
}

function InfoPage({
  eyebrow,
  title,
  description,
  items,
  onBack,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  onBack: () => void;
}) {
  return (
    <main className="page">
      <header className="top-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>

        <button className="text-button" onClick={onBack} type="button">
          홈
        </button>
      </header>

      <section className="card notice-card-blue">
        <h2>반드시 확인해주세요</h2>
        <p>{description}</p>
      </section>

      <section className="card">
        <h2>주요 안내</h2>

        <ul>
          {items.map((item) => (
            <li
              key={item}
              style={{
                color: '#374151',
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1.55,
                marginBottom: 8,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>현재 MVP 기준</h2>
        <p className="muted">
          현재 세이브몰은 사용자 반응 검증을 위한 MVP입니다. 실제 금융 기능을 제공하기 전에는
          별도의 약관, 개인정보 처리방침, 금융기관 협의, 필요한 인허가 또는 제휴 검토가 필요합니다.
        </p>
      </section>

      <button className="button button-primary" onClick={onBack} type="button">
        확인했습니다
      </button>
    </main>
  );
}