import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'bot'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const d = await resp.json();
      const reply = d?.reply || 'No response from AI';
      setMessages((m) => [...m, { from: 'bot', text: reply }]);
    } catch (err) {
      toast.error('Chat failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50">
        <Button onClick={() => setOpen(true)} className="rounded-full w-14 h-14 p-0 shadow-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[360px] max-w-full fixed right-6 bottom-24 rounded-2xl p-0 overflow-hidden shadow-2xl">
          <Card className="p-4 rounded-none">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Rosy Chatbot</h3>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
            </div>

            <div className="h-56 overflow-y-auto mb-3 space-y-2 border-t pt-3">
              {messages.length === 0 && (
                <p className="text-gray-500">Ask me about sorting waste or uploading proofs. Example: "How to separate plastic bottles?"</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`p-2 rounded-lg ${m.from === 'user' ? 'bg-indigo-50 text-right' : 'bg-gray-100'}`}>
                  <div className="text-sm">{m.text}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-lg p-2"
                placeholder="Type your question..."
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              />
              <Button onClick={sendMessage} disabled={loading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
