import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { products, categories } from '@/data/products';
import DeliveryNotification from '@/components/DeliveryNotification';

const Index = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isFriday, setIsFriday] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [isRegister, setIsRegister] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryOrder, setDeliveryOrder] = useState<any>(null);

  useEffect(() => {
    const today = new Date().getDay();
    setIsFriday(today === 5);
    
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedCart = localStorage.getItem('cart');
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const filteredProducts = products
    .filter(p => selectedCategory === 'Все' || p.category === selectedCategory)
    .filter(p => 
      searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const calculatePrice = (price: number) => {
    if (isFriday) {
      return Math.round(price * 0.65);
    }
    return price;
  };

  const addToCart = (product: any) => {
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт для добавления товаров в корзину');
      return;
    }
    
    const existingItem = cartItems.find(item => item.id === product.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Товар добавлен в корзину');
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    let updatedCart;
    if (newQuantity < 1) {
      updatedCart = cartItems.filter(item => item.id !== id);
    } else {
      updatedCart = cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    }
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    if (name) {
      localStorage.setItem('userName', name);
    }
    
    toast.success(isRegister ? 'Регистрация прошла успешно!' : 'Вы успешно вошли в аккаунт');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
    toast.success('Вы вышли из аккаунта');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    const order = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: calculatePrice(item.price),
        image: item.image
      })),
      total: totalPrice,
      status: 'pending' as const
    };

    const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    localStorage.setItem('orderHistory', JSON.stringify([order, ...existingOrders]));

    setDeliveryOrder({
      items: cartItems.map(item => ({
        name: item.name,
        image: item.image,
        quantity: item.quantity
      }))
    });

    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  const totalPrice = cartItems.reduce((sum, item) => 
    sum + calculatePrice(item.price) * item.quantity, 0
  );

  return (
    <div className="min-h-screen bg-background">
      {deliveryOrder && (
        <DeliveryNotification
          orderItems={deliveryOrder.items}
          onComplete={() => setDeliveryOrder(null)}
        />
      )}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-primary glow-text cursor-pointer" onClick={() => navigate('/')}>
                лист.рф
              </h1>
              {isFriday && (
                <Badge className="bg-black text-yellow-400 border-yellow-400 animate-pulse">
                  ЧЁРНАЯ ПЯТНИЦА -35%
                </Badge>
              )}
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/')} className="text-foreground hover:text-primary transition-colors">
                Главная
              </button>
              <a href="#catalog" className="text-foreground hover:text-primary transition-colors">
                Каталог
              </a>
              <button onClick={() => navigate('/about')} className="text-foreground hover:text-primary transition-colors">
                О магазине
              </button>
              <button onClick={() => navigate('/history')} className="text-foreground hover:text-primary transition-colors">
                История
              </button>
              <button onClick={() => navigate('/profile')} className="text-foreground hover:text-primary transition-colors">
                Профиль
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} />
              </Button>

              {!isAuthenticated ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="glow-button" onClick={() => setIsRegister(false)}>
                      <Icon name="LogIn" size={18} />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{isRegister ? 'Регистрация' : 'Вход в аккаунт'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAuth} className="space-y-4 mt-4">
                      {isRegister && (
                        <div>
                          <Label htmlFor="name">Имя</Label>
                          <Input id="name" name="name" required />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Пароль</Label>
                        <Input id="password" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full glow-button">
                        {isRegister ? 'Зарегистрироваться' : 'Войти'}
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        className="w-full"
                        onClick={() => setIsRegister(!isRegister)}
                      >
                        {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button variant="outline" onClick={handleLogout}>
                  <Icon name="LogOut" size={18} />
                  Выйти
                </Button>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                        {cartItems.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col">
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                  </SheetHeader>
                  
                  {cartItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      <ScrollArea className="flex-1 -mx-6 px-6">
                        <div className="space-y-4 pr-4">
                          {cartItems.map(item => (
                            <Card key={item.id} className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <span className="text-3xl">{item.image}</span>
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {calculatePrice(item.price)} ₽
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="icon" 
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                                  <Button 
                                    size="icon" 
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold">Итого:</span>
                          <span className="text-2xl font-bold text-primary">{totalPrice} ₽</span>
                        </div>
                        <Button className="w-full glow-button" onClick={handleCheckout}>
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 glow-text">
            Интернет-магазин для всей семьи
          </h2>
          <p className="text-xl text-muted-foreground">
            Мебель, продукты, сладости, зоо-товары и многое другое
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div id="catalog">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-4">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'glow-button' : ''}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 glow-card">
              <div className="p-6">
                <div className="text-6xl mb-4 text-center">{product.image}</div>
                <Badge className="mb-2">{product.category}</Badge>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                )}
                <div className="flex items-center gap-2 mb-4">
                  {isFriday && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.price} ₽
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary">
                    {calculatePrice(product.price)} ₽
                  </span>
                </div>
                <Button 
                  className="w-full glow-button" 
                  onClick={() => addToCart(product)}
                >
                  <Icon name="ShoppingCart" size={18} />
                  В корзину
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(22, 163, 74, 0.3);
        }
        
        .glow-button {
          box-shadow: 0 0 15px rgba(22, 163, 74, 0.3);
          transition: all 0.3s ease;
        }
        
        .glow-button:hover {
          box-shadow: 0 0 25px rgba(22, 163, 74, 0.5);
        }
        
        .glow-card {
          transition: all 0.3s ease;
        }
        
        .glow-card:hover {
          box-shadow: 0 0 20px rgba(22, 163, 74, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Index;