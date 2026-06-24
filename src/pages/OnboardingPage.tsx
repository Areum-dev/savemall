import Button from '../components/Button';
import Card from '../components/Card';
import NoticeBox from '../components/NoticeBox';

interface OnboardingPageProps {
  onStart: () => void;
}

export default function OnboardingPage({ onStart }: OnboardingPageProps) {
  return (
    <main className="page onboarding-page">
      <div className="onboarding-visual">
        <div className="pig-icon-large">🐷</div>
      </div>

      <div className="hero">
        <div className="brand-badge">세이브몰</div>
        <h1>
          진짜처럼 담고,
          <br />
          진짜로 저축한다.
        </h1>
        <p>
          사고 싶은 상품을 장바구니에 담고, 결제 대신 그 금액을 저축 목표에
          기록하는 쇼핑형 저축 서비스입니다.
        </p>
      </div>

      <Card>
        <h2>구매가 아닌 저축 전환입니다.</h2>
        <p className="muted">
          세이브몰은 실제 상품을 판매하지 않습니다. 상품 배송은 발생하지 않으며,
          장바구니 금액은 저축 기록으로만 반영됩니다.
        </p>
      </Card>

      <NoticeBox />

      <Button onClick={onStart}>세이브몰 시작하기</Button>

      <p className="bottom-helper-text">
        초기 MVP에서는 실제 결제, 배송, 계좌이체가 발생하지 않습니다.
      </p>
    </main>
  );
}