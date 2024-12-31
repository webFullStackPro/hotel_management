export class StaffQueryForm {
  name?: string;
  phone?: string;

  constructor(values: Partial<StaffQueryForm>) {
    Object.assign(this, values);
  }
}
