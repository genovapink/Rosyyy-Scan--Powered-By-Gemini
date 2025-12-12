import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User as UserIcon, Mail, Star, Award, LogOut, Sparkles } from 'lucide-react';
import type { User } from '../App';
import rosyLogo from 'figma:asset/Rosy.png';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export default function Profile({ user, onLogout }: ProfileProps) {
  return (
    <div className="min-h-screen p-4 pt-6 pb-24">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-3">
          <img src={rosyLogo} alt="Rosy" className="w-full h-full object-contain drop-shadow-lg" />
        </div>
        <h1 className="text-emerald-600 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          My Profile
        </h1>
        <p className="text-gray-600">View your progress and collection</p>
      </div>

      <Card className="max-w-md mx-auto p-6 mb-6 rounded-3xl shadow-xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <UserIcon className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900 mb-1">{user.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Mail className="w-4 h-4" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            {user.badges.includes('badge-warrior') && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                <Award className="w-3 h-3 mr-1" />
                Eco-Warrior
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-gray-900 mb-1">{user.points}</p>
            <p className="text-gray-600">Points</p>
          </div>
          <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-gray-900 mb-1">{user.badges.length}</p>
            <p className="text-gray-600">Badges</p>
          </div>
          <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-gray-900 mb-1">{user.deposits}</p>
            <p className="text-gray-600">Deposits</p>
          </div>
        </div>
      </Card>

      <Card className="max-w-md mx-auto p-6 mb-6 rounded-3xl shadow-xl">
        <h2 className="text-gray-900 mb-4">Achievement Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Rosy Sticker</span>
              <span className="text-emerald-600">{user.points}/150</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((user.points / 150) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Eco-Warrior Badge</span>
              <span className="text-yellow-600">{user.points}/320</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((user.points / 320) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="max-w-md mx-auto">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User as UserIcon, Mail, Star, Award, LogOut, Sparkles } from 'lucide-react';
import type { User } from '../App';
import rosyLogo from 'figma:asset/Rosy.png';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export default function Profile({ user, onLogout }: ProfileProps) {
  return (
    <div className="min-h-screen p-4 pt-6 pb-24">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-3">
          <img src={rosyLogo} alt="Rosy" className="w-full h-full object-contain drop-shadow-lg" />
        </div>
        <h1 className="text-emerald-600 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          My Profile
        </h1>
        <p className="text-gray-600">View your progress and collection</p>
      </div>

      <Card className="max-w-md mx-auto p-6 mb-6 rounded-3xl shadow-xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <UserIcon className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900 mb-1">{user.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Mail className="w-4 h-4" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            {user.badges.includes('badge-warrior') && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                <Award className="w-3 h-3 mr-1" />
                Eco-Warrior
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-gray-900 mb-1">{user.points}</p>
            <p className="text-gray-600">Points</p>
          </div>
          <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-gray-900 mb-1">{user.badges.length}</p>
            <p className="text-gray-600">Badges</p>
          </div>
          <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-gray-900 mb-1">{user.deposits}</p>
            <p className="text-gray-600">Deposits</p>
          </div>
        </div>
      </Card>

      <Card className="max-w-md mx-auto p-6 mb-6 rounded-3xl shadow-xl">
        <h2 className="text-gray-900 mb-4">Achievement Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Rosy Sticker</span>
              <span className="text-emerald-600">{user.points}/150</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((user.points / 150) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Eco-Warrior Badge</span>
              <span className="text-yellow-600">{user.points}/320</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((user.points / 320) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="max-w-md mx-auto">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User as UserIcon, Mail, Star, Award, LogOut, Sparkles } from 'lucide-react';
import type { User } from '../App';
import rosyLogo from 'figma:asset/Rosy.png';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export default function Profile({ user, onLogout }: ProfileProps) {
  return (
    <div className="min-h-screen p-4 pt-6 pb-24">
      {/* Header with Logo */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-3">
          <img src={rosyLogo} alt="Rosy" className="w-full h-full object-contain drop-shadow-lg" />
        </div>
        <h1 className="text-emerald-600 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          My Profile
        </h1>
        <p className="text-gray-600">View your progress and collection</p>
      </div>

      {/* Profile Card */}
      <Card className="max-w-md mx-auto p-6 mb-6 rounded-3xl shadow-xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <UserIcon className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900 mb-1">{user.name} </h2>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Mail className="w-4 h-4" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            {user.badges.includes('badge-warrior') && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                <Award className="w-3 h-3 mr-1" />
                Eco-Warrior
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-gray-900 mb-1">{user.points}</p>
            <p className="text-gray-600">Poin</p>
            <p className="text-gray-600">Points</p>
          <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl">
          <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-gray-900 mb-1">{user.badges.length}</p>
            <p className="text-gray-600">Badges</p>
          </div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-6 h-6 text-emerald-500" />
            </div>
            import { Card } from './ui/card';
            import { Button } from './ui/button';
            import { Badge } from './ui/badge';
            import { User as UserIcon, Mail, Star, Award, LogOut, Sparkles } from 'lucide-react';
            import type { User } from '../App';
            import rosyLogo from 'figma:asset/Rosy.png';

            interface ProfileProps {
              user: User;
              onLogout: () => void;
            }

            export default function Profile({ user, onLogout }: ProfileProps) {
              return (
                <div className="min-h-screen p-4 pt-6 pb-24">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-3">
                      <img src={rosyLogo} alt="Rosy" className="w-full h-full object-contain drop-shadow-lg" />
                    </div>
                    <h1 className="text-emerald-600 mb-2 flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      My Profile
                    </h1>
                    <p className="text-gray-600">View your progress and collection</p>
                  </div>

                  <Card className="max-w-md mx-auto p-6 mb-6 rounded-3xl shadow-xl">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <UserIcon className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-gray-900 mb-1">{user.name}</h2>
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <Mail className="w-4 h-4" />
                          <span className="text-gray-600">{user.email}</span>
                        </div>
                        {user.badges.includes('badge-warrior') && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                            <Award className="w-3 h-3 mr-1" />
                            Eco-Warrior
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-2xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-6 h-6 text-yellow-500" />
                        </div>
                        <p className="text-gray-900 mb-1">{user.points}</p>
                        <p className="text-gray-600">Points</p>
                      </div>
                      <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Sparkles className="w-6 h-6 text-purple-500" />
                        </div>
                        <p className="text-gray-900 mb-1">{user.badges.length}</p>
                        <p className="text-gray-600">Badges</p>
                      </div>
                      <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Award className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-gray-900 mb-1">{user.deposits}</p>
                        <p className="text-gray-600">Deposits</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="max-w-md mx-auto p-6 mb-6 rounded-3xl shadow-xl">
                    <h2 className="text-gray-900 mb-4">Achievement Progress</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Rosy Sticker</span>
                          <span className="text-emerald-600">{user.points}/150</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                            style={{ width: `${Math.min((user.points / 150) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Eco-Warrior Badge</span>
                          <span className="text-yellow-600">{user.points}/320</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
                            style={{ width: `${Math.min((user.points / 320) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="max-w-md mx-auto">
                    <Button
                      onClick={onLogout}
                      variant="outline"
                      className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              );
            }