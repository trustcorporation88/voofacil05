'use client';

import { Menu, Bell, User, Heart, LogOut, LogIn, History as HistoryIcon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface NavbarProps {
  unreadCount: number;
  showUserMenu: boolean;
  setShowUserMenu: (v: boolean) => void;
  onNotifications: () => void;
  onFavorites: () => void;
  onHistory: () => void;
  onAlerts: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export function LandingNavbar({
  unreadCount,
  showUserMenu,
  setShowUserMenu,
  onNotifications,
  onFavorites,
  onHistory,
  onAlerts,
  onLogin,
  onRegister,
}: NavbarProps) {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 w-full z-50 glass-nav border-b border-brand-gray-300/30">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center cursor-pointer">
          <Image src="/logo.png" alt="Cortex Airlines" width={234} height={78} className="object-contain h-[73px] w-auto" />
        </div>

        <div className="hidden md:flex items-center gap-12">
          {['Início', 'Valores', 'Benefícios', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`text-sm uppercase tracking-[0.2em] font-medium transition-colors ${
                item === 'Início'
                  ? 'text-brand-primary border-b-2 border-brand-primary'
                  : 'text-brand-gray-600 hover:text-brand-primary'
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin text-brand-gray-500" />
          ) : session ? (
            <>
              <button
                onClick={onNotifications}
                className="relative p-2 text-brand-gray-600 hover:text-brand-charcoal transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-charcoal border border-brand-charcoal/20 px-6 py-2.5 rounded-full hover:bg-brand-charcoal hover:text-white transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{session.user?.name || session.user?.email?.split('@')[0]}</span>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-brand-gray-300/50 py-2 z-50">
                      <button onClick={() => { onFavorites(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 hover:bg-brand-surface flex items-center gap-2 text-brand-gray-600 text-sm">
                        <Heart className="w-4 h-4" /> Favoritos
                      </button>
                      <button onClick={() => { onHistory(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 hover:bg-brand-surface flex items-center gap-2 text-brand-gray-600 text-sm">
                        <HistoryIcon className="w-4 h-4" /> Histórico
                      </button>
                      <button onClick={() => { onAlerts(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 hover:bg-brand-surface flex items-center gap-2 text-brand-gray-600 text-sm">
                        <Bell className="w-4 h-4" /> Alertas
                      </button>
                      <hr className="my-2 border-brand-gray-300/50" />
                      <button onClick={() => { signOut(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm">
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-charcoal border border-brand-charcoal/20 px-6 py-2.5 rounded-full hover:bg-brand-charcoal hover:text-white transition-all duration-300"
              >
                <LogIn className="w-4 h-4" /> Entrar
              </button>
              <button
                onClick={onRegister}
                className="hidden sm:flex text-xs uppercase tracking-widest font-semibold bg-brand-charcoal text-white px-6 py-2.5 rounded-full hover:bg-brand-primary transition-all duration-300"
              >
                Cadastrar
              </button>
            </>
          )}
          <button className="md:hidden text-brand-primary">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </header>
  );
}
