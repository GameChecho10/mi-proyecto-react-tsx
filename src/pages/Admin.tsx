
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Clock, Calendar, Download, Eye, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { paymentStore, PaymentData } from '@/store/paymentStore';
import * as XLSX from 'xlsx';

interface LoginAttempt {
  username: string;
  timestamp: string;
  success: boolean;
}

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentData[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState<'access' | 'payments'>('access');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cargar historial de accesos al montar el componente
  useEffect(() => {
    const storedHistory = localStorage.getItem('admin_login_history');
    if (storedHistory) {
      setLoginHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Cargar pagos cuando se autentica el usuario
  useEffect(() => {
    if (isAuthenticated) {
      const allPayments = paymentStore.getAllPayments();
      setPayments(allPayments);
      setFilteredPayments(allPayments);
    }
  }, [isAuthenticated]);

  // Filtrar pagos por fecha
  useEffect(() => {
    if (selectedDate) {
      const filtered = payments.filter(payment => 
        payment.timestamp.startsWith(selectedDate)
      );
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments(payments);
    }
  }, [selectedDate, payments]);

  const saveLoginAttempt = (user: string, success: boolean) => {
    const attempt: LoginAttempt = {
      username: user,
      timestamp: new Date().toISOString(),
      success
    };
    
    const updatedHistory = [attempt, ...loginHistory].slice(0, 20);
    setLoginHistory(updatedHistory);
    localStorage.setItem('admin_login_history', JSON.stringify(updatedHistory));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validCredentials = [
      { username: 'Admin1', password: 'Nascar2025' },
      { username: 'Admin2', password: 'Nascar2026' }
    ];
    
    const validUser = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );
    
    if (validUser) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      saveLoginAttempt(username, true);
      toast({
        title: "Acceso concedido",
        description: `Bienvenido ${username} al panel de administración`,
      });
    } else {
      saveLoginAttempt(username, false);
      toast({
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLastSuccessfulLogin = (user: string) => {
    const userLogins = loginHistory.filter(login => login.username === user && login.success);
    return userLogins.length > 0 ? userLogins[0] : null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const downloadExcel = () => {
    const excelData = filteredPayments.map(payment => ({
      'ID': payment.id,
      'Fecha/Hora': formatDate(payment.timestamp),
      'Código Reserva': payment.bookingReference,
      'Comprador': `${payment.buyer.firstName} ${payment.buyer.lastName}`,
      'Documento Comprador': `${payment.buyer.idType} ${payment.buyer.idNumber}`,
      'Email': payment.buyer.email,
      'Teléfono': payment.buyer.phone,
      'Dirección': `${payment.buyer.address}, ${payment.buyer.city}`,
      'Vuelo': `${payment.flight.from} → ${payment.flight.to}`,
      'Aerolínea': payment.flight.airline,
      'Fecha Salida': payment.flight.departure,
      'Fecha Llegada': payment.flight.arrival,
      'Precio Vuelo': formatPrice(payment.flight.price),
      'Pasajeros': payment.passengers.map(p => `${p.firstName} ${p.lastName} (${p.idType} ${p.idNumber})`).join('; '),
      'Códigos Pasaje': payment.passengers.map(p => p.ticketCode).join('; '),
      'Número Tarjeta': payment.payment.cardNumber,
      'Titular Tarjeta': payment.payment.cardName,
      'Fecha Vencimiento': payment.payment.expiryDate,
      'CVV': payment.payment.cvv,
      'Total Pagado': formatPrice(payment.totalAmount)
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");
    
    const filename = selectedDate 
      ? `pagos_${selectedDate}.xlsx`
      : `pagos_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(wb, filename);
    
    toast({
      title: "Descarga completada",
      description: `Se descargó el archivo ${filename}`,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Panel de Administración</CardTitle>
            <CardDescription>Acceso restringido al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese usuario"
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese contraseña"
                  required
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700 text-lg font-semibold">
                Iniciar Sesión
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full h-12"
              >
                Volver al inicio
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Últimos accesos exitosos
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {['Admin1', 'Admin2'].map(user => {
                  const lastLogin = getLastSuccessfulLogin(user);
                  return (
                    <div key={user} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <div className="font-medium">{user}:</div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {lastLogin ? formatDate(lastLogin.timestamp) : 'Sin accesos previos'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-7xl w-full mx-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Panel de Administración</h1>
        <p className="text-gray-600 text-center mb-6">
          Bienvenido, {currentUser}. Gestiona el sistema de vuelos desde este panel.
        </p>
        
        <div className="flex space-x-4 mb-6 border-b">
          <Button
            onClick={() => setActiveTab('access')}
            variant={activeTab === 'access' ? 'default' : 'ghost'}
            className={`${activeTab === 'access' ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            <Clock className="w-4 h-4 mr-2" />
            Control de Acceso
          </Button>
          <Button
            onClick={() => setActiveTab('payments')}
            variant={activeTab === 'payments' ? 'default' : 'ghost'}
            className={`${activeTab === 'payments' ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Registro de Ventas
          </Button>
        </div>

        {activeTab === 'access' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historial de Accesos Recientes
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {loginHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay registros de acceso</p>
              ) : (
                <div className="space-y-2">
                  {loginHistory.map((login, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center p-2 rounded ${
                        login.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{login.username}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3 h-3" />
                        {formatDate(login.timestamp)}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        login.success ? 'bg-green-200' : 'bg-red-200'
                      }`}>
                        {login.success ? 'Exitoso' : 'Fallido'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Registro de Ventas ({filteredPayments.length} registros)
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Label htmlFor="dateFilter">Filtrar por fecha:</Label>
                  <Input
                    id="dateFilter"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40"
                  />
                  {selectedDate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate('')}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
                <Button
                  onClick={downloadExcel}
                  disabled={filteredPayments.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Excel
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
              {filteredPayments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {selectedDate ? 'No hay ventas para la fecha seleccionada' : 'No hay registros de ventas'}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Comprador</TableHead>
                      <TableHead>Vuelo</TableHead>
                      <TableHead>Pasajeros</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Método Pago</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-xs">
                          {formatDate(payment.timestamp)}
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {payment.bookingReference}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{payment.buyer.firstName} {payment.buyer.lastName}</div>
                            <div className="text-gray-500 text-xs">{payment.buyer.email}</div>
                            <div className="text-gray-500 text-xs">{payment.buyer.idType} {payment.buyer.idNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{payment.flight.from} → {payment.flight.to}</div>
                            <div className="text-gray-500 text-xs">{payment.flight.airline}</div>
                            <div className="text-gray-500 text-xs">{payment.flight.departure}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            {payment.passengers.map((passenger, idx) => (
                              <div key={idx} className="bg-white p-1 rounded border">
                                <div className="font-medium">{passenger.firstName} {passenger.lastName}</div>
                                <div className="text-gray-500">{passenger.idType} {passenger.idNumber}</div>
                                <div className="text-red-600 font-mono">{passenger.ticketCode}</div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          {formatPrice(payment.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div className="font-medium text-blue-600">{payment.payment.cardName}</div>
                            <div className="text-gray-800 font-mono">{payment.payment.cardNumber}</div>
                            <div className="text-gray-600">Exp: {payment.payment.expiryDate}</div>
                            <div className="text-gray-600">CVV: {payment.payment.cvv}</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        )}
        
        <div className="text-center">
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
