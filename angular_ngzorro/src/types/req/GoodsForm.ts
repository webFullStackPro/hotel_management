export class GoodsForm {
  id?: number;
  name?: string;
  price?: number;

  constructor(values: Partial<GoodsForm>) {
    Object.assign(this, values);
  }
}
