import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const features = [
    { icon: '🚚', title: 'Быстрая доставка', description: 'Доставим ваш заказ в течение 1-3 дней' },
    { icon: '💳', title: 'Безопасная оплата', description: 'Все платежи защищены SSL-сертификатом' },
    { icon: '🎁', title: 'Бонусная программа', description: 'Накапливайте баллы и получайте скидки' },
    { icon: '📞', title: 'Поддержка 24/7', description: 'Наша команда всегда готова помочь' },
    { icon: '✨', title: 'Качество товаров', description: 'Работаем только с проверенными поставщиками' },
    { icon: '💯', title: 'Гарантия возврата', description: '30 дней на возврат товара без вопросов' },
  ];

  const stats = [
    { value: '10,000+', label: 'Товаров в каталоге' },
    { value: '50,000+', label: 'Довольных клиентов' },
    { value: '99.8%', label: 'Положительных отзывов' },
    { value: '5 лет', label: 'На рынке' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-primary">О магазине</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 glow-text">лист.рф</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Мы создали универсальный интернет-магазин, где каждый найдёт всё необходимое для дома, 
            семьи и питомцев. Наша миссия — сделать онлайн-шопинг удобным, быстрым и выгодным.
          </p>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">Наши преимущества</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-all glow-card">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted rounded-lg p-12 mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">Наши достижения</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-6">Специальное предложение</h3>
          <Card className="p-8 max-w-2xl mx-auto bg-black text-yellow-400 border-yellow-400">
            <div className="text-6xl mb-4">🎉</div>
            <h4 className="text-2xl font-bold mb-4">Чёрная пятница каждую пятницу!</h4>
            <p className="text-lg mb-2">
              Только у нас: каждую пятницу скидка <strong>35%</strong> на все товары в каталоге
            </p>
            <p className="text-sm opacity-80">
              Акция действует автоматически, никаких промокодов не требуется
            </p>
          </Card>
        </section>

        <section className="text-center">
          <h3 className="text-3xl font-bold mb-4">Свяжитесь с нами</h3>
          <p className="text-muted-foreground mb-6">Мы всегда рады вашим вопросам и предложениям</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Icon name="Mail" size={20} />
              info@лист.рф
            </Button>
            <Button size="lg" variant="outline">
              <Icon name="Phone" size={20} />
              8 (800) 555-35-35
            </Button>
          </div>
        </section>
      </div>

      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(22, 163, 74, 0.3);
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

export default About;
