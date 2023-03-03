// Inheritance
import {Person} from "./Person.mjs";
import {Phone} from "./Phone.mjs";

export class Student extends Person {
    parentPhone;
    tutor;

    constructor(name, DOB, gender, city, school, stream, data = {phone: "-", parentPhone: null, tutor: null}) {
        super(name, DOB, gender, city, school);
        this.stream = stream;
        // in line
        [this.phone, this.parentPhone, this.tutor] = [data.phone, data.parentPhone, data.tutor];
    }

    // Encapsulation
    getId() {
        return this.id;
    }

    setID(id) {
        this.id = id;
    }

    schoolYear() {
        if (this.calculateAge() === 18) {
            return `is in the Second Year of A/L`;
        } else if (this.calculateAge() < 18 && this.calculateAge() > 16) {
            return `is in the First Year of O/L`;
        } else if (this.calculateAge() > 18) {
            return `has already left the School`;
        } else {
            return `is a primary student`;
        }
    }

    bio() {
        let gen;
        if (this.getGender() === 'female') {
            gen = 'She';
        } else {
            gen = 'He';
        }
        return `${this.name} is born in ${this.getDOB()}.
       <br> ${gen} lives in ${this.city}.
       <br> ${gen} is ${this.calculateAge()} years old.
       <br> ${gen} studies in ${this.school} and ${gen} ${this.schoolYear()}.
       <br> Student ID of ${this.name} is ${this.getId()}.`;
    };

    // Notes, results, requests, etc...
    citation(message) {
        if (this.phone) {
            return Phone.sms(this.phone, message);
        }
        throw new Error(`Sorry, we have not the phone of the student ${this.name} !!!`);
    }

    parentCitation(message) {
        if (this.parentPhone) {
            Phone.sms(this.parentPhone, message);
        }
        throw new Error(`Sorry, we have not the parent phone of the student ${this.name} !!!`);
    }

}
