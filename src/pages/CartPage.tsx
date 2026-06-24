import Button from '../components/Button';
import Card from '../components/Card';
import NoticeBox from '../components/NoticeBox';
import type { CartItem } from '../types';
import { formatWon } from '../utils/money';

interface CartPageProps {
  cart: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onGoProducts: () => void;
  onGoGoalSelect: () => void;
  onGoHome: () => void;
}

export default function CartPage({
  cart,
  onRemoveItem,
  onGoProducts,
  onGoGoalSelect,
  onGoHome,
}: CartPageProps) {
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="page cart-page">
      <header className="top-header">
        <div>
          <p className="eyebrow">장바구니</p>
          <h1>
            담은 만큼,
            <br />
            저축으로 전환하기
          </h1>
        </div>

        <button className="text-button" onClick={onGoHome} type="button">
          홈
        </button>
      </header>

      {cart.length === 0 ? (
        <Card className="empty-cart-card">
          <div className="empty-icon">🛒</div>
          <h2>장바구니가 비어있어요</h2>
          <p className="muted">
            사고 싶은 상품을 담고, 구매 대신 저축 목표에 기록해보세요.
          </p>

          <Button onClick={onGoProducts}>상품 둘러보기</Button>
        </Card>
      ) : (
        <>
          <Card className="cart-total-card">
            <p className="label">저축 전환 예정 금액</p>
            <strong className="big-number">{formatWon(totalAmount)}</strong>
            <p className="muted">
              실제 결제되지 않습니다. 이 금액은 선택한 저축 목표에 기록됩니다.
            </p>
          </Card>

          <div className="cart-list">
            {cart.map((item) => (
              <Card key={item.id} className="cart-product-card">
                <div className="cart-row">
                  <div className="cart-item-left">
                    <div className="cart-item-emoji">{item.imageEmoji}</div>

                    <div>
                      <div className="cart-meta-row">
                        <p className="chip inline-chip">{item.category}</p>
                        <p className="cart-brand">{item.brand}</p>
                      </div>

                      <h2>{item.name}</h2>

                      <p className="muted">
                        {formatWon(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => onRemoveItem(item.id)}
                    type="button"
                  >
                    삭제
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <NoticeBox />

          <Card className="cart-warning-card">
            <h2>구매하기 버튼은 없습니다.</h2>
            <p>
              세이브몰은 상품을 판매하지 않습니다. 장바구니는 소비 욕구를
              저축으로 바꾸기 위한 기록 도구입니다.
            </p>
          </Card>

          <div className="bottom-cta-area">
            <Button onClick={onGoGoalSelect}>저축으로 전환하기</Button>
            <Button onClick={onGoProducts} variant="secondary">
              더 담기
            </Button>
          </div>
        </>
      )}
    </main>
  );
}