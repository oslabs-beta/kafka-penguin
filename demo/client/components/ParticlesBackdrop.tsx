import * as React from 'react';
import { FC } from 'react';
import Particles from 'react-tsparticles';


const ParticlesBackdrop: FC = () => {
  return (
    <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      minWidth: "100vw",
      minHeight: "100vh",
      zIndex: -10
    }}
  >
    <Particles
      id="tsparticles"
      options={{
        fullScreen: {
          enable: true,
        },
        fpsLimit: 120,
        particles: {
          number: {
            value: 60,
            density: {
              enable: true,
              value_area: 1000
            }
          },
          color: {
            value: ['#72cff8', '#4fc3f7']
          },
          shape: {
            type: "edge",
            stroke: {
              width: 0,
              color: "#f4f4f4"
            },
            polygon: {
              nb_sides: 5
            },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 4,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 50,
            color: '#ff7961',
            opacity: 0.5,
            width: 1
          },
          move: {
            enable: true,
            speed: 3,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        retina_detect: true
      }}
    />
  </div>
)};

export default ParticlesBackdrop