export default function handler(req, res) {
  console.log('TEST ENDPOINT HIT');
  return res.status(200).json({ test: 'working' });
}