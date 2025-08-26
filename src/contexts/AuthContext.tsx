import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture: string;
  entryDate: string;
  role: 'admin' | 'user';
  department: string;
  accessGroups: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  currentRole: 'admin' | 'user';
  switchRole: (role: 'admin' | 'user') => void;
  language: 'en' | 'es' | 'pt';
  setLanguage: (lang: 'en' | 'es' | 'pt') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Sarah Johnson',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b68e8bdd?w=150&h=150&fit=crop&crop=face',
    entryDate: '2020-01-15',
    role: 'admin',
    department: 'IT Administration',
    accessGroups: ['admin', 'managers', 'employees']
  },
  {
    id: '2',
    email: 'user@company.com',
    name: 'Michael Chen',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    entryDate: '2021-03-22',
    role: 'user',
    department: 'Marketing',
    accessGroups: ['employees']
  }
];

// Translation strings
export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    assetsManagement: 'Assets Management',
    assets: 'Assets',
    reservations: 'Reservations',
    employees: 'Employees',
    customization: 'Customization',
    events: 'Events',
    purchaseHistory: 'Purchase History',
    
    // Common
    login: 'Login',
    logout: 'Logout',
    welcome: 'Welcome',
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    view: 'View',
    
    // Auth
    signInSSO: 'Sign in with SSO',
    email: 'Email',
    password: 'Password',
    
    // Roles
    administrator: 'Administrator',
    regularUser: 'Regular User',
    switchToAdmin: 'Switch to Admin View',
    switchToUser: 'Switch to User View',
    
    // Assets
    assetCatalog: 'Asset Catalog',
    assetName: 'Asset Name',
    category: 'Category',
    price: 'Price',
    availability: 'Availability',
    addToCart: 'Add to Cart',
    purchase: 'Purchase',
    
    // Events
    auction: 'Auction',
    sortition: 'Sortition',
    liveAuction: 'Live Auction',
    upcomingEvent: 'Upcoming Event',
    bidNow: 'Bid Now',
    joinEvent: 'Join Event',
    
    // Payment
    payrollDeduction: 'Payroll Deduction',
    creditCard: 'Credit Card',
    debitCard: 'Debit Card',
    pix: 'PIX',
    
    // Status
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    active: 'Active',
    inactive: 'Inactive'
  },
  es: {
    // Navigation
    dashboard: 'Panel de Control',
    assetsManagement: 'Gestión de Activos',
    assets: 'Activos',
    reservations: 'Reservas',
    employees: 'Empleados',
    customization: 'Personalización',
    events: 'Eventos',
    purchaseHistory: 'Historial de Compras',
    
    // Common
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    welcome: 'Bienvenido',
    loading: 'Cargando...',
    search: 'Buscar',
    filter: 'Filtrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Agregar',
    view: 'Ver',
    
    // Auth
    signInSSO: 'Iniciar sesión con SSO',
    email: 'Correo electrónico',
    password: 'Contraseña',
    
    // Roles
    administrator: 'Administrador',
    regularUser: 'Usuario Regular',
    switchToAdmin: 'Cambiar a Vista de Admin',
    switchToUser: 'Cambiar a Vista de Usuario',
    
    // Assets
    assetCatalog: 'Catálogo de Activos',
    assetName: 'Nombre del Activo',
    category: 'Categoría',
    price: 'Precio',
    availability: 'Disponibilidad',
    addToCart: 'Agregar al Carrito',
    purchase: 'Comprar',
    
    // Events
    auction: 'Subasta',
    sortition: 'Sorteo',
    liveAuction: 'Subasta en Vivo',
    upcomingEvent: 'Evento Próximo',
    bidNow: 'Pujar Ahora',
    joinEvent: 'Unirse al Evento',
    
    // Payment
    payrollDeduction: 'Deducción de Nómina',
    creditCard: 'Tarjeta de Crédito',
    debitCard: 'Tarjeta de Débito',
    pix: 'PIX',
    
    // Status
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    completed: 'Completado',
    active: 'Activo',
    inactive: 'Inactivo'
  },
  pt: {
    // Navigation
    dashboard: 'Painel de Controle',
    assetsManagement: 'Gestão de Ativos',
    assets: 'Ativos',
    reservations: 'Reservas',
    employees: 'Funcionários',
    customization: 'Personalização',
    events: 'Eventos',
    purchaseHistory: 'Histórico de Compras',
    
    // Common
    login: 'Entrar',
    logout: 'Sair',
    welcome: 'Bem-vindo',
    loading: 'Carregando...',
    search: 'Pesquisar',
    filter: 'Filtrar',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    add: 'Adicionar',
    view: 'Visualizar',
    
    // Auth
    signInSSO: 'Entrar com SSO',
    email: 'E-mail',
    password: 'Senha',
    
    // Roles
    administrator: 'Administrador',
    regularUser: 'Usuário Regular',
    switchToAdmin: 'Alternar para Visão Admin',
    switchToUser: 'Alternar para Visão Usuário',
    
    // Assets
    assetCatalog: 'Catálogo de Ativos',
    assetName: 'Nome do Ativo',
    category: 'Categoria',
    price: 'Preço',
    availability: 'Disponibilidade',
    addToCart: 'Adicionar ao Carrinho',
    purchase: 'Comprar',
    
    // Events
    auction: 'Leilão',
    sortition: 'Sorteio',
    liveAuction: 'Leilão ao Vivo',
    upcomingEvent: 'Evento Próximo',
    bidNow: 'Dar Lance',
    joinEvent: 'Participar do Evento',
    
    // Payment
    payrollDeduction: 'Desconto em Folha',
    creditCard: 'Cartão de Crédito',
    debitCard: 'Cartão de Débito',
    pix: 'PIX',
    
    // Status
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    completed: 'Concluído',
    active: 'Ativo',
    inactive: 'Inativo'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<'admin' | 'user'>('user');
  const [language, setLanguage] = useState<'en' | 'es' | 'pt'>('en');

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('assethub_user');
    const storedRole = localStorage.getItem('assethub_role');
    const storedLang = localStorage.getItem('assethub_language');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedRole) {
      setCurrentRole(storedRole as 'admin' | 'user');
    }
    if (storedLang) {
      setLanguage(storedLang as 'en' | 'es' | 'pt');
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setCurrentRole(foundUser.role);
      localStorage.setItem('assethub_user', JSON.stringify(foundUser));
      localStorage.setItem('assethub_role', foundUser.role);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentRole('user');
    localStorage.removeItem('assethub_user');
    localStorage.removeItem('assethub_role');
  };

  const switchRole = (role: 'admin' | 'user') => {
    if (user?.role === 'admin') {
      setCurrentRole(role);
      localStorage.setItem('assethub_role', role);
    }
  };

  const handleSetLanguage = (lang: 'en' | 'es' | 'pt') => {
    setLanguage(lang);
    localStorage.setItem('assethub_language', lang);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      currentRole,
      switchRole,
      language,
      setLanguage: handleSetLanguage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { language } = useAuth();
  return {
    t: (key: keyof typeof translations.en): string => {
      return translations[language][key] || key;
    }
  };
};