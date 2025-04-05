import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { ParticlesBackground } from '../components/ParticlesBackground';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to Ultra Stream",
      description: "The ultimate streaming platform for all your entertainment needs",
      image: "https://i.postimg.cc/XY13DkZV/brown-female.png?w=800&auto=format&fit=crop"
    },
    {
      title: "Watch Anywhere",
      description: "Stream your favorite content on any device, anytime",
      image: "https://i.postimg.cc/dVbN1hp2/watching-tv.png?w=800&auto=format&fit=crop"
    },
    {
      title: "Secure with VPN",
      description: "Built-in VPN protection for secure and private streaming",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <ParticlesBackground />
      <div className="max-w-4xl w-full bg-card rounded-2xl shadow-xl p-6 md:p-10">
        <div className="flex flex-col items-center mb-10">
          <LogoPlaceholder />
          <h1 className="text-3xl md:text-4xl font-bold text-primary mt-4">Ultra Stream</h1>
        </div>

        <div className="relative overflow-hidden rounded-xl mb-10">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold mt-6 text-center">{slide.title}</h2>
                <p className="text-muted-foreground mt-2 text-center">{slide.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/signup')}
            variant="primary"
          >
            Sign Up
          </Button>
          <Button 
            onClick={() => navigate('/login')}
            variant="secondary"
          >
            Login
          </Button>
        </div>

        <div className="flex justify-center items-center gap-4">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center text-accent-foreground shadow-lg transition-colors"
          >
            ←
          </button>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-6 bg-primary' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center text-accent-foreground shadow-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}