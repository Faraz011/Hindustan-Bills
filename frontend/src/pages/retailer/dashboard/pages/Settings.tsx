import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Save, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../../lib/api';

export default function Settings() {
  const [telegramChatId, setTelegramChatId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/api/shop/settings');
      const data = response as any;
      setTelegramChatId(data?.metadata?.telegramChatId || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/shop/settings', {
        telegramChatId: telegramChatId.trim()
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#561485]/20 border-t-[#561485] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Settings
        </h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Configure notifications and preferences
        </p>
      </section>

      {/* Telegram Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-gray-50 p-8 shadow-xl shadow-[#561485]/5"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-none">
              Telegram Notifications
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Get instant order alerts on Telegram
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Info Alert */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-900">How to get your Chat ID:</p>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Search for <code className="bg-white px-2 py-0.5 rounded font-mono">@BotFather</code> on Telegram</li>
                  <li>Create a bot or use existing one</li>
                  <li>Start your bot and send any message</li>
                  <li>Visit: <code className="bg-white px-2 py-0.5 rounded font-mono text-[10px]">https://api.telegram.org/bot[TOKEN]/getUpdates</code></li>
                  <li>Find your Chat ID in the response</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              Telegram Chat ID
            </label>
            <input
              type="text"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="e.g. 123456789"
              className="w-full bg-gray-50 border-2 border-transparent focus:border-[#561485]/20 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold tracking-tight placeholder:text-gray-300 transition-all outline-none"
            />
            <p className="text-[10px] text-gray-400 px-1">
              Enter your Telegram Chat ID to receive order notifications
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#561485] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Success State */}
      {telegramChatId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-500" />
            <p className="text-sm font-bold text-emerald-900">
              Telegram notifications are configured! You'll receive alerts when customers complete payment.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
