import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CustomTheme {
  backgroundColor: string;
  textColor: string;
  glowEnabled: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    backgroundColor: '#ffffff',
    textColor: '#16a34a',
    glowEnabled: true
  });

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Пользователь';
    const storedEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const storedTheme = localStorage.getItem('customTheme');
    
    setUserName(storedName);
    setEmail(storedEmail);
    setNewName(storedName);

    if (storedTheme) {
      const parsed = JSON.parse(storedTheme);
      setCustomTheme(parsed);
      applyCustomTheme(parsed);
    }
  }, []);

  const applyCustomTheme = (theme: CustomTheme) => {
    const root = document.documentElement;
    
    if (theme.backgroundColor) {
      root.style.setProperty('--background', theme.backgroundColor);
      root.style.backgroundColor = theme.backgroundColor;
    }
    
    if (theme.textColor) {
      root.style.setProperty('--foreground', theme.textColor);
      root.style.setProperty('--primary', theme.textColor);
      root.style.color = theme.textColor;
    }
    
    const style = document.getElementById('custom-glow-style') || document.createElement('style');
    style.id = 'custom-glow-style';
    
    if (!theme.glowEnabled) {
      style.textContent = `.glow-text, .glow-button, .glow-card { text-shadow: none !important; box-shadow: none !important; }`;
    } else {
      style.textContent = '';
    }
    
    if (!document.getElementById('custom-glow-style')) {
      document.head.appendChild(style);
    }
  };

  const handleNameChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      setUserName(newName);
      localStorage.setItem('userName', newName);
      toast.success('Имя успешно изменено');
    }
  };

  const handleThemeChange = (key: keyof CustomTheme, value: any) => {
    const updated = { ...customTheme, [key]: value };
    setCustomTheme(updated);
    localStorage.setItem('customTheme', JSON.stringify(updated));
    applyCustomTheme(updated);
    toast.success('Настройки темы сохранены');
  };

  const resetTheme = () => {
    const defaultTheme: CustomTheme = {
      backgroundColor: '#ffffff',
      textColor: '#16a34a',
      glowEnabled: true
    };
    setCustomTheme(defaultTheme);
    localStorage.setItem('customTheme', JSON.stringify(defaultTheme));
    applyCustomTheme(defaultTheme);
    toast.success('Тема сброшена на стандартную');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Профиль</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userName}</h2>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">
              <Icon name="Settings" size={18} />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Icon name="Palette" size={18} />
              Кастомная тема
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Настройки профиля</h3>
              <form onSubmit={handleNameChange} className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя пользователя</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Введите ваше имя"
                  />
                </div>
                <div>
                  <Label htmlFor="email-display">Email (только для отображения)</Label>
                  <Input
                    id="email-display"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Icon name="Save" size={18} />
                  Сохранить изменения
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Кастомная тема</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="bg-color">Цвет фона</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={customTheme.backgroundColor}
                      onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={customTheme.backgroundColor}
                      onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text-color">Цвет текста</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={customTheme.textColor}
                      onChange={(e) => handleThemeChange('textColor', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={customTheme.textColor}
                      onChange={(e) => handleThemeChange('textColor', e.target.value)}
                      placeholder="#16a34a"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="glow-toggle" className="text-base">Подсветка текста</Label>
                    <p className="text-sm text-muted-foreground">Эффект свечения на тексте и элементах</p>
                  </div>
                  <Switch
                    id="glow-toggle"
                    checked={customTheme.glowEnabled}
                    onCheckedChange={(checked) => handleThemeChange('glowEnabled', checked)}
                  />
                </div>

                <div className="p-4 border rounded-lg" style={{
                  backgroundColor: customTheme.backgroundColor,
                  color: customTheme.textColor
                }}>
                  <p className={customTheme.glowEnabled ? 'glow-text' : ''}>
                    Предпросмотр: Так будет выглядеть ваша тема
                  </p>
                </div>

                <Button onClick={resetTheme} variant="outline" className="w-full">
                  <Icon name="RotateCcw" size={18} />
                  Сбросить на стандартную тему
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;