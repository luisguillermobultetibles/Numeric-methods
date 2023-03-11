// Parent class
import {WebSystemObject} from './WebSystemObject.js';

export class Person extends WebSystemObject {
  constructor(name, lastName, city, school) {
    super();
    this.name = name;
    this.lastName = lastName;
    this.city = city;
    this.school = school;
  };

  get fullName () {
    return `${ this.name } ${ this.lastName }`;
  }

  // Encapsulation
  getGender() {
    return this.gender;
  }

  setGender(gender) {
    this.gender = gender;
  }

  getDOB() {
    return this.dob;
  }

  setDOB(DOB) {
    this.dob = DOB;
  }

  calculateAge() {
    return new Date().getFullYear() - this.getDOB();
  } ;

  // Abstract Method
  bio() {
    throw new Error('Abstract Method');
  };
};

