import Button from '../components/Button';
import Card from '../components/Card';
import NoticeBox from '../components/NoticeBox';
import { mockProducts } from '../data/mockProducts';
import type { CartItem, Product } from '../types';
import { getDiscountRate, isProductDiscounted } from '../types';
import { formatWon } from '../utils/money';

interface ProductListPageProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onGoCart: () => void;
  onGoHome: () => void;
}

export default function ProductListPage({
  cart,
  onAddToCart,
  onGoCart,
  onGoHome,
}: ProductListPageProps) {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="page">
      <header className="top-header">
        <div>
          <p className="eyebrow">상품 둘러보기</p>
          <h1>사고 싶은 걸 담아보세요</h1>
        </div>

        <button className="text-button" onClick={onGoHome} type="button">
          홈
        </button>
      </header>

      <NoticeBox />

      <div className="product-list">
        {mockProducts.map((product) => {
          const discountRate = getDiscountRate(product);
          const hasDiscount = isProductDiscounted(product);

          return (
            <Card key={product.id}>
              <div className="product-row">
                <div className="product-image" aria-hidden="true">
                  {product.imageEmoji}
                </div>

                <div className="product-info">
                  <div className="product-meta-row">
                    <p className="chip inline-chip">{product.category}</p>
                    {hasDiscount && (
                      <p className="discount-chip">{discountRate}%</p>
                    )}
                  </div>

                  <p className="product-brand">{product.brand}</p>
                  <h2>{product.name}</h2>

                  <div className="price-row">
                    <strong>{formatWon(product.price)}</strong>
                    {hasDiscount && (
                      <span>{formatWon(product.originalPrice)}</span>
                    )}
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

              <div className="saving-message">
                {product.savingMessage}
              </div>

              <Button onClick={() => onAddToCart(product)} variant="secondary">
                장바구니 담기
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="bottom-sticky">
        <Button onClick={onGoCart} disabled={cartCount === 0}>
          장바구니 보기 {cartCount > 0 ? `(${cartCount})` : ''}
        </Button>
      </div>
    </main>
  );
}