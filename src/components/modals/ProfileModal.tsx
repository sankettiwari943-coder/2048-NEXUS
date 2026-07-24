import React, { useState } from 'react';
import { User, Shield, Globe, Award, Sparkles, Check, Edit2, Coins } from 'lucide-react';
import { useUserStore, getXPForNextLevel } from '../../stores/useUserStore';
import { ModalContainer } from '../ui/ModalContainer';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShop?: () => void;
  onOpenInsufficientGold?: (cost: number) => void;
}

const AVATAR_OPTIONS = ['🚀', '⚡', '🔮', '🛡️', '👑', '🔥', '🤖', '🧠', '👾', '💎', '🐉', '🦊'];

const COUNTRY_OPTIONS = [
  { code: 'US', name: 'United States' },
  { code: 'JP', name: 'Japan' },
  { code: 'DE', name: 'Germany' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenShop,
  onOpenInsufficientGold,
}) => {
  const { profile, updateProfile, canAffordGold, deductGold } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [bio, setBio] = useState(profile.bio || '');
  const [country, setCountry] = useState(profile.country);

  const neededXP = getXPForNextLevel(profile.level);

  const handleSave = () => {
    const newUsername = username.trim() || profile.username;
    const isNameChanged = newUsername !== profile.username;

    if (isNameChanged) {
      const NAME_CHANGE_COST = 500;
      if (!canAffordGold(NAME_CHANGE_COST)) {
        if (onOpenInsufficientGold) onOpenInsufficientGold(NAME_CHANGE_COST);
        return;
      }

      if (!deductGold(NAME_CHANGE_COST, `Changed Username to ${newUsername}`)) {
        return;
      }
    }

    updateProfile({
      username: newUsername,
      avatar: selectedAvatar,
      bio: bio.trim(),
      country,
    });
    setIsEditing(false);
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Player Profile"
      subtitle={`Player ID: ${profile.id}`}
      icon={<User className="w-6 h-6" />}
      maxWidth="lg"
    >
      {/* Header Banner & Avatar */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-slate-900/60 border border-slate-800 rounded-2xl mb-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-4xl shadow-lg shadow-purple-500/30 border-2 border-purple-400/40">
            {profile.avatar}
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black rounded-md border border-amber-300">
            LVL {profile.level}
          </span>
        </div>

        {/* Username & Rank */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="text-xl font-black text-white">{profile.username}</h2>
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-extrabold rounded-lg border border-blue-500/30 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {profile.rank}
            </span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-extrabold rounded-lg border border-amber-500/30 flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" />
              {profile.gold} Gold
            </span>
          </div>
          <p className="text-xs text-slate-300 italic mb-3">{profile.bio || 'No bio set.'}</p>

          {/* XP Progress */}
          <ProgressBar
            current={profile.xp}
            max={neededXP}
            label={`Level ${profile.level} Progress`}
            sublabel={`${profile.xp} / ${neededXP} XP`}
            gradient="blue-purple"
          />
        </div>
      </div>

      {/* Profile Edit Section */}
      {isEditing ? (
        <div className="space-y-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-200">Edit Profile Information</h3>

          {/* Username input with 500 Gold cost note */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-400">Username</label>
              <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" /> Changing Name Costs 500 Gold
              </span>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Choose Avatar</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`p-2 text-2xl rounded-xl border transition-all cursor-pointer ${
                    selectedAvatar === emoji
                      ? 'bg-blue-600/30 border-blue-400 scale-110 shadow-glow-blue'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Country selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Bio input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Bio</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about your puzzle strategy..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={handleSave} icon={<Check className="w-3.5 h-3.5" />}>
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} icon={<Edit2 className="w-3.5 h-3.5" />}>
            Edit Profile
          </Button>
        </div>
      )}
    </ModalContainer>
  );
};
