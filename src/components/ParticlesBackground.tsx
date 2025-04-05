import { useCallback } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0"
      style={{ zIndex: 0 }}
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0
        },
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        particles: {
          color: {
            value: "#FFD700",
          },
          links: {
            enable: false,
          },
          move: {
            direction: "bottom",
            enable: true,
            outModes: {
              default: "out",
            },
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100,
          },
          opacity: {
            value: 0.8,
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.4,
              sync: false
            }
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 3, max: 5 },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.4,
              opacity: 1,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}