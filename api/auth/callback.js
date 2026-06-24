export default function handler(req, res) {
  const authHeader = req.headers['authorization'];
  const expected = 'Basic c2F2ZW1hbGw6c2F2ZW1hbGwyMDI2IQ==';

  if (authHeader !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 회원탈퇴(연결 끊기) 이벤트 수신
  // 향후 DB 연동 시 이 부분에서 사용자 데이터 삭제 처리
  return res.status(200).json({ success: true });
}
