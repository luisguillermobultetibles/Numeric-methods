// Modalidades ontológicas, deónticas, etc...

import {WebSystemObject} from './WebSystemObject';

// Polimórfica, debe heredar de Relation cuando se implmente
class DeonticModality extends WebSystemObject {
  static Restriction = class extends DeonticModality {
  };
  static Prohibition = class extends DeonticModality.Restriction {
  };
  static Obligation = class extends DeonticModality.Restriction {
  };

  static Permission = class extends DeonticModality {
  };
  static Alternative = class extends DeonticModality.Permission {
  };
  static Option = class extends DeonticModality.Permission {
  };

  constructor(name) {
    super();
    this.name = name;
  }
}