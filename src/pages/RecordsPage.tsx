import Button from '../components/Button';
import Card from '../components/Card';
import type { SavingRecord } from '../types';
import { formatWon, getKoreanDateTime } from '../utils/money';

interface RecordsPageProps {
  records: SavingRecord[];
  onGoHome: () => void;
}

export default function RecordsPage({ records, onGoHome }: RecordsPageProps) {
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);

  return (
    <main className="page">
      <header className="top-header">
        <div>
          <p className="eyebrow">저축 기록</p>
          <h1>지금까지 {formatWon(totalAmount)} 아꼈어요</h1>
        </div>

        <button className="text-button" onClick={onGoHome} type="button">
          홈
        </button>
      </header>

      {records.length === 0 ? (
        <Card>
          <h2>아직 기록이 없습니다</h2>
          <p className="muted">장바구니 금액을 저축 목표에 기록해보세요.</p>
        </Card>
      ) : (
        <div className="record-list">
          {records.map((record) => (
            <Card key={record.id}>
              <p className="label">{getKoreanDateTime(record.createdAt)}</p>
              <h2>{record.itemSummary}</h2>

              <strong className="record-amount">{formatWon(record.amount)}</strong>

              <p className="muted">연결 목표: {record.goalTitle}</p>
              <p className="muted">항목: {record.itemNames.join(', ')}</p>
            </Card>
          ))}
        </div>
      )}

      <Button onClick={onGoHome} variant="secondary">
        홈으로
      </Button>
    </main>
  );
}