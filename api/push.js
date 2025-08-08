export default function handler(req, res) {
    // In a real app, this would send a push message via a push service
    console.log('Push request received:', req.body);
    res.status(200).json({ success: true });
  }