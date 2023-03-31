import {WebSystemObject} from './WebSystemObject';

export class Vehicle extends WebSystemObject {
  static _NO = 0; // Son tracción
  static _FWD = 1; // Front Wheel Drive o tracción delantera.
  static _RWD = 2; // Rear Wheel Drive o tracción trasera (+ motos y bicibletas)
  static _AWD = 3; // All Wheel Drive o en todas las ruedas.
  static _4WD = 4; // Four Wheel Drive, tracción 4×4 conectable.
  static _4X4 = 5; // La fuerza del motor se reparte en proporción 50 % – 50 %
                   // entre los ejes delanteros y traseros de un vehículo. Pero
                   // al no tener diferencial trasero, es recomendable que sea
                   // usada to do el tiempo, por lo que tiene sus modos:
  static _4X4_2H = 6; // 2H (convierte la fuerza 4×4 a 4×2)
  static _4X4_4H = 7; // 4H (funciona como una 4WD, con fuerza en cada una de las cuatro ruedas)
  static _4X4_4L = 8; // 4L (funciona como una 4×4 real, con fuerza pareja en los ejes)

  constructor(wheels, topSpeed, traction = Vehicle._RWD) {
    super();
    this.wheels = wheels;
    this.topSpeed = topSpeed;
    this.traction = traction;
  }

}

class Bicycle extends Vehicle {
  constructor(topSpeed) {
    super(2, topSpeed);
  }

}

class Motor extends Vehicle {
  constructor(topSpeed) {
    super(2, topSpeed);
  }

}

class Car extends Vehicle {
  constructor(topSpeed) {
    super(4, topSpeed);
  }

}

/*

  incluir aviones:

  Aeronave
    Aerostatos
     Dirigibles
     Globos
    Aerodinos
     Aviones
      De alas fijas (o aeroplanos)
        Monoplanos,
        Biplanos
        Triplanos.
      Rotatorias
       Autogiro
       Helicópteros
       Girodino
       Covertiplano


  Aircraft
    aerostats
     airships
     balloons
    Aircraft
     Planes
      Fixed-wing (or airplane)
        monoplanes,
        biplanes
        Triplanes.
      rotary
       auto spin
       helicopters
       Girodinos
       covertiplanes


*/

