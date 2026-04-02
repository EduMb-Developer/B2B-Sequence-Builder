import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);
const ALLOWED_DOMAIN = 'humanfunnel.es';

function isAllowedEmail(email) {
  return email && email.endsWith('@' + ALLOWED_DOMAIN);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAndSetUser = async (session) => {
    if (!session?.user) {
      setUser(null);
      setDenied(false);
      return;
    }
    if (isAllowedEmail(session.user.email)) {
      setUser(session.user);
      setDenied(false);
    } else {
      await supabase.auth.signOut();
      setUser(null);
      setDenied(true);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAndSetUser(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAndSetUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setDenied(false);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { hd: ALLOWED_DOMAIN },
      },
    });
    if (error) console.error('Login error:', error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const getAccessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  return (
    <AuthContext.Provider value={{ user, loading, denied, signInWithGoogle, signOut, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
