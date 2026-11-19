import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Incident, CAPA, Alert, Role, AIAnalysis } from './types';
import { DEMO_INCIDENTS, DEMO_CAPAS, DEMO_ALERTS } from './demoData';
import { generateAIAnalysis } from './aiEngine';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppState {
  role: Role;
  userName: string;
  incidents: Incident[];
  capas: CAPA[];
  alerts: Alert[];
  toasts: Toast[];
  setRole: (role: Role, name: string) => void;
  logout: () => void;
  addIncident: (data: Omit<Incident, 'id' | 'createdAt' | 'aiAnalysis' | 'status'>) => Incident;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  addCAPA: (data: Omit<CAPA, 'id' | 'createdAt'>) => void;
  updateCAPAStatus: (id: string, status: CAPA['status']) => void;
  acknowledgeAlert: (id: string) => void;
  addAlert: (data: Omit<Alert, 'id'>) => void;
  pushToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

let counter = 100;

function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${String(counter).padStart(3, '0')}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(() => {
    if (typeof window === 'undefined') return null;
    return (localStorage.getItem('safesense-role') as Role | null) ?? null;
  });
  const [userName, setUserName] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('safesense-user-name') ?? '';
  });
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    if (typeof window === 'undefined') return DEMO_INCIDENTS;
    try {
      const saved = localStorage.getItem('safesense-incidents');
      return saved ? JSON.parse(saved) : DEMO_INCIDENTS;
    } catch {
      return DEMO_INCIDENTS;
    }
  });
  const [capas, setCapas] = useState<CAPA[]>(() => {
    if (typeof window === 'undefined') return DEMO_CAPAS;
    try {
      const saved = localStorage.getItem('safesense-capas');
      return saved ? JSON.parse(saved) : DEMO_CAPAS;
    } catch {
      return DEMO_CAPAS;
    }
  });
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    if (typeof window === 'undefined') return DEMO_ALERTS;
    try {
      const saved = localStorage.getItem('safesense-alerts');
      return saved ? JSON.parse(saved) : DEMO_ALERTS;
    } catch {
      return DEMO_ALERTS;
    }
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Keep the prototype usable after refresh without requiring a backend/database.
  useEffect(() => {
    localStorage.setItem('safesense-incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('safesense-capas', JSON.stringify(capas));
  }, [capas]);

  useEffect(() => {
    localStorage.setItem('safesense-alerts', JSON.stringify(alerts));
  }, [alerts]);

  const pushToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = nextId('TOAST');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setRole = useCallback((r: Role, name: string) => {
    setRoleState(r);
    setUserName(name);
    localStorage.setItem('safesense-role', r);
    localStorage.setItem('safesense-user-name', name);
  }, []);

  const logout = useCallback(() => {
    setRoleState(null);
    setUserName('');
    localStorage.removeItem('safesense-role');
    localStorage.removeItem('safesense-user-name');
  }, []);

  const addIncident = useCallback(
    (data: Omit<Incident, 'id' | 'createdAt' | 'aiAnalysis' | 'status'>): Incident => {
      const analysis = generateAIAnalysis(data.description, data.hazardType, data.severity);
      const incident: Incident = {
        ...data,
        id: nextId('INC'),
        createdAt: new Date().toISOString(),
        status: 'Submitted',
        aiAnalysis: analysis,
      };
      setIncidents((prev) => [incident, ...prev]);

      if (analysis.riskLevel === 'Critical' || analysis.riskLevel === 'High') {
        const alert: Alert = {
          id: nextId('ALT'),
          type: analysis.riskLevel === 'Critical' ? 'critical' : 'warning',
          title: `${analysis.riskLevel} risk ${analysis.hazardCategory.toLowerCase()} hazard reported`,
          description: `${incident.title} — ${incident.department}. Risk score: ${analysis.riskScore}/10. ${analysis.correctiveAction}`,
          department: incident.department,
          dateTime: new Date().toISOString(),
          acknowledged: false,
        };
        setAlerts((prev) => [alert, ...prev]);
      }

      return incident;
    },
    [],
  );

  const updateIncidentStatus = useCallback((id: string, status: Incident['status']) => {
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }, []);

  const addCAPA = useCallback((data: Omit<CAPA, 'id' | 'createdAt'>) => {
    const capa: CAPA = {
      ...data,
      id: nextId('CAPA'),
      createdAt: new Date().toISOString(),
    };
    setCapas((prev) => [capa, ...prev]);
  }, []);

  const updateCAPAStatus = useCallback((id: string, status: CAPA['status']) => {
    setCapas((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              completedAt: status === 'Completed' ? new Date().toISOString() : c.completedAt,
            }
          : c,
      ),
    );
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  const addAlert = useCallback((data: Omit<Alert, 'id'>) => {
    setAlerts((prev) => [{ ...data, id: nextId('ALT') }, ...prev]);
  }, []);

  if (!role) {
    return (
      <AppContext.Provider
        value={{
          role: 'employee',
          userName: '',
          incidents,
          capas,
          alerts,
          toasts,
          setRole,
          logout,
          addIncident,
          updateIncidentStatus,
          addCAPA,
          updateCAPAStatus,
          acknowledgeAlert,
          addAlert,
          pushToast,
          removeToast,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider
      value={{
        role,
        userName,
        incidents,
        capas,
        alerts,
        toasts,
        setRole,
        logout,
        addIncident,
        updateIncidentStatus,
        addCAPA,
        updateCAPAStatus,
        acknowledgeAlert,
        addAlert,
        pushToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
