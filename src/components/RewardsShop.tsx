import { Card } from './ui/card';
import { Gift, Sparkles } from 'lucide-react';
import type { User } from '../App';
import rosyLogo from 'figma:asset/Rosy.png';

interface RewardsShopProps {
  user: User;
  updateUser: (updates: Partial<User>) => void;
}

export default function RewardsShop({ user }: RewardsShopProps) {
  return (
    <div className="min-h-screen p-4 pt-6 pb-24">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-3">
          <img src={rosyLogo} alt="Rosy" className="w-full h-full object-contain drop-shadow-lg" />
        </div>
        <h1 className="text-emerald-600 mb-2 flex items-center justify-center gap-2">
          <Gift className="w-5 h-5" />
          Rewards
        </h1>
        <p className="text-gray-600">Exchange points for rewards — coming soon!</p>
      </div>

      <Card className="max-w-md mx-auto p-6 mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-3xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 mb-1"> Your Points</p>
            <p className="text-white">{user.points} points</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
      </Card>

      <div className="max-w-2xl mx-auto text-center">
        <div className="p-8 rounded-3xl border-2 border-dashed border-gray-200">
          <h2 className="text-2xl font-bold mb-3">COMING SOON</h2>
          <p className="text-gray-700">Exciting rewards are coming soon! Collect as many coins as you can — rewards will be activated shortly.</p>
        </div>
      </div>
    </div>
  );
}