import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface DeliveryNotificationProps {
  orderItems: Array<{
    name: string;
    image: string;
    quantity: number;
  }>;
  onComplete: () => void;
}

const DeliveryNotification = ({ orderItems, onComplete }: DeliveryNotificationProps) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isDelivered, setIsDelivered] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isDelivered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isDelivered]);

  const handlePickup = () => {
    setIsDelivered(true);
  };

  if (isDelivered) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
        <Card className="p-12 max-w-2xl mx-4 text-center">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-4xl font-bold mb-4 text-primary">
            Вы успешно забрали товар!
          </h2>
          <p className="text-2xl text-muted-foreground mb-8">
            Спасибо за покупку
          </p>
          <Button size="lg" onClick={onComplete} className="glow-button">
            <Icon name="Check" size={24} />
            Закрыть
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in-right">
      <Card className="p-6 border-2 border-primary shadow-2xl glow-card">
        <div className="flex items-start gap-4">
          <div className="text-5xl">📦</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Заказ оформлен!</h3>
            <p className="text-muted-foreground mb-3">
              Ваш заказ уже в пути
            </p>
            
            <div className="space-y-2 mb-4">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">{item.image}</span>
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground mb-2">Прибудет через:</p>
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={24} className="text-primary" />
                <span className="text-3xl font-bold text-primary">
                  {timeLeft}с
                </span>
              </div>
            </div>

            {timeLeft === 0 && (
              <Button onClick={handlePickup} className="w-full glow-button animate-pulse">
                <Icon name="Package" size={18} />
                Забрать товар
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DeliveryNotification;
