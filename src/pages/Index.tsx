import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isFriday, setIsFriday] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Все');

  useEffect(() => {
    const today = new Date().getDay();
    setIsFriday(today === 5);
    
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const products = [
    { id: 1, name: 'Диван "Комфорт"', price: 45000, category: 'Мебель', image: '🛋️' },
    { id: 2, name: 'Обеденный стол', price: 28000, category: 'Мебель', image: '🪑' },
    { id: 3, name: 'Набор шоколада', price: 1200, category: 'Сладости', image: '🍫' },
    { id: 4, name: 'Торт "Прага"', price: 890, category: 'Сладости', image: '🎂' },
    { id: 5, name: 'Корм для собак', price: 2500, category: 'Зоо-товары', image: '🐕' },
    { id: 6, name: 'Когтеточка', price: 1800, category: 'Зоо-товары', image: '🐱' },
    { id: 7, name: 'Фруктовый набор', price: 2200, category: 'Еда', image: '🍎' },
    { id: 8, name: 'Сыр "Пармезан"', price: 890, category: 'Еда', image: '🧀' },
  ];

  const categories = ['Все', 'Мебель', 'Сладости', 'Зоо-товары', 'Еда'];

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    toast.success('Товар добавлен в корзину');
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    toast.success('Вы успешно вошли в аккаунт');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Корзина пуста');
      return;
    }
    toast.success('Заказ оформлен! Письмо с подтверждением отправлено на вашу почту');
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((sum, item) => 
    sum + calculatePrice(item.price) * item.quantity, 0
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-primary glow-text">лист.рф</h1>
              {isFriday && (
                <Badge className="bg-black text-yellow-400 border-yellow-400 animate-pulse">
                  ЧЁРНАЯ ПЯТНИЦА -35%
                </Badge>
              )}
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Главная</a>
              <a href="#catalog" className="text-foreground hover:text-primary transition-colors">Каталог</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">О магазине</a>
              <a href="#history" className="text-foreground hover:text-primary transition-colors">История</a>
              <a href="#profile" className="text-foreground hover:text-primary transition-colors">Профиль</a>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} />
              </Button>

              {!isAuthenticated ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="glow-button">
                      <Icon name="LogIn" size={18} />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход в аккаунт</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Пароль</Label>
                        <Input id="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full glow-button">Войти</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
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
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cartItems.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                    ) : (
                      <>
                        {cartItems.map(item => (
                          <Card key={item.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{item.image}</span>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {calculatePrice(item.price)} ₽
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="icon" 
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button 
                                  size="icon" 
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Icon name="Plus" size={16} />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                        <div className="border-t pt-4">
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
                  </div>
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

        <div id="catalog" className="mb-8 flex flex-wrap gap-2 justify-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 glow-card">
              <div className="p-6">
                <div className="text-6xl mb-4 text-center">{product.image}</div>
                <Badge className="mb-2">{product.category}</Badge>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
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

      <section id="about" className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 glow-text">О магазине лист.рф</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Мы предлагаем широкий ассортимент товаров для дома, мебель, продукты питания, 
            сладости и всё необходимое для ваших питомцев. Каждую пятницу у нас Чёрная пятница 
            со скидкой 35% на все товары!
          </p>
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
